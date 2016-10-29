import { compile, nodes, die } from '../utils';

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

  // import 'foo'
  if (!this.file) {
    return `require(${this.toImport.toDestructure.compile(true)})`;
  } else {

    let ref, base;
    const file = this.file.compile(true);
    switch (this.toImport.destrType) {

      // import foo from 'foo'
      case 'Lookup':
        return `const ${this.toImport.toDestructure.compile(true)} = require(${file})`

      // import 'foo' from 'foo'
      case 'String':
        return die(this, `Can not use a string as a variable name in an import statement.`);

      // import [ foo, bar ] from 'foo'
      // import {{ foo, bar }} from 'foo'
      case 'Array':
      case 'Tuple':
        ref = `ref${this.shared.refs += 1}_`;
        // Use var here so it can be redeclared in the REPL.
        base = `var ${ref} = require(${file});\n`;
        this.toImport.toDestructure.items.forEach((item, index) => {
          const varName = item.compile(true);
          base += `const ${varName} = ${ref}[${index}]`;
          index !== this.toImport.toDestructure.items.length - 1 && (base += ';\n');
        });
        return base;

      // import { foo, bar } from 'foo'
      case 'Keys':
        ref = `ref${this.shared.refs += 1}_`;
        // Use var here so it can be redeclared in the REPL.
        base = `var ${ref} = require(${file});\n`;
        this.toImport.toDestructure.forEach((item, index) => {
          const varName = item.compile(true);
          base += `const ${varName} = ${ref}.${varName}`;
          index !== this.toImport.toDestructure.length - 1 && (base += ';\n');
        });
        return base;

      // import { foo: f, bar: b } from 'foo'
      case 'Object':
        ref = `ref${this.shared.refs += 1}_`;
        // Use var here so it can be redeclared in the REPL.
        base = `var ${ref} = require(${file});\n`;
        this.toImport.toDestructure.pairs.forEach((item, index) => {
          const varName = item.right.compile(true);
          const propName = item.left.compile(true);
          base += `const ${varName} = ${ref}.${propName}`;
          index !== this.toImport.toDestructure.pairs.length - 1 && (base += ';\n');
        });
        return base;

      // import [ head | tail ] from 'foo'
      case 'HeadTail':
        ref = `ref${this.shared.refs += 1}_`;
        // Use var here so it can be redeclared in the REPL.
        base = `var ${ref} = require(${file});\n`;
        this.toImport.toDestructure.forEach((item, index) => {
          const varName = item.compile(true);
          if (index === 0) {
            base += `const ${varName} = ${ref}[0]`;
          } else {
            base += `const ${varName} = ${ref}.slice(1)`;
          }
          index !== this.toImport.toDestructure.length - 1 && (base += ';\n');
        });
        return base;

      // import [ lead || last ] from 'foo'
      case 'LeadLast':
        ref = `ref${this.shared.refs += 1}_`;
        // Use var here so it can be redeclared in the REPL.
        base = `var ${ref} = require(${file});\n`;
        this.toImport.toDestructure.forEach((item, index) => {
          const varName = item.compile(true);
          if (index === 0) {
            base += `const ${varName} = ${ref}.slice(0, ${ref}.length - 1)`;
          } else {
            base += `const ${varName} = ${ref}[${ref}.length - 1]`;
          }
          index !== this.toImport.toDestructure.length - 1 && (base += ';\n');
        });
        return base;

      default:
        die(this, `Can not import a ${this.toImport.type}.`);
    }
  }
});
