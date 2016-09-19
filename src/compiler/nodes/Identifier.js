import { compile, nodes, die, getExposedFns, getReservedWords, getMsgPassingFns } from '../utils';

/*
 * Drop in identifiers.
 */
compile(nodes.IdentifierNode, function () {
  const base = this.text.replace(/^\@/, '');

  // Disallow identifiers that look like __this__
  if (/^__/.test(base) && /__$/.test(base)) {
    die(this, `${this.text} matches the pattern __IDENTIFIER__ which is reserved for system variables.`);

  // Disallow reserved words
  } else if (getReservedWords().indexOf(base) > -1) {
    die(this, `${this.text} is a reserved word.`);

  // Translate system library functions
  } else if (getExposedFns().indexOf(base) > -1) {
    if (getMsgPassingFns().indexOf(base) > -1) {
      this.shared.lib.add('msgs');
    }
    this.shared.lib.add(this.text);
    return `CNS_SYSTEM.${this.text}`;
  }

  // Otherwise, just make sure to replace @ with "this"
  return this.text.replace(/^\@/, 'this.').replace(/\.$/, ''); // Strip trailing dots in case of "@" -> "this."
});
