'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

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
  if (!this.file) {
    return 'require(' + this.toImport.compile(true) + ')';
  } else if (this.toImport.type !== 'Tuple') {
    return 'const ' + this.toImport.compile(true) + ' = require(' + this.file.compile(true) + ')';
  } else {
    var _ret = function () {
      var ref = '__ref' + (_this.shared.refs += 1) + '__';
      // Use var here so it can be redeclared in the REPL.
      var base = 'var ' + ref + ' = require(' + _this.file.compile(true) + ');\n';
      _this.toImport.items.forEach(function (item, index) {
        var varName = item.compile(true);
        base += 'const ' + varName + ' = ' + ref + '.' + varName;
        index !== _this.toImport.items.length - 1 && (base += ';\n');
      });
      return {
        v: base
      };
    }();

    if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
  }
});