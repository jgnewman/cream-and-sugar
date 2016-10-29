import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Exports', () => {

  it('should export a single item', () => {
    const toCompile = 'export aritize a, 1';
    const expected = nlToSpace(`CNS_.exp(CNS_.aritize(a, 1))`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should export multiple items', () => {
    const toCompile = 'export {a:a, b:b, c:c}';
    const expected = nlToSpace(`CNS_.exp({ a: a, b: b, c: c })`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
