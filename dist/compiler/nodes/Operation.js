'use strict';

var _utils = require('../utils');

/*
 * Recursively compile operations.
 */
(0, _utils.compile)(_utils.nodes.OperationNode, function () {
  return this.left.compile(true) + ' ' + this.operator + ' ' + this.right.compile(true);
});