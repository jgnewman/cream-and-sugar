import CNS_ from 'cns-lib';

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
  tree.shared.output = prepend(tree.shared.output, '//**END LIBRARY**//');
  tree.shared.output = prepend(tree.shared.output, 'var CNS_ = require("cns-lib");\n');
  tree.shared.output = tree.shared.output.replace(/(\}|\n)\s*\;\s*$/, '$1');
  return tree;
}
