'use strict';

var _utils = require('../utils');

/*
 * Format conditional syntax.
 */
(0, _utils.compile)(_utils.nodes.CondNode, function () {
  var compiled = this.conditions.map(function (condition, index) {
    var test = condition.test;
    var body = condition.body;

    var keyword = index === 0 ? 'if' : 'else if';
    return keyword + ' (' + test.compile(true) + ') {\n      ' + (0, _utils.compileBody)(body) + '\n    }';
  }).join(' ');
  this.shared.lib.add('noMatch');
  return '(function () {\n    ' + compiled + ' else {\n      return CNS_SYSTEM.noMatch(\'cond\');\n    }\n  }.bind(this)())';
});