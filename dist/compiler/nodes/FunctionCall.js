'use strict';

var _utils = require('../utils');

/*
 * Reformat function calls to JavaScript syntax.
 */
(0, _utils.compile)(_utils.nodes.FunctionCallNode, function () {
  var _this = this;

  // If the only argument is `_`, compile it like an empty call...
  if (this.args.items.length === 1 && this.args.items[0].type === 'Identifier' && this.args.items[0].src === '_') {
    return this.fn.compile(true) + '()';

    // Anything else...
  } else {
    return this.fn.compile(true) + '(' + this.args.items.map(function (arg) {
      var out = void 0;
      if (arg.type === "Destructure") {
        if (arg.destrType === 'Keys' && !arg.toDestructure.length) {
          out = '{}';
        } else {
          return (0, _utils.die)(_this, 'Can not pass a destructuring expression to a function call.');
        }
      } else {
        out = arg.compile(true);
      }
      out === '_' && (0, _utils.die)(_this, '"_" can not be used as a member of an argument list.');
      return out;
    }).join(', ') + ')';
  }
});