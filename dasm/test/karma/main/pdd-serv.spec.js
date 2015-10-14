'use strict';

describe('module: main, service: Pdd', function () {

  // load the service's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Pdd;
  beforeEach(inject(function (_Pdd_) {
    Pdd = _Pdd_;
  }));

  it('should do something', function () {
    expect(!!Pdd).toBe(true);
  });

});
