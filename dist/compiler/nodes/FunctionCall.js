'use strict';

var _utils = require('../utils');

/*
 * Reformat function calls to JavaScript syntax.
 */
(0, _utils.compile)(_utils.nodes.FunctionCallNode, function () {
  if (this.args.src === "()" && this.args.items.length === 1 && this.args.items[0].type === 'Wrap') {
    return '' + this.fn.compile(true) + this.args.items.map(function (arg) {
      return arg.compile(true);
    }).join(', ');
  } else {
    return this.fn.compile(true) + '(' + this.args.items.map(function (arg) {
      return arg.compile(true);
    }).join(', ') + ')';
  }
});