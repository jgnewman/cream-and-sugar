'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var _utils = require('../utils');

/*
 * Handle assignment of variables using identifiers,
 * tuples, and cons statemtents. Note that all variables
 * are constants and should not be overwritable.
 */
(0, _utils.compile)(_utils.nodes.AssignmentNode, function () {
  var _this = this;

  var tuple = void 0;

  var _ret = function () {
    switch (_this.left.type) {

      case 'Identifier':
        return {
          v: 'const ' + _this.left.compile(true) + ' = ' + _this.right.compile(true)
        };

      case 'Tuple':
        var ref = '__ref' + (_this.shared.refs += 1) + '__';
        // Use var here so it can be redeclared in the REPL.
        var base = 'var ' + ref + ' = ' + _this.right.compile(true) + ';\n';
        _this.left.items.forEach(function (item, index) {
          var varName = item.compile(true);
          base += 'const ' + varName + ' = ' + ref + '.' + varName;
          index !== _this.left.items.length - 1 && (base += ';\n');
        });
        return {
          v: base
        };

      case 'Cons':
        var head = _this.left.src.match(/^\[(.+)\|/)[1];
        var tail = _this.left.src.match(/\|([^\]]+)\]/)[1];
        var aref = '__ref' + (_this.shared.refs += 1) + '__';
        return {
          v: 'var ' + aref + ' = ' + _this.right.compile(true) + ';\n      const ' + head + ' = ' + aref + '[0];\n      const ' + tail + ' = ' + aref + '.slice(1)'
        };

      case 'BackCons':
        var lead = _this.left.src.match(/^\[(.+)\|\|/)[1];
        var last = _this.left.src.match(/\|\|([^\]]+)\]/)[1];
        var bref = '__ref' + (_this.shared.refs += 1) + '__';
        return {
          v: 'var ' + bref + ' = ' + _this.right.compile(true) + ';\n      const ' + lead + ' = ' + bref + '.slice(0, ' + bref + '.length - 1);\n      const ' + last + ' = ' + bref + '[' + bref + '.length - 1]'
        };

      default:
        (0, _utils.die)(_this, 'Invalid expression in left hand assignment: ' + _this.left.type);
    }
  }();

  if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
});