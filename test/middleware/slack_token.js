(function () {
  'use strict';

  var httpMocks = require('node-mocks-http'),
    should = require('should'),
    sinon = require('sinon'),
    middleware = require('../../middleware/slack_token'),
    token = 'icanhaztokenz';

  describe('middleware/slack_token', function () {
    var body = { token: token },
      req = httpMocks.createRequest({ body: body }),
      res = httpMocks.createResponse();

    it('should allow request if token matches', function () {
      var next = sinon.spy(function () {});

      middleware(token)(req, res, next);
      should.equal(next.calledOnce, true);
    });

    it('should not allow request if token does not match', function () {
      middleware('idonthaztokenz')(req, res);
      res.should.have.property('statusCode', 401);
    });
  });
})();
