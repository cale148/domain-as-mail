'use strict';
angular.module('main')
.controller('ListCtrl', function (apiKey, $log, $stateParams) {
  console.log($stateParams, apiKey);
});
