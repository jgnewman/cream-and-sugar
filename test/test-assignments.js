import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';


describe('Assignments', () => {

  it('should compile a basic assignment', () => {
    const toCompile = 'x = 4';
    assert.equal(`const ${toCompile}`, compileCode(toCompile));
  });

  it('should compile a cons destructure', () => {
    const toCompile = '[h|t] = [1, 2, 3]';
    assert.equal('const {h, t} = SYSTEM.assnCons([1, 2, 3], "h", "t")', compileCode(toCompile));
  });

  it('should compile a single item tuple destructure', () => {
    const toCompile = '{a} = foo';
    assert.equal(`const ${toCompile}`, compileCode(toCompile));
  });

  it('should compile a multi item tuple destructure', () => {
    const toCompile = '{a, b, c} = foo';
    assert.equal(`const ${toCompile}`, compileCode(toCompile));
  });

  it('should compile an tuple destructure beginning with new lines', () => {
    const toCompile = `{

      a, b, c} = foo`;
    assert.equal(`const {a, b, c} = foo`, compileCode(toCompile));
  });

  it('should compile an tuple destructure ending with new lines', () => {
    const toCompile = `{a, b, c

    } = foo`;
    assert.equal(`const {a, b, c} = foo`, compileCode(toCompile));
  });

  it('should compile an tuple destructure beginning and ending with new lines', () => {
    const toCompile = `{

      a, b, c

    } = foo`;
    assert.equal(`const {a, b, c} = foo`, compileCode(toCompile));
  });

  it('should compile a tuple destructure with new lines between items', () => {
    const toCompile = `{a,
      b,
      c} = foo`;
    assert.equal(`const {a, b, c} = foo`, compileCode(toCompile));
  });

  it('should compile a tuple destructure with new lines everywhere', () => {
    const toCompile = `{
      a,
      b,
      c
    } = foo`;
    assert.equal(`const {a, b, c} = foo`, compileCode(toCompile));
  });

});
