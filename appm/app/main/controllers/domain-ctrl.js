'use strict'
angular.module('main')
.controller('DomainCtrl', function (debug, PDD, $q, $window, $scope, $stateParams, $ionicModal, $ionicPopup) {
  var alert = $window.alert
  var domain = this
  domain.shouldShowDelete = false
  domain.name = $stateParams.domain
  domain.owner = true

  var $subscribersScope = $scope.$root.$new()
  var subscribersModal = $ionicModal.fromTemplateUrl('main/templates/subscribers.html', {
    scope: $subscribersScope,
    animation: 'slide-in-up'
  })
  $subscribersScope.newSubscriber = {
    name: ''
  }

  domain.showSubscribers = function (list) {
    $subscribersScope.list = list
    $subscribersScope.addSubscribers = function () {
      var params = {
        domain: domain.name,
        maillist: list.maillist,
        subscriber: $subscribersScope.newSubscriber.name
      }
      PDD.ml.addSubscribers(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            $subscribersScope.subscribers.push(params.subscriber)
            $subscribersScope.newSubscriber.name = ''
          }
          else {
            throw result
          }
        }, function (err) {
          alert('Error ' + angular.toJson(err))
        })
    }
    $subscribersScope.delSubscribers = function (name) {
      var params = {
        domain: domain.name,
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
          }
          else {
            throw result
          }
        }, function (err) {
          alert('Error ' + angular.toJson(err))
        })
    }
    subscribersModal
      .then(function (modal) {
        return PDD.ml.listSubscribers(domain.name, list.maillist)
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

  domain.refreshMailLists = function () {
    var log = debug('app:domain:deputies')
    return PDD.ml.list(domain.name)
      .then(function (result) {
        domain.mailLists = result.maillists.reduce(function(prev, cur) {
          return prev.concat(angular.isArray(cur) ? cur : [cur])
        }, [])
        log('maillists loaded ' + domain.mailLists.length)
      })
      .catch(function (err) {
        log('error code: ' + err.code)
        throw err
      })
  }
  domain.refreshDeputies = function () {
    var log = debug('app:domain:mailList')
    return PDD.deputy.list(domain.name)
      .then(function (result) {
        if (!result) {
          log('You are now owner of ' + domain.name)
          domain.deputies = []
          domain.owner = false
          return
        }
        domain.deputies = result.deputies.reduce(function(prev, cur) {
          return prev.concat(angular.isArray(cur) ? cur : [cur])
        }, [])
        log('accounts loaded ' + domain.deputies.length)
      })
      .catch(function (err) {
        log('error code: ' + err.code)
        throw err
      })
  }

  domain.refreshAccounts = function () {
    var log = debug('app:domain:accounts')
    return PDD.email.query(domain.name)
      .then(function (result) {
        domain.accounts = result.accounts || []
        log('accounts loaded ' + domain.accounts.length)
      })
      .catch(function (err) {
        log('error code: ' + err.code)
        throw err
      })
  }
  domain.doRefresh = function () {
    $q.all([domain.refreshAccounts(), domain.refreshDeputies(), domain.refreshMailLists()])
      .then(function () {
        domain.error = null
      }, function (error) {
        domain.error = error
      })
      .finally(function () {
        $scope.$broadcast('scroll.refreshComplete')
      })
  }
  domain.doRefresh()

  domain.isBlocked = function (account) {
    return 'no' === account.enabled
  }
  var $aliasesScope = $scope.$root.$new()
  var aliasesModal = $ionicModal.fromTemplateUrl('main/templates/aliases.html', {
    scope: $aliasesScope,
    animation: 'slide-in-up'
  })
  $aliasesScope.newAlias = {
    name: ''
  }

  domain.deleteMailbox = function (account) {
    var params = {
      domain: domain.name,
      uid: account.uid
    }
    $ionicPopup.confirm({
      title: 'Confirm delete',
      template: 'Are you sure you want to remove ' + account.login + ' mailbox?'
    }).then(function (res) {
      if (res) {
        PDD.email.removeMailbox(params)
          .then(function (result) {
            if (result.success && 'ok' === result.success) {
              domain.refreshAccounts()
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

  $scope.newAccount = {
    login: '',
    password: ''
  }
  var $mailboxScope = $scope.$new()
  var mailboxModal = $ionicModal.fromTemplateUrl('main/templates/mailbox_add.html', {
    scope: $mailboxScope,
    animation: 'slide-in-up'
  })

  domain.addMailbox = function () {
    $mailboxScope.addMailbox = function (login, password) {
      var params = {
        domain: domain.name,
        login: login.toLowerCase(),
        password: password.toLowerCase()
      }
      PDD.email.addMailbox(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            domain.refreshAccounts()
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
          alert('Error ' + err.message)
        })
    }
    mailboxModal.then(function (modal) {
      $mailboxScope.modal = modal
      modal.show()
    })
  }

  domain.showAliases = function (account) {
    $aliasesScope.account = account
    $aliasesScope.addAlias = function (name) {
      var params = {
        domain: domain.name,
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
          alert('Error ' + angular.toJson(err))
        })
    }
    $aliasesScope.delAlias = function (name) {
      var params = {
        domain: domain.name,
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
          alert('Error ' + angular.toJson(err))
        })
    }
    aliasesModal.then(function (modal) {
      $aliasesScope.modal = modal
      modal.show()
    })
  }
  // mailList
  var $mailListScope = $scope.$root.$new(true)
  var mailListModal = $ionicModal.fromTemplateUrl('main/templates/maillist_add.html', {
    scope: $mailListScope,
    animation: 'slide-in-up'
  })
  $mailListScope.mailList = {
    name: ''
  }

  domain.addMailList = function () {
    $mailListScope.domain = domain.name
    $mailListScope.addMailList = function (name) {
      var params = {
        domain: domain.name,
        maillist: name.toLowerCase()
      }
      PDD.ml.add(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            domain.refreshMailLists()
            $mailListScope.modal.hide()
            $mailListScope.mailList.name = ''
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
      modal.show()
    })
  }

  domain.deleteMailList = function (mailList) {
    var params = {
      domain: domain.name,
      maillist: mailList
    }
    $ionicPopup.confirm({
      title: 'Confirm delete',
      template: 'Are you sure you want to remove ' + mailList + ' mail list?'
    }).then(function (res) {
      if (res) {
        PDD.ml.delete(params)
          .then(function (result) {
            if (result.success && 'ok' === result.success) {
              domain.refreshMailLists()
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

  // Deputy
  var $deputyScope = $scope.$root.$new()
  var deputyModal = $ionicModal.fromTemplateUrl('main/templates/deputy_add.html', {
    scope: $deputyScope,
    animation: 'slide-in-up'
  })
  $deputyScope.deputy = {
    login: ''
  }

  domain.addDeputy = function () {
    $deputyScope.domain = domain.name
    $deputyScope.addDeputy = function (login) {
      var params = {
        domain: domain.name,
        login: login.toLowerCase()
      }
      PDD.deputy.add(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            domain.refreshDeputies()
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

  domain.deleteDeputy = function (login) {
    var params = {
      domain: domain.name,
      login: login
    }
    $ionicPopup.confirm({
      title: 'Confirm delete',
      template: 'Are you sure you want to remove ' + login + ' administrator?'
    }).then(function (res) {
      if (res) {
        PDD.deputy.delete(params)
          .then(function (result) {
            if (result.success && 'ok' === result.success) {
              domain.refreshDeputies()
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
})
