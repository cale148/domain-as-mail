'use strict'
angular.module('domainAsMail', [
  'ionic',
  'ngCordova',
  'ui.router',
  'focus-if',
  'debug',
  'main',
  'signup'
])
.config(function ($locationProvider) {
  if (/^https?:/.test(location.protocol) && 'localhost' !== location.hostname) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    })
  }
})
.config(function ($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0)
})
//.config(function ($ionicConfigProvider) {
//  $ionicConfigProvider.scrolling.jsScrolling(false)
//})
.run(function ($rootScope, debug) {
  var log = debug('app:$state')
  $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
    var jState = JSON.stringify(toState)
    var jParams = JSON.stringify(toParams)
    log('Cannot change state %s with params %s:\n%s', jState, jParams, JSON.stringify(error.stack || error))
  })
  $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
    log('State change start %s with params %s', JSON.stringify(toState), JSON.stringify(toStateParams))
  })
  $rootScope.$on('$stateChangeSuccess', function (event, toState, toParams/* , fromState, fromParams*/) {
    log('$stateChangeSuccess %s with params %s', JSON.stringify(toState), JSON.stringify(toParams))
  })
  $rootScope.$on('$stateNotFound', function () {
    log('$stateNotFound', arguments)
  })
})
