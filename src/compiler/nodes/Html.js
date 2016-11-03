import { compile, nodes, compileBody, die } from '../utils';

function maybeQuote(str) {
  return /[A-Z]/.test(str[0]) ? str : `"${str}"`;
}

function compileAttrs(attrs) {
  return attrs.map(attr => {
    let val = attr[1].type === 'Tuple'
                ? attr[1].items[0].compile(true)
                : attr[1].compile(true);
    return `${attr[0].compile(true)}: ${val}`;
  }).join(', ');
}

/*
 * Translate tuples 1-1.
 */
compile(nodes.HtmlNode, function () {
  const name  = maybeQuote(this.openTag.compile(true));
  const body  = this.body ? compileBody(this.body, ',') : '';
  const close = !this.selfClosing ? this.closeTag.replace(/^\<\/\s*|\s*\>$/g, '') : null;
  const attrs = compileAttrs(this.attrs);
  if (!this.selfClosing && close !== name.replace(/[\'\"\`]/g, '')) {
    die(this, `Closing tag "${close}" does not match opening tag ${name}.`);
  }
  return `CNS_.createElement(${name}, {${attrs}}, [${body ? '\n' + body + '\n' : ''}])`;
});
