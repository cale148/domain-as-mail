'use strict';

describe('module: signup, service: Signup', function () {

  // load the service's module
  beforeEach(module('signup'));
  // load all the templates to prevent unexpected $http requests from ui-router
  beforeEach(module('ngHtml2Js'));

  // instantiate service
  var Signup;
  var $timeout;
  beforeEach(inject(function (_Signup_, _$timeout_) {
    Signup = _Signup_;
    $timeout = _$timeout_;
  }));

  describe('.changeBriefly()', function () {
    beforeEach(function () {
      Signup.changeBriefly();
    });
    it('should briefly change', function () {
      expect(Signup.someData.binding).toEqual('Yeah this was changed');
      $timeout.flush();
      expect(Signup.someData.binding).toEqual('Yes! Got that databinding working');
    });
  });

});
