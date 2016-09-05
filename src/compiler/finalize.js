import system from './SYSTEM';

function prepend(str, withStr) {
  return withStr + '\n' + str;
}

export default function finalize(tree) {
  const lib = [...tree.shared.lib];
  tree.shared.output = prepend(tree.shared.output, lib.map(name => {
    return `SYSTEM.${name} = ${system[name].toString()}`;
  }).join(';\n'));
  tree.shared.output = prepend(tree.shared.output, 'const SYSTEM = {};');
  return tree;
}
