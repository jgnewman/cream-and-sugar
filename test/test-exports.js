import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';


describe('Exports', () => {

  it('should export a single item', () => {
    const toCompile = 'export aritize a, 1';
    const expected = "typeof module === 'undefined'\n"
                   +  "  ? typeof console !== 'undefined' &&\n"
                   +  "    console.warn('Warning: You are attempting to export module values in a non-modular environment.')\n"
                   +  `  : module.exports = CNS_.aritize(a, 1);`;
    assert.equal(nlToSpace(compileCode(toCompile)), nlToSpace(expected));
  });

  it('should export multiple items', () => {
    const toCompile = 'export {a:a, b:b, c:c}';
    const expected = "typeof module === 'undefined'\n"
                   +  "  ? typeof console !== 'undefined' &&\n"
                   +  "    console.warn('Warning: You are attempting to export module values in a non-modular environment.')\n"
                   +  `  : module.exports = { a: a, b: b, c: c };`;
    assert.equal(nlToSpace(compileCode(toCompile)), nlToSpace(expected));
  });

});
