import system from './SYSTEM';

function prepend(str, withStr) {
  return withStr + '\n' + str;
}

export default function finalize(tree) {
  const lib = [...tree.shared.lib];
  tree.shared.output = prepend(tree.shared.output, lib.map(name => {
    return `SYSTEM.${name} = SYSTEM.${name} || ${system[name].toString()}`;
  }).join(';\n') + ';\n');
  tree.shared.output = prepend(tree.shared.output, 'var SYSTEM = SYSTEM || {};');
  tree.shared.output = tree.shared.output.replace(/\}\s*\;\s*$/, '}');
  return tree;
}
