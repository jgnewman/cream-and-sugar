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
  if (!this.file) {
    return `require(${this.toImport.compile(true)})`;
  } else if (this.toImport.type !== 'Tuple') {
    return `const ${this.toImport.compile(true)} = require(${this.file.compile(true)})`;
  } else {
    const ref = `__ref${this.shared.refs += 1}__`;
    // Use var here so it can be redeclared in the REPL.
    let base = `var ${ref} = require(${this.file.compile(true)});\n`;
    this.toImport.items.forEach((item, index) => {
      const varName = item.compile(true);
      base += `const ${varName} = ${ref}.${varName}`;
      index !== this.toImport.items.length - 1 && (base += ';\n');
    });
    return base;
  }

});
