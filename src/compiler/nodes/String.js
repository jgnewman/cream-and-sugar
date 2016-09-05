import { compile, nodes, parser } from '../utils';

/**
 * Captures blocks in an interpolation string to be parsed and compiled.
 *
 * @param  {String} str  A string surrounded by backticks.
 *
 * @return {Array}      Contains objects representing string portions and
 *                      code block portions.
 */
function fixInterp(str) {
  const acc = [];
  let piece = '';
  let inBlock = false;
  let curlies = 0;
  for (let i = 0; i < str.length; i += 1) {
    const cur = str[i];
    const next = str[i+1];
    const prev = str[i-1];
    if (cur === '{' && inBlock) {
      curlies += 1;
      piece += cur;
    } else if (cur === '{' && !inBlock && prev === '$') {
      inBlock = true;
      piece += cur;
      acc.push({type: 'str', val: piece});
      piece = '';
    } else if (cur === '}' && inBlock) {
      if (curlies === 0) {
        inBlock = false;
        acc.push({type: 'block', val: piece});
        piece = '';
        piece += cur;
      } else {
        curlies -=1;
        piece += cur;
      }
    } else {
      piece += cur;
    }
  }
  acc.push({type: 'str', val: piece});
  return acc;
}

/**
 * Handles compiling values withing interpolation brackets of
 * backtick strings.
 *
 * @param  {Array}      blocks   The result of calling `fixInterp`.
 * @param  {StringNode} origNode The original string node.
 *
 * @return {String}              The compiled string.
 */
function compileInterpBlocks(blocks, origNode) {
  const out = `${blocks.map(block => {
    if (block.type === 'str') {
      return block.val;
    } else {
      const value = parser.parse(block.val).body[0];
      value.loc = origNode.loc;
      value.shared = origNode.shared;
      return value.compile(true);
    }
  }).join('')}`;
  return out;
}

/*
 * Drop in strings. Make sure to handle compiling values
 * within interpolation brackets.
 */
compile(nodes.StringNode, function () {
  if (this.text[0] === '`') {
    return compileInterpBlocks(fixInterp(this.text), this);
  } else {
    return this.text;
  }
});
