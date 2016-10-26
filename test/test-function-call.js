import assert from 'assert';
import { nlToSpace, shrink } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Function Calls', () => {

  it('should compile a single argument call', () => {
    const toCompile = 'foo bar';
    assert.equal('foo(bar)', compileCode(toCompile));
  });

  it('should treat the single argument "_" as 0 arity', () => {
    const toCompile = 'foo _';
    assert.equal('foo()', compileCode(toCompile));
  });

  it('should compile a multi argument call', () => {
    const toCompile = 'foo bar, baz, quux';
    assert.equal('foo(bar, baz, quux)', compileCode(toCompile));
  });

  it('should compile a call within a call', () => {
    const toCompile = 'foo bar baz';
    assert.equal('foo(bar(baz))', compileCode(toCompile));
  });

  it('should allow dot chains to prefix a call', () => {
    const toCompile = '@foo.bar baz';
    assert.equal('this.foo.bar(baz)', compileCode(toCompile));
  });

  it('should compile with various types of arguments', () => {
    const toCompile = 'foo bar, 0, [a, b, c], fn => eat food';
    assert.equal(nlToSpace(`foo(bar, 0, [a, b, c], function () {
      return eat(food);
    })`), nlToSpace(compileCode(toCompile)));
  });

});
