import { compile, nodes, compileBody } from '../utils';

/*
 * Handle trye/catch
 */
compile(nodes.TryCatchNode, function () {
  return `(function () {
    try {
      ${compileBody(this.attempt)};
    } catch (${this.errName.compile(true)}) {
      ${compileBody(this.fallback)};
    }
  }.bind(this)())`;
});
