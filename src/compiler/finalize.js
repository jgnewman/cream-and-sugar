import CNS_ from 'cns-lib';

function prepend(str, withStr) {
  return withStr + '\n' + str;
}

export default function finalize(tree) {
  tree.shared.output = prepend(tree.shared.output, '//**END LIBRARY**//');
  tree.shared.output = prepend(tree.shared.output, 'var CNS_ = require("cns-lib");\n');
  tree.shared.output = tree.shared.output.replace(/(\}|\n)\s*\;\s*$/, '$1');
  return tree;
}
