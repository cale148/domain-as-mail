'use strict'
angular.module('main')
.controller('MailboxCtrl', function (debug, PDD, $q, $window, $scope, $stateParams, $ionicModal, $ionicPopup, $ionicHistory, $cordovaInAppBrowser) {
  var alert = $window.alert
  var log = debug('app:domain:mailbox')
  var mailbox = this
  mailbox.domain = $stateParams.domain
  mailbox.isOwner = angular.fromJson($stateParams.isOwner) || false
  mailbox.login = $stateParams.login

  mailbox.doRefresh = function () {
    return PDD.email.mailbox({
      domain: mailbox.domain,
      login: mailbox.login
    })
      .then(function (result) {
        mailbox.account = result.account || {}
        mailbox.account.blocked = 'yes' !== mailbox.account.enabled
        mailbox.realyBlocked = mailbox.account.blocked
        log('mailbox loaded ' + mailbox.account)
      })
      .catch(function (err) {
        log('error code: ' + err.code)
        throw err
      })
      .finally(function () {
        $scope.$broadcast('scroll.refreshComplete')
      })
  }

  mailbox.doRefresh()

  var $aliasesScope = $scope.$root.$new()
  var aliasesModal = $ionicModal.fromTemplateUrl('main/templates/aliases.html', {
    scope: $aliasesScope,
    animation: 'slide-in-up'
  })
  $aliasesScope.newAlias = {
    name: ''
  }

  mailbox.saveMailbox = function () {
    var save = function (data) {
      return PDD.email.mailbox(data)
        .then(function (result) {
          mailbox.account = result.account || {}
          mailbox.account.blocked = 'yes' !== mailbox.account.enabled
          mailbox.realyBlocked = mailbox.account.blocked
          log('mailbox saved ' + mailbox.account)
          mailbox.goBack()
        })
        .catch(function (err) {
          log('error code: ' + err)
          alert('Ошибка ' + err)
        })
    }
    var account = mailbox.account
    var params = {
      domain: mailbox.domain,
      uid: account.uid
    }
    account.enabled = account.blocked ? 'No' : 'Yes'
    angular.extend(params, account)
    if (account.password) {
      return $ionicPopup.confirm({
        title: 'Изменение пароля',
        template: 'Вы действительно хотите изменить пароль?',
        cancelText: 'Отмена',
        confirmText: 'ОК'
      }).then(function (res) {
        if (res) {
          return save(params)
        }
      })
    } else {
      return save(params)
    }
  }

  mailbox.goBack = function () {
    $ionicHistory.goBack()
  }

  mailbox.deleteMailbox = function () {
    var account = mailbox.account
    var params = {
      domain: mailbox.domain,
      uid: account.uid
    }
    $ionicPopup.confirm({
      title: 'Удаление',
      template: 'Вы действительно хотите удалить почтовый ящик ' + account.login + '?',
      cancelText: 'Отмена',
      confirmText: 'ОК'
    }).then(function (res) {
      if (res) {
        PDD.email.removeMailbox(params)
          .then(function (result) {
            if (result.success && 'ok' === result.success) {
              mailbox.goBack()
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

  mailbox.showAliases = function () {
    var account = mailbox.account
    $aliasesScope.account = account
    $aliasesScope.addAlias = function (name) {
      var params = {
        domain: mailbox.domain,
        login: account.login,
        alias: name.toLowerCase()
      }
      PDD.email.addAlias(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            angular.extend(account, result.account)
            $aliasesScope.newAlias.name = ''
          }
          else {
            throw result
          }
        }, function (err) {
          alert('Ошибка ' + angular.toJson(err))
        })
    }
    $aliasesScope.delAlias = function (name) {
      var params = {
        domain: mailbox.domain,
        login: account.login,
        alias: name
      }
      PDD.email.delAlias(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            angular.extend(account, result.account)
          }
          else {
            throw result
          }
        }, function (err) {
          alert('Ошибка ' + angular.toJson(err))
        })
    }
    aliasesModal.then(function (modal) {
      $aliasesScope.modal = modal
      modal.show()
    })
  }

  mailbox.getOAuthToken = function (account) {
    var params = {
      domain: mailbox.domain,
      uid: account.uid
    }

    PDD.email.getOAuthToken(params)
      .then(function (result) {
        if (result.success && 'ok' === result.success) {
          mailbox.oauthToken = result['oauth-token']
          var mailURL = 'https://passport.yandex.ru/passport?mode=oauth&access_token=' + mailbox.oauthToken + '&type=trusted-pdd-partner'
          log('passport', mailURL)
          if ($window.ionic.Platform.isWebView()) {
            $cordovaInAppBrowser.open(mailURL, '_system')
          }
          else {
            window.open(mailURL)
          }
        }
        else if (result.error) {
          throw new Error(result.error)
        }
        else {
          throw new Error(angular.toJson(result))
        }
      })
  }
})
