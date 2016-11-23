import { compile, nodes, die, getExposedFns, getReservedWords, getMsgPassingFns } from '../utils';

function isReserved(word, index, hasProtector) {
  return index === 0 &&
         !hasProtector &&
         getReservedWords().indexOf(word) > -1;
}

function isBif(word, index, hasProtector) {
  return index === 0 &&
         !hasProtector &&
         getExposedFns().indexOf(word) > -1;
}

/*
 * Drop in identifiers.
 */
compile(nodes.IdentifierNode, function () {
  if (this.text === '@') return 'this';

  const base = this.text.replace(/^(\@|\~)/, '');
  const hasProtector = this.text[0] === '~';
  const clean = base.split('.').map((piece, pieceIndex) => {

    // Disallow identifiers that look like "this_"
    if (/[^_]_$/.test(piece)) {
      die(this, `${this.text} matches the pattern IDENTIFIER_ which is reserved for system variables.`);

    // Disallow reserved words
    } else if (isReserved(piece, pieceIndex, hasProtector)) {
      die(this, `${this.text} is a reserved word or contains a reserved word.`);

    // Translate system library functions
    } else if (isBif(piece, pieceIndex, hasProtector)) {
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
