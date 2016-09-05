'use strict';

var _utils = require('../utils');

/*
 * Drop in numbers.
 */
(0, _utils.compile)(_utils.nodes.NumberNode, function () {
  return this.number;
});