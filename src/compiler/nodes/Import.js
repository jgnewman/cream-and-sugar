import { compile, nodes } from '../utils';

/*
 * Translate imports 1-1.
 */
compile(nodes.ImportNode, function () {
  // Native Import
  // const getFrom = this.file ? ` from ${this.file.compile(true)}` : '';
  // const toImport = this.toImport.compile(true);
  // return `import ${toImport}${getFrom}`;

  // Traditional Import
  // Experimenting with this to see if it helps us import
  // modules in separate threads.
  return this.file ? `const ${this.toImport.compile(true)} = require(${this.file.compile(true)})`
                   : `require(${this.toImport.compile(true)})`;

});
