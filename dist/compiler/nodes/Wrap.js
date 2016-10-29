'use strict';

var _utils = require('../utils');

/*
 * Translate parenwraps 1-1.
 */
(0, _utils.compile)(_utils.nodes.WrapNode, function () {
  var dropParens = this.item.type === 'Fun' || this.item.type === 'FunctionCall';
  var begin = dropParens ? '' : '(';
  var end = dropParens ? '' : ')';
  return '' + begin + this.item.compile(true) + end;
});