'use strict'
angular.module('main')
.controller('DomainCtrl', function (debug, PDD, $q, $window, $scope, $stateParams) {
  //var alert = $window.alert
  var domain = this
  domain.shouldShowDelete = false
  domain.name = $stateParams.domain
  domain.owner = true

})
