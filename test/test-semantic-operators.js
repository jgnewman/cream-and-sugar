import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Semantic Operators', () => {

  it('should translate "and" to "&&"', () => {
    const toCompile = `a and b`;
    const expected = nlToSpace(`a && b`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should translate "or" to "||"', () => {
    const toCompile = `a or b`;
    const expected = nlToSpace(`a || b`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should translate "is" to "==="', () => {
    const toCompile = `a is b`;
    const expected = nlToSpace(`a === b`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should translate "isnt" to "!=="', () => {
    const toCompile = `a isnt b`;
    const expected = nlToSpace(`a !== b`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should translate "lt" to "<"', () => {
    const toCompile = `a lt b`;
    const expected = nlToSpace(`a < b`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should translate "gt" to ">"', () => {
    const toCompile = `a gt b`;
    const expected = nlToSpace(`a > b`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should translate "lte" to "<="', () => {
    const toCompile = `a lte b`;
    const expected = nlToSpace(`a <= b`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should translate "gte" to ">="', () => {
    const toCompile = `a gte b`;
    const expected = nlToSpace(`a >= b`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should translate "dv" to "/"', () => {
    const toCompile = `a dv b`;
    const expected = nlToSpace(`a / b`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should translate "rm" to "%"', () => {
    const toCompile = `a rm b`;
    const expected = nlToSpace(`a % b`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should translate "no" to "!"', () => {
    const toCompile1 = `no a`;
    const expected1 = nlToSpace(`!(a)`);
    const toCompile2 = `(no a)`;
    const expected2 = nlToSpace(`(!(a))`);
    assert.equal(expected1, nlToSpace(compileCode(toCompile1)));
    assert.equal(expected2, nlToSpace(compileCode(toCompile2)));
  });

  it('should compile a complex statement', () => {
    const toCompile = `no a and b or (c is (d lt e)) gte (f dv g) rm h`;
    const expected = nlToSpace(`!(a && b || (c === (d < e)) >= (f / g) % h)`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
