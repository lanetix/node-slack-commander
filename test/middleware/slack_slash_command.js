(function () {
  'use strict';

  var _ = require('lodash'),
    httpMocks = require('node-mocks-http'),
    Promise = require('bluebird'),
    should = require('should'),
    middleware = require('../../middleware/slack_slash_command'),
    token = 'icanhaztokenz';

  function composeOptions(options) {
    return _.defaults({}, options, {
      token: token,
      commands: {
        test: function () {
          return Promise.resolve();
        }
      }
    });
  }

  describe('middleware/slack_slash_command', function () {
    it('return 422 if the requested command is not found', function () {
      var body = { text: 'unknownCommand' },
        options = composeOptions(),
        req = httpMocks.createRequest({ body: body }),
        res = httpMocks.createResponse();

      middleware(options)(req, res);

      should.equal(res.statusCode, 422);
      should.equal(res._getData(), 'Command not supported');
    });

    it('return 204 if command found and no ack configured', function () {
      var body = { text: 'test' },
        options = composeOptions(),
        req = httpMocks.createRequest({ body: body }),
        res = httpMocks.createResponse();

      return middleware(options)(req, res)
        .then(function () {
          should.equal(res.statusCode, 204);
        });
    });

    it('return 200 if command found and ack configured', function () {
      var body = { text: 'test' },
        ack = 'Command received',
        options = composeOptions({ ack: ack }),
        req = httpMocks.createRequest({ body: body }),
        res = httpMocks.createResponse();

      return middleware(options)(req, res)
        .then(function () {
          should.equal(res.statusCode, 200);
          should.equal(res._getData(), ack);
        });
    });

    it('should parse an additional parameter', function () {
      var body = { text: 'test param' },
        options = composeOptions({
          commands: {
            test: function (command, param) {
              return Promise.resolve()
              .then(function () {
                should.equal(param, 'param');
              });
            }
          }
        }),
        req = httpMocks.createRequest({ body: body }),
        res = httpMocks.createResponse();

      return middleware(options)(req, res)
        .then(function () {
          should.equal(res.statusCode, 204);
        });
    });

    it('should parse multiple additional parameters', function () {
      var body = { text: 'test param1 param2' },
        options = composeOptions({
          commands: {
            test: function (command, param1, param2) {
              return Promise.resolve()
              .then(function () {
                should.equal(param1, 'param1');
                should.equal(param2, 'param2');
              });
            }
          }
        }),
        req = httpMocks.createRequest({ body: body }),
        res = httpMocks.createResponse();

      return middleware(options)(req, res)
      .then(function () {
        should.equal(res.statusCode, 204);
      });
    });

    it('should allow delimeter to be changed', function () {
      var body = { text: 'test|param' },
        options = composeOptions({
          delimeter: '|',
          commands: {
            test: function (command, param) {
              return Promise.resolve()
                .then(function () {
                  should.equal(param, 'param');
                });
            }
          }
        }),
        req = httpMocks.createRequest({ body: body }),
        res = httpMocks.createResponse();

      return middleware(options)(req, res)
        .then(function () {
          should.equal(res.statusCode, 204);
        });
    });
  });
})();
