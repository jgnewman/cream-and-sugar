'use strict';

var _utils = require('../utils');

/*
 * Drop in regular keywords.
 */
(0, _utils.compile)(_utils.nodes.SpecialNode, function () {
  return this.text;
});