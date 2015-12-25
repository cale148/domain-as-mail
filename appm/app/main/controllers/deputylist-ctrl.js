'use strict'
angular.module('main')
  .controller('deputyCtrlList', function (debug, PDD, $q, $window, $scope, $stateParams, $ionicModal, $ionicPopup, $ionicHistory) {
    var deputyList = this
    var log = debug('app:domain:deputyList')
    deputyList.shouldShowDelete = false
    deputyList.domain = $stateParams.domain

    var $deputyScope = $scope.$root.$new()
    var deputyModal = $ionicModal.fromTemplateUrl('main/templates/deputy_add.html', {
      scope: $deputyScope,
      animation: 'slide-in-up'
    })
    $deputyScope.deputy = {
      login: ''
    }

    deputyList.goBack = function () {
      $ionicHistory.goBack()
    }

    deputyList.doRefresh = function () {
      return PDD.deputy.list(deputyList.domain)
            .then(function (result) {
              deputyList.deputies = result.deputies.reduce(function(prev, cur) {
                return prev.concat(angular.isArray(cur) ? cur : [cur])
              }, [])
            })
        .catch(function (err) {
          log('error code: ' + err.code)
          throw err
        })
        .finally( function () {
          $scope.$broadcast('scroll.refreshComplete')
        })
    }

    deputyList.addDeputy = function () {
      $deputyScope.addDeputy = function (login) {
        var params = {
          domain: deputyList.domain,
          login: login.toLowerCase()
        }
        PDD.deputy.add(params)
          .then(function (result) {
            if (result.success && 'ok' === result.success) {
              deputyList.deputies.push(params.login)
              $deputyScope.modal.hide()
              $deputyScope.deputy = {
                login: ''
              }
            }
            else if (result.error) {
              throw new Error(result.error)
            }
            else {
              throw new Error(angular.toJson(result))
            }
          }, function (err) {
            alert('Error ' + err.message)
          })
      }
      deputyModal.then(function (modal) {
        $deputyScope.modal = modal
        modal.show()
      })
    }

    deputyList.deleteDeputy = function (login) {
      var params = {
        domain: deputyList.domain,
        login: login
      }
      $ionicPopup.confirm({
        title: 'Подтвердите удаление',
        template: 'Вы уверены, что хотите удалить администратора ' + login + '?',
        cancelText: 'Отмена',
        confirmText: 'ОК'
      }).then(function (res) {
        if (res) {
          PDD.deputy.delete(params)
            .then(function (result) {
              if (result.success && 'ok' === result.success) {
                var index = deputyList.deputies.indexOf(login)
                if (-1 !== index) {
                  deputyList.deputies.splice(index, 1)
                }
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

    deputyList.doRefresh()
  })
