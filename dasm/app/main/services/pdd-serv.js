'use strict';
angular.module('main')
.factory('PDDFactory', function ($http) {
  var URL = 'https://pddimp.yandex.ru/api2/admin/';
  return function (apiKey) {
    return {
      domain: {
        query: function () {
          return $http({
            url: URL + 'domain/domains',
            headers: {
              PddToken: apiKey
            }
          })
          .then(function (result) {
            if (result.data.error) {
              throw new Error(result.data.error);
            }
            else {
              return result.data;
            }
          })
        }
      }
    };
  };
});
