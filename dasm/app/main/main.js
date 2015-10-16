'use strict';
angular.module('main', [
  'ionic',
  'ngCordova',
  'ui.router',
  // TODO: load other modules selected during generation
])
.config(function ($stateProvider, $urlRouterProvider) {

  // ROUTING with ui.router
  $urlRouterProvider.otherwise('/domains');
  $stateProvider
    // this state is placed in the <ion-nav-view> in the index.html
    .state('main', {
      abstract: true,
      templateUrl: 'main/templates/menu.html',
      resolve: {
        apiKey: function ($localForage, $state) {
          return $localForage.getItem('apiKey')
            .then(function (apkKey) {
              if (apkKey) {
                return apkKey;
              } else {
                return $state.go('signup');
              }
            })
        },
        PDD: function (apiKey, PDDFactory) {
          return PDDFactory(apiKey);
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
      });
});
