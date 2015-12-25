'use strict'
angular.module('main')
  .controller('dnsCtrlList', function (debug, PDD, $q, $window, $scope, $stateParams, $ionicModal, $ionicPopup, $ionicHistory) {
    var alert = $window.alert
    var log = debug('app:domain:dnsList')
    var dnsList = this
    dnsList.domain = $stateParams.domain

    //DNS
    var $newDNSScope = $scope.$new()
    var newDNSRecordModal = $ionicModal.fromTemplateUrl('main/templates/dnsrecord_add.html', {
      scope: $newDNSScope,
      animation: 'slide-in-up'
    })

    $newDNSScope.isEdit = false

    $newDNSScope.clearNewDns = function() {
      $newDNSScope.newDNS = {
        type: 'A',
        admin_mail: '',
        content: '',
        priority: '10',
        weigth: '',
        port: '',
        target: '',
        subdomain: '@',
        ttl: '21600',
        refresh: '',
        retry: '',
        expire: '',
        neg_cache: ''
      }
    }

    $newDNSScope.recordTypeCollection = ['SRV', 'TXT', 'NS', 'MX', 'SOA', 'A', 'AAAA', 'CNAME']

    dnsList.doRefresh = function () {
      return PDD.dns.list(dnsList.domain)
        .then(function (result) {
          if (!result) {
            log('You are now owner of ' + dnsList.domain)
            dnsList.dns = []
            dnsList.owner = false
            return
          }
          dnsList.dns = result.records.reduce(function(prev, cur) {
            return prev.concat(angular.isArray(cur) ? cur : [cur])
          }, [])
            .sort(function (a, b) {
              if (a.type > b.type) {
                return 1
              }
              if (a.type < b.type) {
                return -1
              }
            })
          log('dns loaded ' + dnsList.dns.length)
        })
        .catch(function (err) {
          log('error code: ' + err.code)
          throw err
        })
        .finally( function () {
          $scope.$broadcast('scroll.refreshComplete');
        }
        )
    }

    dnsList.doRefresh()

    dnsList.goBack = function () {
      $ionicHistory.goBack()
    }

    dnsList.refreshDNSRecordFieldList = function() {
      var
        type = $newDNSScope.newDNS.type

      $newDNSScope.fields = {
        content: 'Содержимое DNS записи',
        subdomain: 'Имя поддомена',
        ttl: 'Время жизни DNS-записи в секундах'
      }

      switch (type) {
        case 'SOA':
          $newDNSScope.fields.admin_mail = 'Email-адрес администратора'

          $newDNSScope.fields.refresh = 'Частота проверки в секундах вторичными DNS-серверами DNS-записи для этой зоны'
          $newDNSScope.newDNS.refresh = ''

          $newDNSScope.fields.retry = 'Время в секундах между повторными попытками вторичных DNS-серверов получить записи зоны'
          $newDNSScope.newDNS.retry = ''

          $newDNSScope.fields.expire = 'Время в секундах, по истечении которого вторичные DNS-серверы считают записи зоны несуществующими, если основной сервер не отвечает'
          $newDNSScope.newDNS.expire = ''

          $newDNSScope.fields.neg_cache = 'Время в секундах, в течение которого будет кешироваться отрицательный ответ (ERROR = NXDOMAIN) от DNS-сервера'
          $newDNSScope.newDNS.neg_cache = ''

          break
        case 'SRV':
          $newDNSScope.fields.weigth = 'Вес SRV-записи относительно других SRV-записей'
          $newDNSScope.fields.priority = 'Приоритет DNS записи'
          $newDNSScope.fields.port = 'TCP или UDP-порт хоста'
          $newDNSScope.fields.target = 'Каноническое имя хоста'
          break
        case 'MX':
          $newDNSScope.fields.priority = 'Приоритет DNS записи'
          break
      }
    }

    dnsList.processDNSRecord = function (dns) {

      $newDNSScope.isEdit = (typeof(dns) !== 'undefined')

      if ($newDNSScope.isEdit) {
        $newDNSScope.newDNS = dns
      }
      else {
        $newDNSScope.clearNewDns()
      }
      dnsList.refreshDNSRecordFieldList()

      $newDNSScope.processDNSRecord = function (newDNS) {
        var params = {
          domain:     dnsList.domain,
          record_id:  newDNS.record_id,
          type:       newDNS.type,
          admin_mail: newDNS.admin_mail,
          content:    newDNS.content,
          priority:   newDNS.priority,
          weigth:     newDNS.weigth,
          port:       newDNS.port,
          target:     newDNS.target,
          subdomain:  newDNS.subdomain,
          ttl:        newDNS.ttl
        }

        return ($newDNSScope.isEdit ? PDD.dns.edit(params) : PDD.dns.add(params))
          .then(function (result) {
            if (result.success && 'ok' === result.success) {
              $newDNSScope.modal.hide()
              dnsList.doRefresh()
            }
            else if (result.error) {
              throw new Error(result.error)
            }
            else {
              throw new Error(angular.toJson(result))
            }
          }, function (err) {
            alert('Ошибка ' + err.message)
          })
      }

      newDNSRecordModal
        .then(function (modal) {
          $newDNSScope.modal = modal
          modal.show()
        })
    }

    dnsList.closeModal = function () {
      dnsList.doRefresh()
      $newDNSScope.modal.hide()
    }

    dnsList.deleteDNSRecord = function(record_id, recordType, subdomain) {
      var params = {
        domain: dnsList.domain,
        record_id: record_id
      }
      $ionicPopup.confirm({
        title: 'Подтвердите удаление',
        template: 'Вы уверены, что хотите удалить DNS запись типа = "' + recordType + '", поддомен = "' + subdomain + '"?',
        cancelText: 'Отмена',
        confirmText: 'ОК'
      }).then(function (res) {
        if (res) {
          PDD.dns.delete(params)
            .then(function (result) {
              if (result.success && 'ok' === result.success) {
                dnsList.doRefresh()
              }
              else {
                throw result
              }
            }, function (err) {
              alert('Ошибка ' + angular.toJson(err))
            })
        }
      })
    }

  })
