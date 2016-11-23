'use strict';

var _utils = require('../utils');

/*
 * Format call chain syntax.
 */
(0, _utils.compile)(_utils.nodes.ChainNode, function () {
  return this.body.map(function (each) {
    return each.compile(true);
  }).join('.');
});