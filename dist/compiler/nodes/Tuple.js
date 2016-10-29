'use strict';

var _utils = require('../utils');

/*
 * Translate tuples 1-1.
 */
(0, _utils.compile)(_utils.nodes.TupleNode, function () {
  this.shared.lib.add('tuple');
  return 'CNS_.tuple([' + this.items.map(function (item) {
    return item.compile(true);
  }).join(', ') + '])';
});