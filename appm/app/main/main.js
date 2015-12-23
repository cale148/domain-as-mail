'use strict'
angular.module('main', [])
.config(function ($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/domains')
  $stateProvider
    .state('main', {
      abstract: true,
      templateUrl: 'main/templates/menu.html',
      resolve: {
        apiKey: function ($localForage, $state) {
          return $localForage.getItem('apiKey')
            .then(function (apkKey) {
              if (apkKey) {
                return apkKey
              } else {
                return $state.go('signup')
              }
            })
        },
        PDD: function (apiKey, getPDDForKey) {
          return getPDDForKey(apiKey)
        }
      }
    })
    .state('main.domains', {
      url: '/domains',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/domains.html',
          controller: 'DomainsCtrl as domains'
        }
      }
    })
    .state('main.domain', {
      url: '/domain/:domain',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/domain.html',
          controller: 'DomainCtrl as domain'
        }
      }
    })
    .state('main.mailbox', {
      url: '/domain/:domain/mailbox/:login',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/mailbox.html',
          controller: 'MailboxCtrl as mailbox'
        }
      }
    })
    .state('main.mailboxList', {
      url: '/domain/:domain/mailbox',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/mailboxList.html',
          controller: 'MailboxCtrlList as mailboxList'
        }
      }
    })
    .state('main.dnsList', {
      url: '/domain/:domain/dns',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/dnslist.html',
          controller: 'dnsCtrlList as dnsList'
        }
      }
    })
    .state('main.maillistList', {
      url: '/domain/:domain/maillist',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/maillist_list.html',
          controller: 'maillistCtrlList as maillistList'
        }
      }
    })
    .state('main.deputies', {
      url: '/domain/:domain/deputies',
      views: {
        'pageContent': {
          templateUrl: 'main/templates/deputylist.html',
          controller: 'deputyCtrlList as deputyList'
        }
      }
    })
})
