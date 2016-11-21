'use strict';

var _utils = require('../utils');

/*
 * Use the lazify lib to lazify a value.
 */
(0, _utils.compile)(_utils.nodes.BinderNode, function () {
  return 'CNS_.lazify(' + this.value.compile(true) + ', this)';
});