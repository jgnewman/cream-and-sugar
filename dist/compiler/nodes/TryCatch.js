'use strict';

var _utils = require('../utils');

/*
 * Handle trye/catch
 */
(0, _utils.compile)(_utils.nodes.TryCatchNode, function () {
  var newInc = this.shared.errInc += 1;
  newInc > 1000000 && (this.shared.errInc = -1);
  (this.attempt.length !== 1 || this.fallback.length !== 1) && (0, _utils.die)(this, '"try" and "catch" must each be followed by a single function.');
  return '(function () {\n    try {\n      return (' + this.attempt[0].compile(true) + '());\n    } catch (__err__) {\n      return (' + this.fallback[0].compile(true) + '(__err__));\n    }\n  }.bind(this)())';
});