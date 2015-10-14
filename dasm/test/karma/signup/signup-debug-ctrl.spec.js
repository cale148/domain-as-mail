'use strict';

describe('module: signup, controller: SignupDebugCtrl', function () {

  // load the controller's module
  beforeEach(module('signup'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate controller
  var SignupDebugCtrl;
  beforeEach(inject(function ($controller) {
    SignupDebugCtrl = $controller('SignupDebugCtrl');
  }));

  describe('.grade()', function () {

    it('should classify asd as weak', function () {
      SignupDebugCtrl.password.input = 'asd';
      SignupDebugCtrl.grade();
      expect(SignupDebugCtrl.password.strength).toEqual('weak');
    });

    it('should classify asdf as medium', function () {
      SignupDebugCtrl.password.input = 'asdf';
      SignupDebugCtrl.grade();
      expect(SignupDebugCtrl.password.strength).toEqual('medium');
    });

    it('should classify asdfasdfasdf as strong', function () {
      SignupDebugCtrl.password.input = 'asdfasdfasdf';
      SignupDebugCtrl.grade();
      expect(SignupDebugCtrl.password.strength).toEqual('strong');
    });
  });

});
