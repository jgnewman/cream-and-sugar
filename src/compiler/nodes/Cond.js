import { compile, nodes, compileBody } from '../utils';

/*
 * Format conditional syntax.
 */
compile(nodes.CondNode, function () {
  const compiled = this.conditions.map((condition, index) => {
    const {test, body} = condition;
    const keyword = index === 0 ? 'if' : 'else if';
    return `${keyword} (${test.compile(true)}) {
      ${compileBody(body)}
    }`;
  }).join(' ');
  return `(function () {
    ${compiled} else {
      throw new Error('No match found for "when" statement.');
    }
  }.bind(this)())`;
});
