'use strict';

var CNS_SYSTEM = require('./SYSTEM');

CNS_SYSTEM.receive(function (msg) {
  console.log('My child sent me ->', msg);
});

var thread = CNS_SYSTEM.spawn(function () {
  CNS_SYSTEM.receive(function (msg) {
    console.log('My parent sent me ->', msg);
    if (CNS_SYSTEM.msgs.isBrowser) {
      CNS_SYSTEM.reply('This is a message from a browser process.');
    } else {
      CNS_SYSTEM.reply('This is a message from a node process.');
    }
  });
});

CNS_SYSTEM.send(thread, [Symbol.for('farts'), 'and more']);