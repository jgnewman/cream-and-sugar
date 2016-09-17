'use strict';

var _utils = require('../utils');

/**
 * Captures blocks in an interpolation string to be parsed and compiled.
 *
 * @param  {String} str  A string surrounded by backticks.
 *
 * @return {Array}      Contains objects representing string portions and
 *                      code block portions.
 */
function fixInterp(str) {
  var acc = [];
  var piece = '';
  var inBlock = false;
  var curlies = 0;
  for (var i = 0; i < str.length; i += 1) {
    var cur = str[i];
    var next = str[i + 1];
    var prev = str[i - 1];
    if (cur === '{' && inBlock) {
      curlies += 1;
      piece += cur;
    } else if (cur === '{' && !inBlock && prev === '$') {
      inBlock = true;
      piece += cur;
      acc.push({ type: 'str', val: piece });
      piece = '';
    } else if (cur === '}' && inBlock) {
      if (curlies === 0) {
        inBlock = false;
        acc.push({ type: 'block', val: piece });
        piece = '';
        piece += cur;
      } else {
        curlies -= 1;
        piece += cur;
      }
    } else {
      piece += cur;
    }
  }
  acc.push({ type: 'str', val: piece });
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
  var out = '' + blocks.map(function (block) {
    if (block.type === 'str') {
      return block.val;
    } else {
      var value = _utils.parser.parse(block.val).body[0];
      value.loc = origNode.loc;
      value.shared = origNode.shared;
      return value.compile(true);
    }
  }).join('');
  return out;
}

/*
 * Drop in strings. Make sure to handle compiling values
 * within interpolation brackets.
 */
(0, _utils.compile)(_utils.nodes.StringNode, function () {
  if (this.text[0] === '`') {
    return compileInterpBlocks(fixInterp(this.text), this);
  } else {
    // Allow quoted strings to be captured on multiple lines but don't
    // compile them that way.
    return this.text.replace(/\n/g, '');
  }
});