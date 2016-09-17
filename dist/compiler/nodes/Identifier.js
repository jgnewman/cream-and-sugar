'use strict';

var _utils = require('../utils');

/*
 * Drop in identifiers.
 */
(0, _utils.compile)(_utils.nodes.IdentifierNode, function () {
  var base = this.text.replace(/^\@/, '');

  // Disallow identifiers that look like __this__
  if (/^__/.test(base) && /__$/.test(base)) {
    (0, _utils.die)(this, this.text + ' matches the pattern __IDENTIFIER__ which is reserved for system variables.');

    // Disallow reserved words
  } else if ((0, _utils.getReservedWords)().indexOf(base) > -1) {
    (0, _utils.die)(this, this.text + ' is a reserved word.');

    // Translate system library functions
  } else if ((0, _utils.getExposedFns)().indexOf(base) > -1) {
    if ((0, _utils.getMsgPassingFns)().indexOf(base) > -1) {
      this.shared.lib.add('msgs');
    }
    this.shared.lib.add(this.text);
    return 'SYSTEM.' + this.text;
  }

  // Otherwise, just make sure to replace @ with "this"
  return this.text.replace(/^\@/, 'this.').replace(/\.$/, ''); // Strip trailing dots in case of "@" -> "this."
});