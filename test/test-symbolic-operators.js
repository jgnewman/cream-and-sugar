import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Symbolic Operators', () => {

  it('should compile "+"', () => {
    const toCompile = `a + b`;
    const expected = nlToSpace(`a + b;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile "-"', () => {
    const toCompile = `a - b`;
    const expected = nlToSpace(`a - b;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile "*"', () => {
    const toCompile = `a * b`;
    const expected = nlToSpace(`a * b;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile "/"', () => {
    const toCompile = `a / b`;
    const expected = nlToSpace(`a / b;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile "%"', () => {
    const toCompile = `a % b`;
    const expected = nlToSpace(`a % b;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a complex statement', () => {
    const toCompile = `a + b - (c * (d + a)) - b`;
    const expected = nlToSpace(`a + b - (c * (d + a)) - b;`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
