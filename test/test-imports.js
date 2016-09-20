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
    //const expected = nlToSpace(`const {a, b, c} = require('./myfile')`);
    const expected = nlToSpace(`
      var __ref0__ = require('./myfile');
      const a = __ref0__.a;
      const b = __ref0__.b;
      const c = __ref0__.c
    `);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
