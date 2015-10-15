'use strict';
angular.module('main')
.controller('DomainCtrl', function (PDD, $scope, $stateParams, $ionicModal) {
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
  };
  domain.doRefresh();

  var $aliasesScope = $scope.$root.$new();
  var aliasesModal = $ionicModal.fromTemplateUrl('main/templates/aliases.html', {
    scope: $aliasesScope,
    animation: 'slide-in-up'
  });
  $aliasesScope.newAlias = {
    name: ''
  };

  domain.showAliases = function (account) {
    $aliasesScope.account = account;
    $aliasesScope.addAlias = function (name) {
      var params = {
        domain: domain.name,
        login: account.login,
        alias: name
      };
      PDD.email.addAlias(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            angular.extend(account, result.account);
            $aliasesScope.newAlias.name = '';
          }
          else {
            throw result;
          }
        }, function (err) {
          alert('Error ' + angular.toJson(err));
        });
    };
    $aliasesScope.delAlias = function (name) {
      var params = {
        domain: domain.name,
        login: account.login,
        alias: name
      };
      PDD.email.delAlias(params)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            angular.extend(account, result.account);
          }
          else {
            throw result;
          }
        }, function (err) {
          alert('Error ' + angular.toJson(err));
        });
    };
    aliasesModal.then(function (modal) {
      $aliasesScope.modal = modal;
      modal.show();
    });
  };
});
