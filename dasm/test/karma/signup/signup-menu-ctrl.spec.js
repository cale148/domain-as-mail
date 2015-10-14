'use strict';

describe('module: signup, controller: SignupMenuCtrl', function () {

  // load the controller's module
  beforeEach(module('signup'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var SignupMenuCtrl;
  beforeEach(inject(function ($controller) {
    SignupMenuCtrl = $controller('SignupMenuCtrl');
  }));

  it('should do something', function () {
    expect(!!SignupMenuCtrl).toBe(true);
  });

});
