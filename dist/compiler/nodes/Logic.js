'use strict';

var _utils = require('../utils');

/*
 * Translate logic operators.
 */
(0, _utils.compile)(_utils.nodes.LogicNode, function () {
  var operatorMap = {
    and: '&&', or: '||', is: '===', isnt: '!==',
    lt: '<', gt: '>', lte: '<=', gte: '>=', dv: '/', rm: '%'
  };
  return this.left.compile(true) + ' ' + operatorMap[this.operator] + ' ' + this.right.compile(true);
});