'use strict';
angular.module('main')
.controller('DomainCtrl', function (PDD, $scope, $stateParams) {
  var domain = this;
  domain.name = $stateParams.domain;
  domain.doRefresh = function () {
    return PDD.email.query(domain.name)
      .then(function (result) {
        console.log(result);
        domain.accounts = result.accounts || [];
        // console.log(domain.domain);
        domain.error = null;
      })
      .catch(function (err) {
        console.log(err.code);
        domain.error = err;
      })
      .finally(function () {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  }
  domain.doRefresh();
});
