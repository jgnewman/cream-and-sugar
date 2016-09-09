var SYSTEM = require('./SYSTEM');

SYSTEM.receive(function (msg) {
  console.log('My child sent me ->', msg);
});

const thread = SYSTEM.spawn(function () {
  SYSTEM.receive(function (msg) {
    console.log('My parent sent me ->', msg);
    if (SYSTEM.msgs.isBrowser) {
      SYSTEM.reply('This is a message from a browser process.');
    } else {
      SYSTEM.reply('This is a message from a node process.');
    }
  });
});

SYSTEM.send(thread, [Symbol.for('farts'), 'and more']);
