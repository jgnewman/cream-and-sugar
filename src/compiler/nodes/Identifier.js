import { compile, nodes, die, getExposedFns, getReservedWords, getMsgPassingFns } from '../utils';

/*
 * Drop in identifiers.
 */
compile(nodes.IdentifierNode, function () {
  if (this.text === '@') return 'this';

  const base = this.text.replace(/^\@/, '');
  const clean = base.split('.').map((piece, pieceIndex) => {

    // Disallow identifiers that look like "this_"
    if (/[^_]_$/.test(piece)) {
      die(this, `${this.text} matches the pattern IDENTIFIER_ which is reserved for system variables.`);

    // Disallow reserved words
    } else if (pieceIndex === 0 && getReservedWords().indexOf(piece) > -1) {
      die(this, `${this.text} is a reserved word or contains a reserved word as a property name.`);

    // Translate system library functions
    } else if (pieceIndex === 0 && getExposedFns().indexOf(piece) > -1) {
      return `CNS_.${this.text}`;

    } else {
      return piece;
    }

  });

  // Use @ lookups if we have them
  if (this.text[0] === '@') {
    return `this.${clean.join('.')}`;

  } else {
    return clean.join('.');
  }
});
