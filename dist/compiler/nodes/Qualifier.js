'use strict';

var _utils = require('../utils');

/*
 * Turn qualifiers into function calls so that
 * they can always return a value.
 */
(0, _utils.compile)(_utils.nodes.QualifierNode, function () {
  var conditionBase = this.condition.compile(true);
  // Make the contition negative if the keyword was "unless"
  var condition = this.keyword === 'if' ? conditionBase : '!(' + conditionBase + ')';
  var elseCase = !this.elseCase ? '' : ', function () {\n    return ' + this.elseCase.compile(true) + ';\n  }.bind(this)';
  return ('CNS_.qualify(' + condition + ', function () {\n    return ' + this.action.compile(true) + ';\n  }.bind(this)' + elseCase + ')').replace(/\s+/g, ' ');
});