import { compile, nodes } from '../utils';

function getLastChar(str) {
  const trimmed = str.trim();
  return trimmed[trimmed.length - 1];
}

function semiShouldFollowLastChar(str) {
  const char = getLastChar(str);
  return char !== ';';
}

/*
 * Newlines output newlines.
 */
compile(nodes.NewLineNode, function () {
  const insertConditions = this.shared.insertSemis
                           && semiShouldFollowLastChar(this.shared.output)
                           && /[^\n\;]/.test(this.shared.output);
  const output = insertConditions ? ';\n' : '\n';
  return output;
});
