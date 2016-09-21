'use strict';

var _utils = require('../utils');

/*
 * Translate exports 1-1.
 */
(0, _utils.compile)(_utils.nodes.ExportNode, function () {
  // Native Export
  // return `export ${this.isDefault ? 'default ' : ''}${this.toExport.compile(true)}`;

  // Traditional Export
  // Experimenting with this to see if it helps us import modules in separate threads.
  // You can only export a tuple. No `as`.
  // You can not do a `default` export.
  this.shared.lib.add('exp');
  this.shared.lib.add('aritize');
  return '' + this.toExport.map(function (item) {
    var compiled = item.name.compile(true);
    if (item.arity === '*') {
      return 'CNS_SYSTEM.exp("' + compiled + '", ' + compiled + ')';
    } else {
      var aritize = 'CNS_SYSTEM.aritize(' + compiled + ', ' + item.arity.compile(true) + ')';
      return 'CNS_SYSTEM.exp("' + compiled + '", ' + aritize + ')';
    }
  }).join(';\n');
});