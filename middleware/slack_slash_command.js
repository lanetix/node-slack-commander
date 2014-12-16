(function () {
  'use strict';

  var _ = require('lodash'),
    Promise = require('bluebird');

  // Options:
  // token (string): slack token used to verify incoming request
  // commands (object): supported command hash
  // uri (string): uri to host slack integration
  // ack (string): acknowledgement message
  // delimeter (string): additional parameters delimeter
  module.exports = function (options) {
    options = _.defaults({}, options, {
      delimeter: ' ',
      ack: false
    });

    function parseCommand(command) {
      return _.first(command.split(options.delimeter));
    }

    function parseParameters(command) {
      var split = command.split(options.delimeter);
      return split.length > 1 ? split.splice(1) : [];
    }

    return function (req, res, next) {
      var command = parseCommand(req.body.text),
        args = parseParameters(req.body.text),
        commandSupported = _.has(options.commands, command);

      if (!commandSupported) { // respond success if command not supported
        res.status(422).send('Command not supported');
        return;
      }

      return Promise.resolve()
        .then(function () {
          args.unshift(req.body);
          return options.commands[command].apply(this, args);
        })
        .then(function () {
          var status = options.ack ? 200 : 204,
          message = options.ack || undefined;

          res.status(status).send(message);
        })
        .catch(next);
    };
  };

})();
