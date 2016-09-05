'use strict';

var _utils = require('../utils');

/*
 * Translate parenwraps 1-1.
 */
(0, _utils.compile)(_utils.nodes.WrapNode, function () {
  return '(' + this.item.compile(true) + ')';
});