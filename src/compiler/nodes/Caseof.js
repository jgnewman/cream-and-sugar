import { compile, nodes, compileBody } from '../utils';

/*
 * Convert caseof into switch.
 */
compile(nodes.CaseofNode, function () {
  let needsDefault = false;
  let compiled = this.conditions.map((condition, index) => {
    const {test, body} = condition;
    const compiledTest = test.compile(true);
    const casePrefix = compiledTest === 'default' ? compiledTest : `case ${compiledTest}`;
    if (index === this.conditions.length - 1 && compiledTest !== 'default') {
      needsDefault = true;
    }
    return `${casePrefix}:
      ${compileBody(body)};
    `;
  }).join('');
  if (needsDefault) {
    this.shared.lib.add('noMatch');
    compiled += `default: CNS_.noMatch('caseof');`;
  }
  return `(function () {
    switch (${this.comparator.compile(true)}) {
      ${compiled}
    }
  }.bind(this)())`;
});
