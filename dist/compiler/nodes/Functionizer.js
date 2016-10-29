'use strict';

var _utils = require('../utils');

/*
 * Wraps a node in an immediate function that returns it.
 */
(0, _utils.compile)(_utils.nodes.Functionizer, function () {
  return '(function () { return ' + this.node.compile(true) + ' }())';
});