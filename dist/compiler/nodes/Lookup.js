'use strict';

var _utils = require('../utils');

/*
 * Compile . lookups 1-1.
 */
(0, _utils.compile)(_utils.nodes.LookupNode, function () {
  return this.left.compile(true) + '.' + this.right.compile(true);
});