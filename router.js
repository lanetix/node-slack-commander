(function () {
  'use strict';

  var _ = require('lodash'),
    express = require('express'),
    Promise = require('bluebird'),
    middleware = require('./middleware'),
    router = express.Router();

  function parseCommand(command) {
    return _.first(command.split('|'));
  }

  function parseParameters(command) {
    var split = command.split('|');
    return split.length > 1 ? split.splice(1) : [];
  }

  // Options:
  // token (string): slack token used to verify incoming request
  // commands (object): supported command hash
  // uri (string): uri to host slack integration
  module.exports = function (options) {
    options = _.defaults({}, options, {
      uri: '/'
    });

    router.post(options.uri, middleware.slack_token(options.token), function (req, res, next) {
      var command = parseCommand(req.body.text),
        parameters = parseParameters(req.body.text),
        commandSupported = _.has(options.commands, command);

      if (!commandSupported) { // respond success if command not supported
        return res.status(204).send();
      }

      Promise.resolve()
        .then(function () {
          return options.commands[command](req.body, parameters);
        })
        .then(function () {
          res.status(204).send();
        })
        .catch(next);
    });

    return router;
  };

})();
