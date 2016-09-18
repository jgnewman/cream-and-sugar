import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';
import { nlToSpace } from './utils';


describe('Assignments', () => {

  it('should compile a basic assignment', () => {
    const toCompile = 'x = 4';
    assert.equal(`const ${toCompile}`, compileCode(toCompile));
  });

  it('should compile a cons destructure', () => {
    const toCompile = '[h|t] = [1, 2, 3]';
    const expected = nlToSpace(`
      var __ref0__ = [1, 2, 3];
      const h = __ref0__[0];
      const t = __ref0__.slice(1)
    `);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a back cons destructure', () => {
    const toCompile = '[ld||lst] = [1, 2, 3]';
    const expected = nlToSpace(`
      var __ref0__ = [1, 2, 3];
      const ld = __ref0__.slice(0, __ref0__.length - 1);
      const lst = __ref0__[__ref0__.length - 1]
    `);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a single item tuple destructure', () => {
    const toCompile = '{a} = foo';
    const expected = nlToSpace(`
      var __ref0__ = foo;
      const a = __ref0__.a
    `);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a multi item tuple destructure', () => {
    const toCompile = '{a, b, c} = foo';
    const expected = nlToSpace(`
      var __ref0__ = foo;
      const a = __ref0__.a;
      const b = __ref0__.b;
      const c = __ref0__.c
    `);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile an tuple destructure beginning with new lines', () => {
    const toCompile = `{

      a, b, c} = foo`;
    const expected = nlToSpace(`
      var __ref0__ = foo;
      const a = __ref0__.a;
      const b = __ref0__.b;
      const c = __ref0__.c
    `);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile an tuple destructure ending with new lines', () => {
    const toCompile = `{a, b, c

    } = foo`;
    const expected = nlToSpace(`
      var __ref0__ = foo;
      const a = __ref0__.a;
      const b = __ref0__.b;
      const c = __ref0__.c
    `);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile an tuple destructure beginning and ending with new lines', () => {
    const toCompile = `{

      a, b, c

    } = foo`;
    const expected = nlToSpace(`
      var __ref0__ = foo;
      const a = __ref0__.a;
      const b = __ref0__.b;
      const c = __ref0__.c
    `);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a tuple destructure with new lines between items', () => {
    const toCompile = `{a,
      b,
      c} = foo`;
    const expected = nlToSpace(`
      var __ref0__ = foo;
      const a = __ref0__.a;
      const b = __ref0__.b;
      const c = __ref0__.c
    `);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a tuple destructure with new lines everywhere', () => {
    const toCompile = `{
      a,
      b,
      c
    } = foo`;
    const expected = nlToSpace(`
      var __ref0__ = foo;
      const a = __ref0__.a;
      const b = __ref0__.b;
      const c = __ref0__.c
    `);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
