import { compile, nodes } from '../utils';

/*
 * Translate atoms to symbols.
 */
compile(nodes.AtomNode, function () {
  return `Symbol.for('${this.text}')`;
});
