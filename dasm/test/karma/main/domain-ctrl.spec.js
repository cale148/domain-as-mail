'use strict';

describe('module: main, controller: DomainCtrl', function () {

  // load the controller's module
  beforeEach(module('main'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var DomainCtrl;
  beforeEach(inject(function ($controller) {
    DomainCtrl = $controller('DomainCtrl');
  }));

  it('should do something', function () {
    expect(!!DomainCtrl).toBe(true);
  });

});
