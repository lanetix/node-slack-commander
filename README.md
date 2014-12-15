node-slack-commander
============================

[![NPM](https://nodei.co/npm/slack-commander.png?downloads=true&stars=true)](https://nodei.co/npm/slack-commander/)

[![Build Status](https://circleci.com/gh/lanetix/node-slack-commander.svg?style=shield&circle-token=d31e343c35a40849a7b2535fecee58eb01e9bc55)](https://circleci.com/gh/lanetix/node-slack-commander)

## Listen for Slack Slash Commands


```
var express = require('express'),
  bodyParser = require('body-parser'),
  slackCommander = require('slack-commander');

module.exports = function () {
  var app = express();

  app.use('/slack', slackCommander.router({
    token: 'SLACK_SLASH_COMMAND_TOKEN',
    commands: 'HASH_OF_SUPPORTED_COMMANDS'
  }));

  return app;
};

```

#### Example Command Hash

Commands are expected to return promises.

```
var Promise = require('bluebird'),
  commands = {
    reverse: function (command, input) {
      return Promise.resolve()
        .then(function () {
          var reversed = input.split('').reverse().join('');
          // ... use messenger to log this back to a chat
          return;
        });
    },
    echo: function (command, args) {
      return Promise.resolve()
        .then(function () {
          // ... use messenger to log this back to a chat
          return;
        });
    }
  }
```

## Send Messages to a Slack Room

```
var slackCommander = require('slack-commander'),
  options = {
    username: 'Lanetix',
    webhookUrl: 'WEBHOOK_URL'
  },
  messenger = slackCommander.messenger(options);

  messenger.send('i can haz messages', { channel: '#cats' });
```
