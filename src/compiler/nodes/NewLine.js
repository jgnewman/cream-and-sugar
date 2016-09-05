import { compile, nodes } from '../utils';

function getLastChar(str) {
  const trimmed = str.trim();
  return trimmed[trimmed.length - 1];
}

/*
 * Newlines output newlines.
 */
compile(nodes.NewLineNode, function () {
  const insertConditions = this.shared.insertSemis
                           && getLastChar(this.shared.output) !== ';'
                           && /[^\n\;]/.test(this.shared.output);
  const output = insertConditions ? ';\n' : '\n';
  return output;
});
