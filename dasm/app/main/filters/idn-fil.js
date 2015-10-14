'use strict';
angular.module('main')
.filter('idn', function ($window) {
  return function (input) {
    return $window.punycode.toUnicode(input);
  };
});
