import CNS_ from './SYSTEM';

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
    libPieces.push(`CNS_.${name} = CNS_.${name} || ${stringify(CNS_[name])}`);
  });
  tree.shared.output = prepend(tree.shared.output, libPieces.length ? libPieces.join(';\n') + ';\n' : '\n');
  tree.shared.output = prepend(tree.shared.output, '//**END LIBRARY**//');
  tree.shared.output = prepend(tree.shared.output, `
    if      (typeof global !== "undefined") { global.CNS_ = CNS_ }
    else if (typeof window !== "undefined") { window.CNS_ = CNS_ }
    else if (typeof self   !== "undefined") { self.CNS_ = CNS_   }
    else { this.CNS_ = CNS_ }\n
  `);
  tree.shared.output = prepend(tree.shared.output, 'var CNS_ = typeof CNS_ !== "undefined" ? CNS_ : {};');
  tree.shared.output = tree.shared.output.replace(/(\}|\n)\s*\;\s*$/, '$1');
  return tree;
}
