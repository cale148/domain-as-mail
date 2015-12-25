/**
 * Created by robot on 21.12.15.
 */
'use strict'
angular.module('main')
  .controller('maillistCtrlList', function (debug, PDD, $q, $window, $scope, $stateParams, $ionicModal, $ionicPopup, $ionicHistory) {
    var alert = $window.alert
    var log = debug('app:domain:maillistList')
    var maillistList = this
    maillistList.domain = $stateParams.domain

    maillistList.goBack = function () {
      $ionicHistory.goBack()
    }

    // mailList
    var $mailListScope = $scope.$new()
    var mailListModal = $ionicModal.fromTemplateUrl('main/templates/maillist_add.html', {
      scope: $mailListScope,
      animation: 'slide-in-up'
    })

    //Subscribers
    var $subscribersScope = $scope.$new()
    var subscribersModal = $ionicModal.fromTemplateUrl('main/templates/subscribers.html', {
      scope: $subscribersScope,
      animation: 'slide-in-up'
    })

    $subscribersScope.newSubscriber = {
      name: '',
      focus: false
    }

    maillistList.addMailList = function () {
      $mailListScope.domain = maillistList.domain
      $mailListScope.addMailList = function (name) {
        var params = {
          domain: maillistList.domain,
          maillist: name.toLowerCase()
        }
        PDD.ml.add(params)
          .then(function (result) {
            if (result.success && 'ok' === result.success) {
              $mailListScope.modal.hide()
              var newmailList = {
                maillist : result.maillist,
                cnt : 0
              }
              maillistList.mailLists.push(newmailList);
              maillistList.refreshAccounts()
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
      mailListModal.then(function (modal) {
        $mailListScope.modal = modal
        return modal.show()
      })
    }

    maillistList.deleteMailList = function (mailList) {
      var params = {
        domain: maillistList.domain,
        maillist: mailList
      }
      $ionicPopup.confirm({
        title: 'Подтвердите удаление',
        template: 'Вы уверены что хотите удалить рассылку ' + mailList + '?',
        cancelText: 'Отмена',
        confirmText: 'ОК'
      }).then(function (res) {
        if (res) {
          PDD.ml.delete(params)
            .then(function (result) {
              if (result.success && 'ok' === result.success) {
                for (var i = 0; i < maillistList.mailLists.length; i++) {
                  if (maillistList.mailLists[i].maillist === mailList) {
                    maillistList.mailLists.splice(i, 1);
                    break;
                  }
                }
                maillistList.refreshAccounts()
              }
              else {
                throw result
              }
            }, function (err) {
              alert('Error ' + angular.toJson(err))
            })
        }
      })
    }

    maillistList.doRefresh = function () {
      return PDD.ml.list(maillistList.domain)
         .then(function (result) {
           maillistList.mailLists = result.maillists
         })
        .catch(function (err) {
          log('error code: ' + err.code)
          throw err
        })
        .finally(function () {
          $scope.$broadcast('scroll.refreshComplete')
        })
    }

    $subscribersScope.isNotSubscribe = function (account) {
      if ($subscribersScope.subscribers) {
        return -1 === $subscribersScope.subscribers.indexOf(account.login)
      }
      else {
        return true
      }
    }

    $subscribersScope.isNotCurrentMaillist = function (account) {
      if ($subscribersScope.list) {
        return $subscribersScope.list.maillist !== account.login
      }
      else {
        return true
      }
    }

    maillistList.showSubscribers = function (list) {
      $subscribersScope.list = list
      $subscribersScope.addSubscribers = function (subscriberName) {
        var params = {
          domain: maillistList.domain,
          maillist: list.maillist,
          subscriber: subscriberName
        }
        PDD.ml.addSubscribers(params)
          .then(function (result) {
            if (result.success && 'ok' === result.success) {
              $subscribersScope.subscribers.push(params.subscriber)
              $subscribersScope.list.cnt++
              if (subscriberName === $subscribersScope.newSubscriber.name) {
                $subscribersScope.newSubscriber.name = ''
                $subscribersScope.newSubscriber.focus = true
              }
            }
            else {
              throw result
            }
          }, function (err) {
            alert('Ошибка ' + angular.toJson(err))
          })
      }

      $subscribersScope.delSubscribers = function (name) {
        var params = {
          domain: maillistList.domain,
          maillist: list.maillist,
          subscriber: name
        }
        PDD.ml.deleteSubscribers(params)
          .then(function (result) {
            if (result.success && 'ok' === result.success) {
              var index = $subscribersScope.subscribers.indexOf(name)
              if (-1 !== index) {
                $subscribersScope.subscribers.splice(index, 1)
              }
              list.cnt--
            }
            else {
              throw result
            }
          }, function (err) {
            alert('Ошибка ' + angular.toJson(err))
          })
      }
      subscribersModal
        .then(function (modal) {
          return PDD.ml.listSubscribers(maillistList.domain, list.maillist)
            .then(function (result) {
              $subscribersScope.subscribers = result.subscribers
              return modal
            })
        })
        .then(function (modal) {
          $subscribersScope.modal = modal
          modal.show()
        })
    }

    maillistList.refreshAccounts = function () {
      var log = debug('app:domain:accounts')
      return PDD.email.query(maillistList.domain)
        .then(function (result) {
          maillistList.accounts = result.accounts || []
          log('accounts loaded ' + maillistList.accounts.length)
        })
        .catch(function (err) {
          log('error code: ' + err.code)
          throw err
        })
    }
    maillistList.refreshAccounts()
    maillistList.doRefresh()
  })
