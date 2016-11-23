import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Imports', () => {

  it('should import a module with no assignment', () => {
    const toCompile = `import './myfile'`;
    const expected = nlToSpace(`require('./myfile');`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should import a single item from a module', () => {
    const toCompile = `import a from './myfile'`;
    const expected = nlToSpace(`const a = require('./myfile');`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should import multiple items from a module', () => {
    const toCompile = `import { a, b, c } from './myfile'`;
    const expected = nlToSpace(`
      var ref0_ = require('./myfile');
      const a = ref0_.a;
      const b = ref0_.b;
      const c = ref0_.c;
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should handle various imports using strings, identifiers, and tuples', () => {
    const toCompile = 'import x from y\n'
                    + 'import x from "y"\n'
                    + 'import { x } from y\n'
                    + 'import { x } from "y"\n'
                    + 'import { a, b, c } from y\n'
                    + 'import { a, b, c } from "y"\n'
                    + 'import y\n'
                    + 'import "y"\n';
    const expected = nlToSpace(`
      const x = require(y);
      const x = require("y");
      var ref0_ = require(y);
      const x = ref0_.x;
      var ref1_ = require("y");
      const x = ref1_.x;
      var ref2_ = require(y);
      const a = ref2_.a;
      const b = ref2_.b;
      const c = ref2_.c;
      var ref3_ = require("y");
      const a = ref3_.a;
      const b = ref3_.b;
      const c = ref3_.c;
      require(y);
      require("y");
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
