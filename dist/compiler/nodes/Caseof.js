'use strict';

var _utils = require('../utils');

/*
 * Convert caseof into switch.
 */
(0, _utils.compile)(_utils.nodes.CaseofNode, function () {
  var _this = this;

  var needsDefault = false;
  var compiled = this.conditions.map(function (condition, index) {
    var test = condition.test;
    var body = condition.body;

    var compiledTest = test.compile(true);
    var casePrefix = compiledTest === 'default' ? compiledTest : 'case ' + compiledTest;
    if (index === _this.conditions.length - 1 && compiledTest !== 'default') {
      needsDefault = true;
    }
    return casePrefix + ':\n      ' + (0, _utils.compileBody)(body) + ';\n    ';
  }).join('');
  if (needsDefault) {
    this.shared.lib.add('noMatch');
    compiled += 'default: CNS_SYSTEM.noMatch(\'caseof\');';
  }
  return '(function () {\n    switch (' + this.comparator.compile(true) + ') {\n      ' + compiled + '\n    }\n  }.bind(this)())';
});