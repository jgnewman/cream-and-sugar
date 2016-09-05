import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Exports', () => {

  it('should export a single item', () => {
    const toCompile = 'export {a/1}';
    const expected = nlToSpace(`SYSTEM.exp("a", SYSTEM.aritize(a, 1))`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should export multiple items', () => {
    const toCompile = 'export {a/1, b/2, c/3}';
    const expected = nlToSpace(`SYSTEM.exp("a", SYSTEM.aritize(a, 1));
    SYSTEM.exp("b", SYSTEM.aritize(b, 2));
    SYSTEM.exp("c", SYSTEM.aritize(c, 3))`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should export multiple items when the tuple has new lines everywhere', () => {
    const toCompile = `export {
      a/1,
      b/2,
      c/3
    }`;
    const expected = nlToSpace(`SYSTEM.exp("a", SYSTEM.aritize(a, 1));
    SYSTEM.exp("b", SYSTEM.aritize(b, 2));
    SYSTEM.exp("c", SYSTEM.aritize(c, 3))`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
