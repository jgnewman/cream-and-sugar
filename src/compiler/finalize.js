import system from './SYSTEM';

function prepend(str, withStr) {
  return withStr + '\n' + str;
}

function stringify(val) {
  if (Array.isArray(val)) {
    return JSON.stringify(val);
  } else if (typeof val === 'object') {
    return '{' + Object.keys(val).map(key => {
      return `${key}: ${stringify(val[key])}`;
    }).join(',\n') + '}'
  } else {
    return val.toString();
  }
}

export default function finalize(tree) {
  const lib = [...tree.shared.lib];
  tree.shared.output = prepend(tree.shared.output, lib.map(name => {
    return `SYSTEM.${name} = SYSTEM.${name} || ${stringify(system[name])}`;
  }).join(';\n') + ';\n');
  tree.shared.output = prepend(tree.shared.output, 'var SYSTEM = typeof SYSTEM !== "undefined" ? SYSTEM : {};');
  tree.shared.output = tree.shared.output.replace(/\}\s*\;\s*$/, '}');
  return tree;
}
