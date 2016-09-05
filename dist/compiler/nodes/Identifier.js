'use strict';

var _utils = require('../utils');

/*
 * Drop in identifiers.
 */
(0, _utils.compile)(_utils.nodes.IdentifierNode, function () {
  var base = this.text.replace(/^\@/, '');
  if ((0, _utils.getReservedWords)().indexOf(base) > -1) {
    (0, _utils.die)(this, this.text + '" is a reserved word.');
  } else if ((0, _utils.getExposedFns)().indexOf(this.text) > -1) {
    this.shared.lib.add(this.text);
    return 'SYSTEM.' + this.text;
  }
  return this.text.replace(/^\@/, 'this.').replace(/\.$/, ''); // Strip trailing dots in case of "@" -> "this."
});