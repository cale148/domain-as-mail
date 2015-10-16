'use strict';
angular.module('main')
.controller('DomainsCtrl', function ($log, $scope, PDD, $window) {
  var domains = this;
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
  domains.domains = [
    { name: 'example.com', aliases: ['example.org', 'example.net'], 'logo_url': 'http://joesvirtualbar.com/wp-content/uploads/2012/08/Il-successo-di-Example-comp.jpg' },
    { name: $window.faker.internet.domainName(), aliases: [$window.faker.internet.domainName(), $window.faker.internet.domainName(), $window.faker.internet.domainName(), $window.faker.internet.domainName(), $window.faker.internet.domainName()] },
    { name: $window.faker.internet.domainName(), aliases: [], 'logo_url': $window.faker.image.image() },
    { name: $window.faker.internet.domainName(), aliases: [$window.faker.internet.domainName(), $window.faker.internet.domainName()], 'logo_url': $window.faker.image.image() },
  ];
  domains.doRefresh();
});
