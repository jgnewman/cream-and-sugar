'use strict';

var _utils = require('../utils');

/*
 * Use Object.assign to compile object consing.
 */
(0, _utils.compile)(_utils.nodes.ObjConsNode, function () {
  return 'CNS_.assign(' + this.base.compile(true) + ', ' + this.toAdd.compile(true) + ')';
});