'use strict';
angular.module('signup')
.controller('SignupCtrl', function ($log, $state, $localForage, apiKey) {
  this.submit = function () {
    $localForage.setItem('apiKey', this.apiKey)
      .then(function () {
        return $state.go('main.list');
      })
  };
  this.apiKey = apiKey;
});
