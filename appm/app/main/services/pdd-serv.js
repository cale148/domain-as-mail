'use strict'
angular.module('main')
.factory('getPDDForKey', function ($http, Config) {
  var URL = Config.ENV.URL
  return function (apiKey) {
    var query = function (urlLocation, params) {
      var q = angular.extend({
        url: URL + urlLocation,
        headers: {
          PddToken: apiKey
        }
      }, params)
      return $http(q)
      .then(function (result) {
        if (result.data.error) {
          switch (result.data.error) {
            case 'not_master_admin':
              return false
            default:
              throw new Error(result.data.error)
          }
        } else {
          return result.data
        }
      })
    }
    return {
      domain: {
        query: function () {
          return query('domain/domains')
        },
        register: function (domain) {
          return query('domain/register', {params: {domain: domain}, method: 'POST'})
        }
      },
      ml: {
        list: function (domain) {
          return query('email/ml/list', {params: {domain: domain}, method: 'GET'})
        },
        add: function (params) {
          return query('email/ml/add', {params: params, method: 'POST'})
        },
        'delete': function (params) {
          return query('email/ml/del', {params: params, method: 'POST'})
        },
        listSubscribers: function (domain, maillist) {
          return query('email/ml/subscribers?', {params: {domain: domain, maillist: maillist}, method: 'GET'})
        },
        addSubscribers: function (params) {
          return query('email/ml/subscribe', {params: params, method: 'POST'})
        },
        'deleteSubscribers': function (params) {
          return query('email/ml/unsubscribe', {params: params, method: 'POST'})
        }
      },
      deputy: {
        list: function (domain) {
          return query('deputy/list', {params: {domain: domain}, method: 'POST'})
        },
        add: function (params) {
          return query('deputy/add', {params: params, method: 'POST'})
        },
        'delete': function (params) {
          return query('deputy/delete', {params: params, method: 'POST'})
        }
      },
      email: {
        query: function (domain) {
          return query('email/list', {params: {domain: domain, page: 1, 'on_page': 1000, direction: 'asc'}})
        },
        addAlias: function (params) {
          return query('email/add_alias', {params: params, method: 'POST'})
        },
        delAlias: function (params) {
          return query('email/del_alias', {params: params, method: 'POST'})
        },
        addMailbox: function (params) {
          return query('email/add', {params: params, method: 'POST'})
        },
        mailbox: function (params) {
          return query('email/edit', {params: params, method: 'POST'})
        },
        removeMailbox: function (params) {
          return query('email/del', {params: params, method: 'POST'})
        }
      }
    }
  }
})
