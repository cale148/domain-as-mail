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
})
