'use strict';

var _utils = require('../utils');

/*
 * Translate objects 1-1.
 */
(0, _utils.compile)(_utils.nodes.ObjNode, function () {
  return '{ ' + this.pairs.map(function (pair) {
    var key = pair.left.type === 'Atom' ? '[' + pair.left.compile(true) + ']' : pair.left.compile(true);
    var val = pair.right.compile(true);
    return key + ': ' + val;
  }).join(', ') + ' }';
});