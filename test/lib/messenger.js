(function () {
  'use strict';

  var proxyquire = require('proxyquire'),
    sinon = require('sinon');

  describe('lib/messenger', function () {
    var send = sinon.spy(function () {}),
      slack = function () {
        return { send: send };
      },
      messenger = proxyquire('../../lib/messenger', { 'slack-notify': slack });

    it('should send message to specified room', function () {
      var options = { channel: '#room' };
      messenger().send('message', options);

      send.calledWith({ channel: '#room',
        username: 'Slack Commander',
        icon_url: undefined,
        text: 'message'
      });
    });

    it('should append # to room if not provided', function () {
      var options = { channel: 'room' };
      messenger().send('message', options);

      send.calledWith({ channel: '#room',
        username: 'Slack Commander',
        icon_url: undefined,
        text: 'message'
      });
    });

    it('should override posting username', function () {
      var options = { channel: 'room' };
      messenger({ usename: 'Lanetix '}).send('message', options);

      send.calledWith({ channel: '#room',
        username: 'Lanetix',
        icon_url: undefined,
        text: 'message'
      });
    });

    it('should override icon url', function () {
      var options = { channel: 'room' };
      messenger({ icon_url: 'icon_url '}).send('message', options);

      send.calledWith({ channel: '#room',
        username: 'Slack Commander',
        icon_url: 'icon_url',
        text: 'message'
      });
    });

  });

}());
