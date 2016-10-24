import { compile, nodes, die, getExposedFns, getReservedWords, getMsgPassingFns } from '../utils';

/*
 * Drop in identifiers.
 */
compile(nodes.IdentifierNode, function () {
  if (this.text === '@') return 'this';

  const base = this.text.replace(/^\@/, '');
  const clean = base.split('.').map(piece => {

    // Disallow identifiers that look like this_
    if (/[^_]_$/.test(piece)) {
      die(this, `${this.text} matches the pattern IDENTIFIER_ which is reserved for system variables.`);

    // Disallow reserved words
    } else if (getReservedWords().indexOf(piece) > -1) {
      die(this, `${this.text} is a reserved word or contains a reserved word as a property name.`);

    // Translate system library functions
    } else if (getExposedFns().indexOf(piece) > -1) {
      if (getMsgPassingFns().indexOf(piece) > -1) {
        this.shared.lib.add('msgs');
      }
      this.shared.lib.add(this.text);
      return `CNS_.${this.text}`;

    } else {
      return piece;
    }

  });

  return `${this.text[0] === '@' ? 'this.' : ''}${clean.join('.')}`;
});
