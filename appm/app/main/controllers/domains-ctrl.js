'use strict';
angular.module('main')
.controller('DomainsCtrl', function ($log, $scope, $ionicModal, PDD) {
  var domains = this;

  domains.statusTitles = {
    'domain-activate': 'не подтвержден',
    'mx-activate': 'подтвержден, MX-запись не настроена',
    'added': 'домен подтвержден'
  };

  domains.statusClasses = {
    'domain-activate': 'light',
    'mx-activate': 'royal',
    'added': 'stable'
  };

  domains.doRefresh = function () {
    return PDD.domain.query()
      .then(function (result) {
        domains.domains = result.domains || [];
        domains.error = null;
      })
      .catch(function (err) {
        domains.error = err;
      })
      .finally(function () {
        // Stop the ion-refresher from spinning
        $scope.$broadcast('scroll.refreshComplete');
      });
  }
  domains.doRefresh();


  var $addScope = $scope.$root.$new();
  var addModal = $ionicModal.fromTemplateUrl('main/templates/domain_add.html', {
    scope: $addScope,
    animation: 'slide-in-up'
  });
  $addScope.domain = {
    name: ''
  };
  domains.add = function () {
    $addScope.addDomain = function (name) {
      PDD.domain.register(name)
        .then(function (result) {
          if (result.success && 'ok' === result.success) {
            domains.doRefresh();
            $addScope.modal.hide();
            $addScope.domain = {
              name: ''
            };
          }
          else if (result.error) {
            throw new Error(result.error);
          }
          else {
            throw new Error(angular.toJson(result));
          }
        }, function (err) {
          alert('Ошибка ' + err.message);
        });
    };
    addModal.then(function (modal) {
      $addScope.modal = modal;
      modal.show();
    });
  };
});
