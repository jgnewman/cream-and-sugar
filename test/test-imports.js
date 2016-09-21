import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Imports', () => {

  it('should import a module with no assignment', () => {
    const toCompile = `import './myfile'`;
    const expected = nlToSpace(`require('./myfile')`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should import a single item from a module', () => {
    const toCompile = `import a from './myfile'`;
    const expected = nlToSpace(`const a = require('./myfile')`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should import multiple items from a module', () => {
    const toCompile = `import { a, b, c } from './myfile'`;
    const expected = nlToSpace(`
      var __ref0__ = require('./myfile');
      const a = __ref0__.a;
      const b = __ref0__.b;
      const c = __ref0__.c
    `);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should handle various imports using strings, identifiers, and tuples', () => {
    const toCompile = `
      import x from y
      import x from 'y'
      import { x } from y
      import { x } from 'y'
      import { a, b, c } from y
      import { a, b, c } from 'y'
      import y
      import 'y'
    `;
    const expected = nlToSpace(`
      const x = require(y);
      const x = require('y');
      var __ref0__ = require(y);
      const x = __ref0__.x;
      var __ref1__ = require('y');
      const x = __ref1__.x;
      var __ref2__ = require(y);
      const a = __ref2__.a;
      const b = __ref2__.b;
      const c = __ref2__.c;
      var __ref3__ = require('y');
      const a = __ref3__.a;
      const b = __ref3__.b;
      const c = __ref3__.c;
      require(y);
      require('y');
    `);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
