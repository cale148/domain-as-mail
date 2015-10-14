'use strict';
angular.module('main')
.controller('ListCtrl', function ($log, $scope, PDD) {
  var list = this;
  list.doRefresh = function () {
    return PDD.domain.query()
      .then(function (result) {
        list.domains = result.domains || [];
        console.log(list.domains);
        list.error = null;
      })
      .catch(function (err) {
        console.log(err.code);
        list.error = err;
      })
      .finally(function () {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  }
  list.doRefresh();
});
