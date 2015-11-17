'use strict';

describe('module: main, filter: idn', function () {

  // load the filter's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // initialize a new instance of the filter before each test
  var $filter;
  beforeEach(inject(function (_$filter_) {
    $filter = _$filter_('idn');
  }));

  it('should return punycode.toUnicode', function () {
    var text = 'xn--maana-pta.com';
    expect($filter(text)).toBe('mañana.com');
  });

});
