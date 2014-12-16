(function () {
  'use strict';

  var _ = require('lodash'),
    bodyParser = require('body-parser'),
    express = require('express'),
    Promise = require('bluebird'),
    request = require('supertest-promised'),
    util = require('util'),
    slackCommander = require('../..'),
    token = 'icanhaztokenz';

  function composeBody(hash) {
    hash = _.defaults({}, hash, {
      user_name: 'lanetix',
      channel_name: 'lanetix',
      token: token,
      text: 'test'
    });

    return _.map(hash, function (value, key) {
      return util.format('%s=%s', key, value);
    }).join('&');
  }

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

  describe('lib/router', function () {
    var app;

    before(function () {
      app = express();

      app.use(bodyParser.urlencoded({ extended: false }));
      app.use('/slack', slackCommander.router(composeOptions()));
      app.use('/slack', slackCommander.router(composeOptions({ uri: '/test' })));
    });

    it('listens on the default uri', function () {
      request(app)
        .post('/slack')
        .send(composeBody())
        .expect(204)
        .end();
    });

    it('listens on a configurable uri', function () {
      request(app)
        .post('/slack/test')
        .send(composeBody())
        .expect(204)
        .end();
    });
  });

}());
