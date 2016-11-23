import assert from 'assert';
import { shrink } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Objects', () => {

  it('should compile an empty object', () => {
    const toCompile = '{}';
    assert.equal(shrink(compileCode(toCompile)), toCompile + ';');
  });

  it('should compile a single item object', () => {
    const toCompile = '{a:1}';
    assert.equal(shrink(compileCode(toCompile)), toCompile + ';');
  });

  it('should compile a multi item object', () => {
    const toCompile = '{a:1,b:2,c:3}';
    assert.equal(shrink(compileCode(toCompile)), toCompile + ';');
  });

  it('should compile an object beginning with new lines', () => {
    const toCompile = `{\n\n\na:1,b:2,c:3}`;
    assert.equal(shrink(compileCode(toCompile)), '{a:1,b:2,c:3};');
  });

  it('should compile an object ending with new lines', () => {
    const toCompile = `{a:1,b:2,c:3\n\n\n\n}`;
    assert.equal(shrink(compileCode(toCompile)), '{a:1,b:2,c:3};');
  });

  it('should compile an object beginning and ending with new lines', () => {
    const toCompile = `{\n\n\n  a:1,b:2,c:3\n\n\n}`;
    assert.equal(shrink(compileCode(toCompile)), '{a:1,b:2,c:3};');
  });

  it('should compile an object with new lines between items', () => {
    const toCompile = "{a:1,\n\nb:2,\n\nc:3}";
    assert.equal(shrink(compileCode(toCompile)), '{a:1,b:2,c:3};');
  });

  it('should compile an object with new lines everywhere', () => {
    const toCompile = `{\na:1,\nb:2,\nc:3\n}`;
    assert.equal(shrink(compileCode(toCompile)), '{a:1,b:2,c:3};');
  });

  it('should compile an object with different kinds of items', () => {
    const toCompile = `{\na:(foo bar),\nb:2 + 2,\nc:3,\nd:foo.bar,\ne:[4, 5, 6],\nf:{a: foo, b: bar}\n}`;
    assert.equal(shrink(compileCode(toCompile)), '{a:foo(bar),b:2+2,c:3,d:foo.bar,e:[4,5,6],f:{a:foo,b:bar}};');
  });

  it('should compile an object with different kinds of keys', () => {
    const toCompile = `{\na: 1,\n'a': 1,\n"a": 1,\n1: 1,\nAA: 1\n}`;
    assert.equal(shrink(compileCode(toCompile)), `{a:1,'a':1,"a":1,1:1,[Symbol.for('AA')]:1};`);
  });

});
