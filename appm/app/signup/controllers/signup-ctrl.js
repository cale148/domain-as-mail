'use strict';
angular.module('signup')
.controller('SignupCtrl', function ($window, $state, $localForage, apiKey) {
  var signup = this;
  signup.getApiKey = function ($event) {
    if ($event) {
      $event.preventDefault()
    }
    var url = 'https://pddimp.yandex.ru/api2/admin/get_token';
    return $window.open(url, '_system', 'location=yes');
  };
  signup.submit = function () {
    return $localForage.setItem('apiKey', this.apiKey)
      .then(function () {
        return $state.go('main.domains');
      });
  };
  signup.apiKey = apiKey;
});
