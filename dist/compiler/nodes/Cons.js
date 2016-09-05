'use strict';

var _utils = require('../utils');

/*
 * Turn the cons operation into a function call.
 */
(0, _utils.compile)(_utils.nodes.ConsNode, function () {
  return '[' + this.toAdd.compile(true) + '].concat(' + this.base.compile(true) + ')';
});