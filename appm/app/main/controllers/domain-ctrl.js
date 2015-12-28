'use strict'
angular.module('main')
.controller('DomainCtrl', function (debug, $stateParams, isOwner) {
  var domain = this
  domain.shouldShowDelete = false
  domain.name = $stateParams.domain
  domain.owner = isOwner
})
