'use strict';
angular.module('main')
.factory('PDDFactory', function ($http) {
  var URL = 'https://pddimp.yandex.ru/api2/admin/';
  return function (apiKey) {
    var query = function (urlLocation, params) {
      var q = angular.extend({
        url: URL + urlLocation,
        headers: {
          PddToken: apiKey
        }
      }, params);
      return $http(q)
      .then(function (result) {
        if (result.data.error) {
          throw new Error(result.data.error);
        }
        else {
          return result.data;
        }
      });
    };
    return {
      domain: {
        query: function () {
          return query('domain/domains')
        }
      },
      email: {
        query: function (domain) {
          return query('email/list', {params: {domain: domain, page: 1, 'on_page': 1000, direction: 'asc'}});
        },
        addAlias: function (params) {
          return query('email/add_alias', {params: params, method: 'POST'});
        },
        delAlias: function (params) {
          return query('email/del_alias', {params: params, method: 'POST'});
        },
        addMailbox: function (params) {
          return query('email/add', {params: params, method: 'POST'});
        }
      }
    };
  };
});
