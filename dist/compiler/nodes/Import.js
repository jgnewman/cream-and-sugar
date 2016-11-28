'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _utils = require('../utils');

/*
 * Translate imports 1-1.
 */
(0, _utils.compile)(_utils.nodes.ImportNode, function () {
  var _this = this;

  // Native Import
  // const getFrom = this.file ? ` from ${this.file.compile(true)}` : '';
  // const toImport = this.toImport.compile(true);
  // return `import ${toImport}${getFrom}`;

  // Traditional Import
  // Experimenting with this to see if it helps us import
  // modules in separate threads.

  // import 'foo'
  if (!this.file) {
    return 'require(' + this.toImport.toDestructure.compile(true) + ')';
  } else {
    var _ret = function () {

      var ref = void 0,
          base = void 0;
      var file = _this.file.compile(true);
      switch (_this.toImport.destrType) {

        // import foo from 'foo'
        case 'Lookup':
          return {
            v: 'const ' + _this.toImport.toDestructure.compile(true) + ' = require(' + file + ')'
          };

        // import 'foo' from 'foo'
        case 'String':
          return {
            v: (0, _utils.die)(_this, 'Can not use a string as a variable name in an import statement.')
          };

        // import [ foo, bar ] from 'foo'
        // import {{ foo, bar }} from 'foo'
        case 'Array':
        case 'Tuple':
          ref = 'ref' + (_this.shared.refs += 1) + '_';
          // Use var here so it can be redeclared in the REPL.
          base = 'var ' + ref + ' = require(' + file + ');\n';
          _this.toImport.toDestructure.items.forEach(function (item, index) {
            var varName = item.compile(true);
            base += 'const ' + varName + ' = ' + ref + '[' + index + ']';
            index !== _this.toImport.toDestructure.items.length - 1 && (base += ';\n');
          });
          return {
            v: base
          };

        // import { foo, bar } from 'foo'
        case 'Keys':
          ref = 'ref' + (_this.shared.refs += 1) + '_';
          // Use var here so it can be redeclared in the REPL.
          base = 'var ' + ref + ' = require(' + file + ');\n';
          _this.toImport.toDestructure.forEach(function (item, index) {
            var varName = item.compile(true);
            base += 'const ' + varName + ' = ' + ref + '.' + varName;
            index !== _this.toImport.toDestructure.length - 1 && (base += ';\n');
          });
          return {
            v: base
          };

        // import { foo: f, bar: b } from 'foo'
        case 'Object':
          ref = 'ref' + (_this.shared.refs += 1) + '_';
          // Use var here so it can be redeclared in the REPL.
          base = 'var ' + ref + ' = require(' + file + ');\n';
          _this.toImport.toDestructure.pairs.forEach(function (item, index) {
            var varName = item.right.compile(true);
            var propName = item.left.compile(true);
            base += 'const ' + varName + ' = ' + ref + '.' + propName;
            index !== _this.toImport.toDestructure.pairs.length - 1 && (base += ';\n');
          });
          return {
            v: base
          };

        // import [ head | tail ] from 'foo'
        case 'HeadTail':
          ref = 'ref' + (_this.shared.refs += 1) + '_';
          // Use var here so it can be redeclared in the REPL.
          base = 'var ' + ref + ' = require(' + file + ');\n';
          _this.toImport.toDestructure.forEach(function (item, index) {
            var varName = item.compile(true);
            if (index === 0) {
              base += 'const ' + varName + ' = ' + ref + '[0]';
            } else {
              base += 'const ' + varName + ' = ' + ref + '.slice(1)';
            }
            index !== _this.toImport.toDestructure.length - 1 && (base += ';\n');
          });
          return {
            v: base
          };

        // import [ lead || last ] from 'foo'
        case 'LeadLast':
          ref = 'ref' + (_this.shared.refs += 1) + '_';
          // Use var here so it can be redeclared in the REPL.
          base = 'var ' + ref + ' = require(' + file + ');\n';
          _this.toImport.toDestructure.forEach(function (item, index) {
            var varName = item.compile(true);
            if (index === 0) {
              base += 'const ' + varName + ' = ' + ref + '.slice(0, ' + ref + '.length - 1)';
            } else {
              base += 'const ' + varName + ' = ' + ref + '[' + ref + '.length - 1]';
            }
            index !== _this.toImport.toDestructure.length - 1 && (base += ';\n');
          });
          return {
            v: base
          };

        default:
          (0, _utils.die)(_this, 'Can not import a ' + _this.toImport.type + '.');
      }
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }
});