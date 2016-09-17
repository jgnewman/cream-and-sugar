'use strict';

var _utils = require('../utils');

/*
 * Replace comments with JavaScripty comments.
 */
(0, _utils.compile)(_utils.nodes.CommentNode, function () {
  return '/* ' + this.text + ' */';
});