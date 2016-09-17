'use strict';

var _utils = require('../utils');

/*
 * Handle trye/catch
 */
(0, _utils.compile)(_utils.nodes.TryCatchNode, function () {
  return '(function () {\n    try {\n      ' + (0, _utils.compileBody)(this.attempt) + ';\n    } catch (' + this.errName.compile(true) + ') {\n      ' + (0, _utils.compileBody)(this.fallback) + ';\n    }\n  }.bind(this)())';
});