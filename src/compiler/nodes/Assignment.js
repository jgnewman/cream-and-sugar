import { compile, nodes, die } from '../utils';

/*
 * Handle assignment of variables using identifiers,
 * tuples, and cons statemtents. Note that all variables
 * are constants and should not be overwritable.
 */
compile(nodes.AssignmentNode, function () {
  let tuple, ref, base;
  switch (this.left.type) {

    case 'Identifier':
    case 'Lookup':
      return `const ${this.left.compile(true)} = ${this.right.compile(true)}`;

    case 'Arr':
    case 'Tuple':
      ref = `ref${this.shared.refs += 1}_`;
      // Use var here so it can be redeclared in the REPL.
      base = `var ${ref} = ${this.right.compile(true)};\n`;
      this.left.items.forEach((item, index) => {
        const varName = item.compile(true);
        base += `const ${varName} = ${ref}[${index}]`;
        index !== this.left.items.length - 1 && (base += ';\n');
      });
      return base;

    case 'Keys':
      ref = `ref${this.shared.refs += 1}_`;
      // Use var here so it can be redeclared in the REPL.
      base = `var ${ref} = ${this.right.compile(true)};\n`;
      this.left.items.forEach((item, index) => {
        const varName = item.compile(true);
        base += `const ${varName} = ${ref}.${varName}`;
        index !== this.left.items.length - 1 && (base += ';\n');
      });
      return base;

    case 'Obj':
      ref = `ref${this.shared.refs += 1}_`;
      // Use var here so it can be redeclared in the REPL.
      base = `var ${ref} = ${this.right.compile(true)};\n`;
      this.left.pairs.forEach((item, index) => {
        const varName = item.right.compile(true);
        const propName = item.left.compile(true);
        base += `const ${varName} = ${ref}.${propName}`;
        index !== this.left.pairs.length - 1 && (base += ';\n');
      });
      return base;

    case 'HeadTail':
      ref = `ref${this.shared.refs += 1}_`;
      // Use var here so it can be redeclared in the REPL.
      base = `var ${ref} = ${this.right.compile(true)};\n`;
      this.left.items.forEach((item, index) => {
        const varName = item.compile(true);
        if (index === 0) {
          base += `const ${varName} = ${ref}[0]`;
        } else {
          base += `const ${varName} = ${ref}.slice(1)`;
        }
        index !== this.left.items.length - 1 && (base += ';\n');
      });
      return base;

    case 'LeadLast':
      ref = `ref${this.shared.refs += 1}_`;
      // Use var here so it can be redeclared in the REPL.
      base = `var ${ref} = ${this.right.compile(true)};\n`;
      this.left.items.forEach((item, index) => {
        const varName = item.compile(true);
        if (index === 0) {
          base += `const ${varName} = ${ref}.slice(0, ${ref}.length - 1)`;
        } else {
          base += `const ${varName} = ${ref}[${ref}.length - 1]`;
        }
        index !== this.left.items.length - 1 && (base += ';\n');
      });
      return base;

    default:
      die(this, `Invalid expression in left hand assignment: ${this.left.type}`);
  }
});
