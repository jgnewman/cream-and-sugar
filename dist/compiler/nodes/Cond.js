'use strict';

var _utils = require('../utils');

/*
 * Format conditional syntax.
 */
(0, _utils.compile)(_utils.nodes.CondNode, function () {
  var _this = this;

  var compiled = this.conditions.map(function (condition, index) {
    var test = condition.test,
        body = condition.body;

    var keyword = index === 0 ? 'if' : 'else if';
    if (test === 'default') {
      (0, _utils.die)(_this, '"Default" clauses are not allowed in "when" statements.');
    }
    return keyword + ' (' + test.compile(true) + ') {\n      ' + (0, _utils.compileBody)(body) + '\n    }';
  }).join(' ');
  return '(function () {\n    ' + compiled + ' else {\n      throw new Error(\'No match found for "when" statement.\');\n    }\n  }.bind(this)())';
});