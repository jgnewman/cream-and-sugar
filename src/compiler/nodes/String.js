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
 * Surrounds a string with quotation marks.
 *
 * @param  {String} str  A string
 * @return {String}
 */
function chooseQuote(str) {
  const hasSingle = /'/.test(str);
  const hasDouble = /"/.test(str);
  if (hasSingle && hasDouble) {
    return '"' + str.replace(/"/g, '\\"') + '"'; // Use doubles and escape the doubles.
  } else if (hasSingle) {
    return '"' + str + '"'; // Use doubles.
  } else if (hasDouble) {
    return "'" + str + "'"; // Use singles.
  } else {
    return '"' + str + '"'; // Use doubles.
  }
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

  // Old string compilation technique.
  // Keeping it around in case we want to bring it back.
  // const out = `${blocks.map(block => {
  //   if (block.type === 'str') {
  //     return block.val;
  //   } else {
  //     const value = parser.parse(block.val).body[0];
  //     value.loc = origNode.loc;
  //     value.shared = origNode.shared;
  //     return value.compile(true);
  //   }
  // }).join('')}`;
  // return out;

  const out = [];
  blocks.forEach((block, index) => {
    const prev = out[index - 1];
    const next = blocks[index + 1];
    const isFirst = index === 0;
    const isLast = index === blocks.length - 1;

    // For string type blocks, remove all of the "${" stuff and the backticks.
    if (block.type === 'str') {
      if (isFirst) (block.val = block.val.replace(/^`/, ''));
      if (isLast) (block.val = block.val.replace(/`$/, ''));
      if (prev) (block.val = block.val.replace(/^\}/, ''));
      if (next) (block.val = block.val.replace(/\$\{$/, ''));
      block.val = block.val.replace(/\n/g, '');
      // Choose a quote type.
      block.val.length && out.push(chooseQuote(block.val));

    // For block types, compile the block and surround it with parens.
    } else {
      const value = parser.parse(block.val).body[0];
      value.loc = origNode.loc;
      value.shared = origNode.shared;
      out.push('(' + value.compile(true) + ')');
    }
  });
  return out.join(' + ');
}

/*
 * Drop in strings. Make sure to handle compiling values
 * within interpolation brackets.
 */
compile(nodes.StringNode, function () {
  if (this.text[0] === '`') {
    return '(' + compileInterpBlocks(fixInterp(this.text), this) + ')';
  } else {
    // Allow quoted strings to be captured on multiple lines but don't
    // compile them that way.
    return this.text.replace(/\n/g, '');
  }
});
