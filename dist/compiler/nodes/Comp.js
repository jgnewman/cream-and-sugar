'use strict';

var _utils = require('../utils');

/*
 * Turn comprehensions into functions as needed.
 */
(0, _utils.compile)(_utils.nodes.CompNode, function () {
  var action = this.action.compile(true);
  var params = '(' + this.params.map(function (item) {
    return item.compile(true);
  }).join(', ') + ')';
  var list = this.list.compile(true);
  var caveat = this.caveat ? this.caveat.compile(true) : null;
  if (!caveat) {
    return (list + '.map(function ' + params + ' {\n        return ' + action + ';\n      }.bind(this))\n    ').replace(/\s+$/, '').replace(/\s+/g, ' ');
  } else {
    return ('\n      (function () {\n        const acc_ = [];\n        ' + list + '.forEach(function ' + params + ' {\n          if (' + caveat + ') {\n            acc_.push(' + action + ');\n          }\n        }.bind(this));\n        return acc_;\n      }.bind(this)())\n    ').replace(/^\s+|\s+$/g, '');
  }
});