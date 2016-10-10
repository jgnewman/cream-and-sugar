import CNS_SYSTEM from './SYSTEM';

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
  const libPieces = [];
  lib.forEach(name => {
    libPieces.push(`CNS_SYSTEM.${name} = CNS_SYSTEM.${name} || ${stringify(CNS_SYSTEM[name])}`);
  });
  tree.shared.output = prepend(tree.shared.output, libPieces.length ? libPieces.join(';\n') + ';\n' : '\n');
  tree.shared.output = prepend(tree.shared.output, '//**END LIBRARY**//');
  tree.shared.output = prepend(tree.shared.output, `
    if      (typeof global !== "undefined") { global.CNS_SYSTEM = CNS_SYSTEM }
    else if (typeof window !== "undefined") { window.CNS_SYSTEM = CNS_SYSTEM }
    else if (typeof self   !== "undefined") { self.CNS_SYSTEM = CNS_SYSTEM   }
    else { this.CNS_SYSTEM = CNS_SYSTEM }\n
  `);
  tree.shared.output = prepend(tree.shared.output, 'var CNS_SYSTEM = typeof CNS_SYSTEM !== "undefined" ? CNS_SYSTEM : {};');
  tree.shared.output = tree.shared.output.replace(/(\}|\n)\s*\;\s*$/, '$1');
  return tree;
}
