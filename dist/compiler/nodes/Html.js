'use strict';

var _utils = require('../utils');

function maybeQuote(str) {
  return (/[A-Z]/.test(str[0]) ? str : '"' + str + '"'
  );
}

function compileAttrs(attrs) {
  return attrs.map(function (attr) {
    var val = attr[1].type === 'Tuple' ? attr[1].items[0].compile(true) : attr[1].compile(true);
    return attr[0].compile(true) + ': ' + val;
  }).join(', ');
}

/*
 * Translate tuples 1-1.
 */
(0, _utils.compile)(_utils.nodes.HtmlNode, function () {
  var name = maybeQuote(this.openTag.compile(true));
  var body = this.body ? (0, _utils.compileBody)(this.body, ',') : '';
  var close = !this.selfClosing ? this.closeTag.replace(/^\<\/\s*|\s*\>$/g, '') : null;
  var attrs = compileAttrs(this.attrs);
  if (!this.selfClosing && close !== name.replace(/[\'\"\`]/g, '')) {
    (0, _utils.die)(this, 'Closing tag "' + close + '" does not match opening tag ' + name + '.');
  }
  return 'CNS_.createElement(' + name + ', {' + attrs + '}, [' + (body ? '\n' + body + '\n' : '') + '])';
});