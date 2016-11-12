'use strict';

var _utils = require('../utils');

/*
 * Drop in identifiers.
 */
(0, _utils.compile)(_utils.nodes.IdentifierNode, function () {
  var _this = this;

  if (this.text === '@') return 'this';

  var base = this.text.replace(/^\@/, '');
  var clean = base.split('.').map(function (piece, pieceIndex) {

    // Disallow identifiers that look like "this_"
    if (/[^_]_$/.test(piece)) {
      (0, _utils.die)(_this, _this.text + ' matches the pattern IDENTIFIER_ which is reserved for system variables.');

      // Disallow reserved words
    } else if (pieceIndex === 0 && (0, _utils.getReservedWords)().indexOf(piece) > -1) {
      (0, _utils.die)(_this, _this.text + ' is a reserved word or contains a reserved word as a property name.');

      // Translate system library functions
    } else if (pieceIndex === 0 && (0, _utils.getExposedFns)().indexOf(piece) > -1) {
      return 'CNS_.' + _this.text;
    } else {
      return piece;
    }
  });

  return '' + (this.text[0] === '@' ? 'this.' : '') + clean.join('.');
});