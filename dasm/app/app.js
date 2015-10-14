'use strict';
angular.module('domainAsMail', [
  'main',
  'signup'
])
.config(function ($ionicConfigProvider) {
  $ionicConfigProvider.views.maxCache(0);
});
