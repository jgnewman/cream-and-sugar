import assert from 'assert';
import { nlToSpace, shrink } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Function Calls', () => {

  it('should compile a single argument call', () => {
    const toCompile = 'foo bar';
    assert.equal(compileCode(toCompile).trim(), 'foo(bar);');
  });

  it('should treat the single argument "_" as 0 arity', () => {
    const toCompile = 'foo _';
    assert.equal(compileCode(toCompile).trim(), 'foo();');
  });

  it('should compile a multi argument call', () => {
    const toCompile = 'foo bar, baz, quux';
    assert.equal(compileCode(toCompile).trim(), 'foo(bar, baz, quux);');
  });

  it('should compile a call within a call', () => {
    const toCompile = 'foo bar baz';
    assert.equal(compileCode(toCompile).trim(), 'foo(bar(baz));');
  });

  it('should allow dot chains to prefix a call', () => {
    const toCompile = '@foo.bar baz';
    assert.equal(compileCode(toCompile).trim(), 'this.foo.bar(baz);');
  });

  it('should compile with various types of arguments', () => {
    const toCompile = 'foo bar, 0, [a, b, c], fn => eat food';
    assert.equal(nlToSpace(compileCode(toCompile)), nlToSpace(`foo(bar, 0, [a, b, c], function () {
      return eat(food);
    });`));
  });

  it('should compile a call where the initiator is a wrap', () => {
    const toCompile = '(foo bar) baz';
    assert.equal(compileCode(toCompile).trim(), 'foo(bar)(baz);');
  });

  it('should allow an expression using indentation as an argument without parens', () => {
    const toCompile = 'setInterval fn =>\n'
                    + '  doSomething _\n'
                    + ', 1000';
    assert.equal(nlToSpace(compileCode(toCompile)), nlToSpace(`setInterval(function () {
      return doSomething();
    }, 1000);`));
  });

});
