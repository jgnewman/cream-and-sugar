'use strict';

var _utils = require('../utils');

function collectChain(orig, accum) {
  orig.forEach(function (item) {
    if (item.type === 'Pipe') {
      accum.push(item.initVal);
      accum = accum.concat(collectChain(item.chain, []));
    } else {
      accum.push(item);
    }
  });
  return accum;
}

/*
 * Translate scope piping chains.
 */
// CNS_SYSTEM.pipe(4).to(addNum, 2).to(subNum, 2)();
(0, _utils.compile)(_utils.nodes.PipeNode, function () {
  var flatChain = collectChain(this.chain, []);

  var links = flatChain.map(function (item) {
    if (item.type === 'FunctionCall') {
      var args = item.args.items.map(function (arg) {
        return arg.compile(true);
      }).join(', ');
      return '.to(' + item.fn.compile(true) + ', ' + args + ')';
    } else {
      return '.to(' + item.compile(true) + ')';
    }
  }).join('');
  this.shared.lib.add('pipe');

  if (this.initVal.type === 'Import') {
    if (this.initVal.toImport.type === 'Tuple') {
      (0, _utils.die)(this, 'You can only use scope piping when importing an entire module, not when importing multiple values in tuple form.');
    }
    var ref = '__ref' + (this.shared.refs += 1) + '__';
    var imp = this.initVal.compile(true).replace(/[^\s]+\s*=/, ref + ' =');
    return imp + ';\nconst ' + this.initVal.toImport.compile(true) + ' = CNS_SYSTEM.pipe(' + ref + ')' + links + '()';
  } else {
    return 'CNS_SYSTEM.pipe(' + this.initVal.compile(true) + ')' + links + '()';
  }
});