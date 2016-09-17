'use strict';

var _utils = require('../utils');

/*
 * Handle assignment of variables using identifiers,
 * tuples, and cons statemtents. Note that all variables
 * are constants and should not be overwritable.
 */
(0, _utils.compile)(_utils.nodes.AssignmentNode, function () {
  var tuple = void 0;
  switch (this.left.type) {
    case 'Identifier':
    case 'Tuple':
      return 'const ' + this.left.compile(true) + ' = ' + this.right.compile(true);
    case 'Cons':
      var head = this.left.src.match(/^\[(.+)\|/)[1];
      var tail = this.left.src.match(/\|([^\]]+)\]/)[1];
      tuple = '{' + head + ', ' + tail + '}';
      this.shared.lib.add('assnCons');
      return 'const ' + tuple + ' = SYSTEM.assnCons(' + this.right.compile(true) + ', "' + head + '", "' + tail + '")';
    case 'BackCons':
      var lead = this.left.src.match(/^\[(.+)\|\|/)[1];
      var last = this.left.src.match(/\|\|([^\]]+)\]/)[1];
      tuple = '{' + lead + ', ' + last + '}';
      this.shared.lib.add('assnBackCons');
      return 'const ' + tuple + ' = SYSTEM.assnBackCons(' + this.right.compile(true) + ', "' + lead + '", "' + last + '")';
    default:
      (0, _utils.die)(this, 'Invalid expression in left hand assignment: ' + this.left.type);
  }
});