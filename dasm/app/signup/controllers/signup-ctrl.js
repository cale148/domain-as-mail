'use strict';
angular.module('signup')
.controller('SignupCtrl', function ($log, $state, $localForage) {
  this.submit = function () {
    $localForage.setItem('apiKey', this.apiKey)
      .then(function () {
        return $state.go('main.list');
      })
  };
  this.apiKey = '';
});
