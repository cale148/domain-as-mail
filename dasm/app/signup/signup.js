'use strict';
angular.module('signup', [
  'ionic',
  'ngCordova',
  'ui.router',
  'LocalForageModule'
])
.config(function ($stateProvider) {
  $stateProvider
    .state('signup', {
      url: '/signup',
      templateUrl: 'signup/templates/signup.html',
      controller: 'SignupCtrl as signup',
      resolve: {
        apiKey: function ($localForage) {
          return $localForage.getItem('apiKey');
        }
      }
    })
});
