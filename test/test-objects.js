import assert from 'assert';
import { shrink } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Objects', () => {

  it('should compile an empty object', () => {
    const toCompile = '{}';
    assert.equal(toCompile, shrink(compileCode(toCompile)));
  });

  it('should compile a single item object', () => {
    const toCompile = '{a:1}';
    assert.equal(toCompile, shrink(compileCode(toCompile)));
  });

  it('should compile a multi item object', () => {
    const toCompile = '{a:1,b:2,c:3}';
    assert.equal(toCompile, shrink(compileCode(toCompile)));
  });

  it('should compile an object beginning with new lines', () => {
    const toCompile = `{

      a:1,b:2,c:3}`;
    assert.equal('{a:1,b:2,c:3}', shrink(compileCode(toCompile)));
  });

  it('should compile an object ending with new lines', () => {
    const toCompile = `{a:1,b:2,c:3

    }`;
    assert.equal('{a:1,b:2,c:3}', shrink(compileCode(toCompile)));
  });

  it('should compile an object beginning and ending with new lines', () => {
    const toCompile = `{

      a:1,b:2,c:3

    }`;
    assert.equal('{a:1,b:2,c:3}', shrink(compileCode(toCompile)));
  });

  it('should compile an object with new lines between items', () => {
    const toCompile = `{a:1,
      b:2,
      c:3}`;
    assert.equal('{a:1,b:2,c:3}', shrink(compileCode(toCompile)));
  });

  it('should compile an object with new lines everywhere', () => {
    const toCompile = `{
      a:1,
      b:2,
      c:3
    }`;
    assert.equal('{a:1,b:2,c:3}', shrink(compileCode(toCompile)));
  });

  it('should compile an object with different kinds of items', () => {
    const toCompile = `{
      a:foo(bar),
      b:2 + 2,
      c:3,
      d:foo.bar,
      e:[4, 5, 6],
      f:{a: foo, b: bar}
    }`;
    assert.equal('{a:foo(bar),b:2+2,c:3,d:foo.bar,e:[4,5,6],f:{a:foo,b:bar}}', shrink(compileCode(toCompile)));
  });

  it('should compile an object with different kinds of keys', () => {
    const toCompile = `{
      a: 1,
      'a': 1,
      "a": 1,
      1: 1,
      ~a: 1
    }`;
    assert.equal(`{a:1,'a':1,"a":1,1:1,[Symbol.for('a')]:1}`, shrink(compileCode(toCompile)));
  });

});
