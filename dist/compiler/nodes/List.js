'use strict';

var _utils = require('../utils');

/*
 * Translate arrays 1-1.
 */
(0, _utils.compile)(_utils.nodes.ListNode, function () {
  return '(' + this.items.map(function (item) {
    return item.compile(true);
  }).join(', ') + ')';
});