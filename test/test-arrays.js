import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';


describe('Arrays', () => {

  it('should compile an empty array', () => {
    const toCompile = '[]';
    assert.equal(toCompile, compileCode(toCompile));
  });

  it('should compile a single item array', () => {
    const toCompile = '[1]';
    assert.equal(toCompile, compileCode(toCompile));
  });

  it('should compile a multi item array', () => {
    const toCompile = '[1, 2, 3]';
    assert.equal(toCompile, compileCode(toCompile));
  });

  it('should compile an array beginning with new lines', () => {
    const toCompile = `[\n\n\n1, 2, 3]`;
    assert.equal('[1, 2, 3]', compileCode(toCompile));
  });

  it('should compile an array ending with new lines', () => {
    const toCompile = `[1, 2, 3\n\n\n]`;
    assert.equal('[1, 2, 3]', compileCode(toCompile));
  });

  it('should compile an array beginning and ending with new lines', () => {
    const toCompile = `[\n\n\n1, 2, 3\n\n\n]`;
    assert.equal('[1, 2, 3]', compileCode(toCompile));
  });

  it('should compile an array with new lines between items', () => {
    const toCompile = `[1,\n2,\n3]`;
    assert.equal('[1, 2, 3]', compileCode(toCompile));
  });

  it('should compile an array with new lines everywhere', () => {
    const toCompile = `[\n1,\n2,\n3\n]`;
    assert.equal('[1, 2, 3]', compileCode(toCompile));
  });

  it('should compile an array with different kinds of items', () => {
    const toCompile = '[\n'
                    + '  (foo bar),\n'
                    + '  2 + 2,\n'
                    + '  3,\n'
                    + '  foo.bar,\n'
                    + '  [4, 5, 6],\n'
                    + '  {a: foo, b: bar}\n'
                    + ']';
    assert.equal('[foo(bar), 2 + 2, 3, foo.bar, [4, 5, 6], { a: foo, b: bar }]', compileCode(toCompile));
  });

});
