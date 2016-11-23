'use strict';

var _utils = require('../utils');

function isReserved(word, index, hasProtector) {
  return index === 0 && !hasProtector && (0, _utils.getReservedWords)().indexOf(word) > -1;
}

function isBif(word, index, hasProtector) {
  return index === 0 && !hasProtector && (0, _utils.getExposedFns)().indexOf(word) > -1;
}

/*
 * Drop in identifiers.
 */
(0, _utils.compile)(_utils.nodes.IdentifierNode, function () {
  var _this = this;

  if (this.text === '@') return 'this';

  var base = this.text.replace(/^(\@|\~)/, '');
  var hasProtector = this.text[0] === '~';
  var clean = base.split('.').map(function (piece, pieceIndex) {

    // Disallow identifiers that look like "this_"
    if (/[^_]_$/.test(piece)) {
      (0, _utils.die)(_this, _this.text + ' matches the pattern IDENTIFIER_ which is reserved for system variables.');

      // Disallow reserved words
    } else if (isReserved(piece, pieceIndex, hasProtector)) {
      (0, _utils.die)(_this, _this.text + ' is a reserved word or contains a reserved word.');

      // Translate system library functions
    } else if (isBif(piece, pieceIndex, hasProtector)) {
      return 'CNS_.' + _this.text;
    } else {
      return piece;
    }
  });

  // Use @ lookups if we have them
  if (this.text[0] === '@') {
    return 'this.' + clean.join('.');
  } else {
    return clean.join('.');
  }
});