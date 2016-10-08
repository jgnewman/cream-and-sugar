'use strict';

var _utils = require('../utils');

/*
 * Reformat function calls to JavaScript syntax.
 */
(0, _utils.compile)(_utils.nodes.FunctionCallNode, function () {
  var _this = this;

  // If the arguments node a wrap...
  if (this.args.src === "()" && this.args.items.length === 1 && this.args.items[0].type === 'Wrap') {
    return '' + this.fn.compile(true) + this.args.items.map(function (arg) {
      return arg.compile(true);
    }).join(', ');

    // If the only argument is `_`, compile it like an empty call...
  } else if (this.args.items.length === 1 && this.args.items[0].type === 'Identifier' && this.args.items[0].src === '_') {
    return this.fn.compile(true) + '()';

    // Anything else...
  } else {
    return this.fn.compile(true) + '(' + this.args.items.map(function (arg) {
      var out = arg.compile(true);
      out === '_' && (0, _utils.die)(_this, '"_" can not be used as a member of an argument list.');
      return out;
    }).join(', ') + ')';
  }
});