'use strict'
angular.module('main')
  .controller('MailboxCtrlList', function (debug, PDD, $q, $window, $scope, $stateParams, $ionicModal, $ionicPopup, $ionicHistory) {
    var alert = $window.alert
    var log = debug('app:domain:mailboxList')
    var mailboxList = this
    mailboxList.domain = $stateParams.domain

    mailboxList.isBlocked = function (account) {
      return 'no' === account.enabled
    }

    mailboxList.isNotMaillist = function (account) {
      return (account.maillist === 'no')
    }

    $scope.newAccount = {
      login: '',
      password: ''
    }
    var $mailboxScope = $scope.$new()
    var mailboxModal = $ionicModal.fromTemplateUrl('main/templates/mailbox_add.html', {
      scope: $mailboxScope,
      animation: 'slide-in-up'
    })

    mailboxList.doRefresh = function () {

      return PDD.email.query(mailboxList.domain)
        .then(function (result) {
          mailboxList.accounts = result.accounts.reduce(function(prev, cur) {
            return prev.concat(angular.isArray(cur) ? cur : [cur])
          }, [])
        })
        .then(function () {
          mailboxList.accounts.map(function (acc) {
            var
              params = {
                domain: mailboxList.domain,
                login: acc.login.toLowerCase(),
              }
            return PDD.email.countersMailbox(params)
              .then(function (result) {
                acc.counters = result.counters
              })
          })
        })
        .catch(function (err) {
          log('error code: ' + err.code)
          throw err
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete')
        })
    }

    mailboxList.doRefresh()

    mailboxList.goBack = function () {
      $ionicHistory.goBack()
    }

    mailboxList.refreshAccounts = function () {
      var log = debug('app:domain:accounts')
      return PDD.email.query(mailboxList.domain)
        .then(function (result) {
          mailboxList.accounts = result.accounts || []
          log('accounts loaded ' + mailboxList.accounts.length)
        })
        .catch(function (err) {
          log('error code: ' + err.code)
          throw err
        })
    }

    mailboxList.addMailbox = function () {
      $mailboxScope.addMailbox = function (login, password) {
        var params = {
          domain: mailboxList.domain,
          login: login.toLowerCase(),
          password: password.toLowerCase()
        }
        PDD.email.addMailbox(params)
          .then(function (result) {
            if (result.success && 'ok' === result.success) {
              mailboxList.refreshAccounts()
              $mailboxScope.modal.hide()
              $scope.newAccount = {
                login: '',
                password: ''
              }
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
      mailboxModal.then(function (modal) {
        $mailboxScope.modal = modal
        modal.show()
      })
    }

    mailboxList.deleteMailbox = function (account) {
      var params = {
        domain: mailboxList.domain,
        uid: account.uid
      }
      $ionicPopup.confirm({
        title: 'Подвердите удаление',
        template: 'Вы уверены, что хотите удалить почтовый ящик ' + account.login + '?',
        cancelText: 'Отмена',
        confirmText: 'ОК'
      }).then(function (res) {
        if (res) {
          PDD.email.removeMailbox(params)
            .then(function (result) {
              if (result.success && 'ok' === result.success) {
                mailboxList.doRefresh()
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
