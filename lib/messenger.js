(function () {
  'use strict';

  var _ = require('lodash'),
    slackNotify = require('slack-notify');

  module.exports = function (options) {
    options = _.defaults({}, options, {
      username: 'Slack Commander'
    });

    var slack = slackNotify(options.webhookUrl);
    return {
      send: function (message, opts) {
        var payload = _.defaults({}, opts, {
          username: options.username,
          icon_url: options.icon_url,
          text: message
        });

        if (payload.channel && !payload.channel.match(/^#/)) {
          payload.channel = '#' + payload.channel;
        }

        slack.send(payload);
      }
    };
  };
}());
