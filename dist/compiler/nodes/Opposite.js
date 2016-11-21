'use strict';

var _utils = require('../utils');

/*
 * Compile the ! operator.
 */
(0, _utils.compile)(_utils.nodes.OppositeNode, function () {
  return '!' + this.value.compile(true);
});