'use strict'
angular.module('domainAsMail', [
  'main',
  'signup'
])
.config(function ($locationProvider) {
  if (/^https?:/.test(location.protocol)) {
    $locationProvider.html5Mode({
      enabled: true,
      requireBase: false
    })
  }
})
.config(function ($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0)
})
.config(function ($ionicConfigProvider) {
  $ionicConfigProvider.scrolling.jsScrolling(false)
})
