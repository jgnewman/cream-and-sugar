import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Exports', () => {

  it('should export a single item', () => {
    const toCompile = 'export {a/1}';
    const expected = nlToSpace(`CNS_SYSTEM.exp("a", CNS_SYSTEM.aritize(a, 1))`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should export multiple items', () => {
    const toCompile = 'export {a/1, b/2, c/3}';
    const expected = nlToSpace(`CNS_SYSTEM.exp("a", CNS_SYSTEM.aritize(a, 1));
    CNS_SYSTEM.exp("b", CNS_SYSTEM.aritize(b, 2));
    CNS_SYSTEM.exp("c", CNS_SYSTEM.aritize(c, 3))`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should export multiple items when the tuple has new lines everywhere', () => {
    const toCompile = `export {
      a/1,
      b/2,
      c/3
    }`;
    const expected = nlToSpace(`CNS_SYSTEM.exp("a", CNS_SYSTEM.aritize(a, 1));
    CNS_SYSTEM.exp("b", CNS_SYSTEM.aritize(b, 2));
    CNS_SYSTEM.exp("c", CNS_SYSTEM.aritize(c, 3))`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
