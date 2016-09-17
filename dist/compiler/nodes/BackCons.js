'use strict';

var _utils = require('../utils');

/*
 * Turn the cons operation into a function call.
 */
(0, _utils.compile)(_utils.nodes.BackConsNode, function () {
  return this.base.compile(true) + '.concat([' + this.toAdd.compile(true) + '])';
});