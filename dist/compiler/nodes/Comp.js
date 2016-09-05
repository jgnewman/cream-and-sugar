'use strict';

var _utils = require('../utils');

/*
 * Turn comprehensions into functions as needed.
 */
(0, _utils.compile)(_utils.nodes.CompNode, function () {
  var action = this.action.compile(true);
  var params = '(' + this.params.items.map(function (item) {
    return item.compile(true);
  }).join(', ') + ')';
  var list = this.list.compile(true);
  var caveat = this.caveat ? this.caveat.compile(true) : null;
  if (!caveat) {
    return ('\n      ' + list + '.map(function ' + params + ' {\n        return ' + action + ';\n      }.bind(this))\n    ').replace(/\s+/g, ' ');
  } else {
    return '\n      (function () {\n        const __acc__ = [];\n        ' + list + '.forEach(function ' + params + ' {\n          if (' + caveat + ') {\n            __acc__.push(' + action + ');\n          }\n        }.bind(this));\n        return __acc__;\n      }.bind(this)())\n    ';
  }
});