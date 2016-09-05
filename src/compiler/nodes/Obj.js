import { compile, nodes } from '../utils';

/*
 * Translate objects 1-1.
 */
compile(nodes.ObjNode, function () {
  const space = ' ';
  return `{${space}${this.pairs.map(pair => {
    const key = pair.left.type === 'Atom' ? `[${pair.left.compile(true)}]` : pair.left.compile(true);
    const val = pair.right.compile(true);
    return `${key}: ${val}`;
  }).join(',' + space)}${space}}`;
});
