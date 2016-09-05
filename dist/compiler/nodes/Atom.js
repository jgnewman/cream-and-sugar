'use strict';

var _utils = require('../utils');

/*
 * Translate atoms to symbols.
 */
(0, _utils.compile)(_utils.nodes.AtomNode, function () {
  return 'Symbol.for(\'' + this.text + '\')';
});