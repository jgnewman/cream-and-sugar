import { compile, nodes, die } from '../utils';

/*
 * Handle trye/catch
 */
compile(nodes.TryCatchNode, function () {
  const newInc = (this.shared.errInc += 1);
  newInc > 1000000 && (this.shared.errInc = -1);
  (this.attempt.length !== 1 || this.fallback.length !== 1)
    && die(this, `"try" and "catch" must each be followed by a single function.`);
  return `(function () {
    try {
      return (${this.attempt[0].compile(true)}());
    } catch (__err__) {
      return (${this.fallback[0].compile(true)}(__err__));
    }
  }.bind(this)())`;
});
