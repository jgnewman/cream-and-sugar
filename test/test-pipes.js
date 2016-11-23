import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Scope Piping', () => {

  it('should compile a simple scope pipe', () => {
    const toCompile = 'x >>= y';
    const expected = nlToSpace(`
    (function () {
      return y((function () {
        return x
      }()))
    }());`);
    assert.equal(compileCode(toCompile).trim(), expected);
  });

  it('should assign a scope pipe to a variable', () => {
    const toCompile = 'result = x >>= y';
    const expected = nlToSpace(`
    const result = (function () {
      return y((function () {
        return x
      }()))
    }());`);
    assert.equal(compileCode(toCompile).trim(), expected);
  });

  it('should compile a more complex scope pipe', () => {
    const toCompile = '{foo: "bar"} >>= (add 2) >>= somethingElse';
    const expected = nlToSpace(`
    (function () {
      return somethingElse((function () {
        return add(2, (function () {
          return { foo: "bar" }
        }()))
      }()))
    }());`);
    assert.equal(compileCode(toCompile).trim(), expected);
  });

  it('should give scope pipes priority as arguments', () => {
    const toCompile = 'foo x, y >>= z';
    const expected = nlToSpace(`
    foo(x, (function () {
      return z((function () {
        return y
      }()))
    }()));`);
    assert.equal(compileCode(toCompile).trim(), expected);
  });

  it('should allow piping with cons statements', () => {
    const toCompile = 'x >> (y >>= z)';
    const expected = nlToSpace(`
    [x].concat(((function () {
      return z((function () {
        return y
      }()))
    }())));`);
    assert.equal(compileCode(toCompile).trim(), expected);
  });

});
