(function () {
  'use strict';

  var _ = require('lodash'),
    express = require('express'),
    middleware = require('../middleware'),
    router = express.Router();

  // Options:
  // token (string): slack token used to verify incoming request
  // commands (object): supported command hash
  // uri (string): uri to host slack integration
  // ack (string): acknowledgement message
  // delimeter (string): additional parameters delimeter
  module.exports = function (options) {
    options = _.defaults({}, options, {
      uri: '/'
    });

    router.post(options.uri, middleware.slack_token(options.token), middleware.slack_slash_command(options));
    return router;
  };

})();
