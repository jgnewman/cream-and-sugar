import { compile, nodes, die, getExposedFns, getReservedWords, getMsgPassingFns } from '../utils';

/*
 * Drop in identifiers.
 */
compile(nodes.IdentifierNode, function () {
  const base = this.text.replace(/^\@/, '');
  if (getReservedWords().indexOf(base) > -1) {
    die(this, `${this.text}" is a reserved word.`);
  } else if (getExposedFns().indexOf(this.text) > -1) {
    if (getMsgPassingFns().indexOf(this.text) > -1) {
      this.shared.lib.add('msgs');
    }
    this.shared.lib.add(this.text);
    return `SYSTEM.${this.text}`;
  }
  return this.text.replace(/^\@/, 'this.').replace(/\.$/, ''); // Strip trailing dots in case of "@" -> "this."
});
