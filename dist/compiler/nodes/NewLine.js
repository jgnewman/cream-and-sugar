'use strict';

var _utils = require('../utils');

function getLastChar(str) {
  var trimmed = str.trim();
  return trimmed[trimmed.length - 1];
}

function semiShouldFollowLastChar(str) {
  var char = getLastChar(str);
  return char !== ';';
}

/*
 * Newlines output newlines.
 */
(0, _utils.compile)(_utils.nodes.NewLineNode, function () {
  var insertConditions = this.shared.insertSemis && semiShouldFollowLastChar(this.shared.output) && /[^\n\;]/.test(this.shared.output);
  var output = insertConditions ? ';\n' : '\n';
  return output;
});