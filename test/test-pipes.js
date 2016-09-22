import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Scope Piping', () => {

  it('should compile a simple scope pipe', () => {
    const toCompile = 'x :: y';
    const expected = `CNS_SYSTEM.pipe(x).to(y)()`
    assert.equal(expected, compileCode(toCompile));
  });

  it('should assign a scope pipe to a variable', () => {
    const toCompile = 'result = x :: y';
    const expected = `const result = CNS_SYSTEM.pipe(x).to(y)()`
    assert.equal(expected, compileCode(toCompile));
  });

  it('should compile a more complex scope pipe', () => {
    const toCompile = '{foo: "bar"} :: add(2) :: somethingElse';
    const expected = `CNS_SYSTEM.pipe({ foo: "bar" }).to(add, 2).to(somethingElse)()`
    assert.equal(expected, compileCode(toCompile));
  });

  it('should give scope pipes priority as arguments', () => {
    const toCompile = 'foo x, y :: z';
    const expected = `foo(x, CNS_SYSTEM.pipe(y).to(z)())`
    assert.equal(expected, compileCode(toCompile));
  });

  it('should compile a scope pipe within a scope pipe', () => {
    const toCompile = 'a :: (b :: c :: d) :: e';
    const expected = `CNS_SYSTEM.pipe(a).to((CNS_SYSTEM.pipe(b).to(c).to(d)())).to(e)()`
    assert.equal(expected, compileCode(toCompile));
  });

  it('should allow piping with variable assignments', () => {
    const toCompile = 'x = y :: z';
    const expected = nlToSpace(`
      const x = CNS_SYSTEM.pipe(y).to(z)()
    `);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should allow piping with module imports', () => {
    const toCompile = 'import x from y :: z';
    const expected = nlToSpace(`
      const __ref0__ = require(y);
      const x = CNS_SYSTEM.pipe(__ref0__).to(z)()
    `);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should allow piping with cons statements', () => {
    const toCompile = '[x | y :: z]';
    const expected = nlToSpace(`[x].concat(CNS_SYSTEM.pipe(y).to(z)())`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
