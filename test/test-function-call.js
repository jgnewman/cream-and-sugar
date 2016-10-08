import assert from 'assert';
import { nlToSpace, shrink } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Function Calls', () => {

  it('should compile a single argument call with parentheses', () => {
    const toCompile = 'foo(bar)';
    assert.equal(toCompile, compileCode(toCompile));
  });

  it('should compile a multi argument call with parentheses', () => {
    const toCompile = 'foo(bar, baz, quux)';
    assert.equal(toCompile, compileCode(toCompile));
  });

  it('should compile a multi argument call with parentheses on new lines', () => {
    const toCompile = `ReactDOM.render(
      React.createElement('h1', {}, ['Hello, world!']),
      document.getElementById('app')
    )`;
    assert.equal(shrink(toCompile), shrink(compileCode(toCompile)));
  });

  it('should compile a single argument call WITHOUT parentheses', () => {
    const toCompile = 'foo bar';
    assert.equal('foo(bar)', compileCode(toCompile));
  });

  it('should treat the single argument "_" as 0 arity', () => {
    const toCompile = 'foo _';
    assert.equal('foo()', compileCode(toCompile));
  });

  it('should compile a multi argument call WITHOUT parentheses', () => {
    const toCompile = 'foo bar, baz, quux';
    assert.equal('foo(bar, baz, quux)', compileCode(toCompile));
  });

  it('should compile a call within a call', () => {
    const toCompile1 = 'foo(bar(baz))';
    const toCompile2 = 'foo bar baz';
    assert.equal(toCompile1, compileCode(toCompile1));
    assert.equal('foo(bar(baz))', compileCode(toCompile2));
  });

  it('should allow dot chains to prefix a call', () => {
    const toCompile = '@foo.bar(baz)';
    assert.equal('this.foo.bar(baz)', compileCode(toCompile));
  });

  it('should compile with various types of arguments', () => {
    const toCompile = 'foo bar, 0, [a, b, c], fn -> eat(food)';
    assert.equal(nlToSpace(`foo(bar, 0, [a, b, c], function () {
      return eat(food);
    })`), nlToSpace(compileCode(toCompile)));
  });

});
