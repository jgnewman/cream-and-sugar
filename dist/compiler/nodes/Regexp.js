'use strict';

var _utils = require('../utils');

/*
 * Replace comments with JavaScripty comments.
 */
(0, _utils.compile)(_utils.nodes.RegexpNode, function () {
  return this.text;
});