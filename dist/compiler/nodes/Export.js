"use strict";

var _utils = require("../utils");

/*
 * Translate exports 1-1.
 */
(0, _utils.compile)(_utils.nodes.ExportNode, function () {
  // Native Export
  // return `export ${this.isDefault ? 'default ' : ''}${this.toExport.compile(true)}`;

  // Traditional Export
  // Experimenting with this to see if it helps us import modules in separate threads.
  // Options:
  //
  //   export {{ factorial, schmactorial }}
  //   export { factorial: factorial, schmactorial: schmactorial }
  //   export [ factorial, schmactorial ]
  //   export {{ factorial, schmactorial }} >>= nameFilter >>= toObject

  var toExport = this.toExport.compile(true);
  return "typeof module === 'undefined'\n" + "  ? typeof console !== 'undefined' &&\n" + "    console.warn('Warning: You are attempting to export module values in a non-modular environment.')\n" + ("  : module.exports = " + toExport);
});