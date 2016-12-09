import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Semantic Operators', () => {

  it('should translate "and" to "&&"', () => {
    const toCompile = `a and b`;
    const expected = nlToSpace(`a && b;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should translate "or" to "||"', () => {
    const toCompile = `a or b`;
    const expected = nlToSpace(`a || b;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should translate "is" to "==="', () => {
    const toCompile = `a is b`;
    const expected = nlToSpace(`a === b;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should translate "isnt" to "!=="', () => {
    const toCompile = `a isnt b`;
    const expected = nlToSpace(`a !== b;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should translate "lt" to "<"', () => {
    const toCompile = `a lt b`;
    const expected = nlToSpace(`a < b;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should translate "gt" to ">"', () => {
    const toCompile = `a gt b`;
    const expected = nlToSpace(`a > b;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should translate "lte" to "<="', () => {
    const toCompile = `a lte b`;
    const expected = nlToSpace(`a <= b;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should translate "gte" to ">="', () => {
    const toCompile = `a gte b`;
    const expected = nlToSpace(`a >= b;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should translate "no" to "!"', () => {
    const toCompile = `no 4`;
    const expected = nlToSpace(`!4;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should translate "not" to "!"', () => {
    const toCompile = `not 4`;
    const expected = nlToSpace(`!4;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should apply opposites correctly', () => {
    const toCompile = `! a and b`;
    const expected = nlToSpace(`!a && b;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a complex statement', () => {
    const toCompile = `! a and b or (c is (d lt e)) gte (f / g) % h`;
    const expected = nlToSpace(`!a && b || (c === (d < e)) >= (f / g) % h;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
