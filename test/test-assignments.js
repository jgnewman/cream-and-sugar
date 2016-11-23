import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';
import { nlToSpace } from './utils';


describe('Assignments', () => {

  it('should compile a basic assignment', () => {
    const toCompile = 'x = 4';
    assert.equal(compileCode(toCompile).trim(), `const ${toCompile};`,);
  });

  it('should compile a cons destructure', () => {
    const toCompile = '[h|t] = [1, 2, 3]';
    const expected = nlToSpace(`
      var ref0_ = [1, 2, 3];
      const h = ref0_[0];
      const t = ref0_.slice(1);
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a back cons destructure', () => {
    const toCompile = '[ld||lst] = [1, 2, 3]';
    const expected = nlToSpace(`
      var ref0_ = [1, 2, 3];
      const ld = ref0_.slice(0, ref0_.length - 1);
      const lst = ref0_[ref0_.length - 1];
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a single item tuple destructure', () => {
    const toCompile = '{a} = foo';
    const expected = nlToSpace(`
      var ref0_ = foo;
      const a = ref0_.a;
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a multi item tuple destructure', () => {
    const toCompile = '{a, b, c} = foo';
    const expected = nlToSpace(`
      var ref0_ = foo;
      const a = ref0_.a;
      const b = ref0_.b;
      const c = ref0_.c;
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a tuple destructure beginning with new lines', () => {
    const toCompile = '{\n\n\na, b, c} = foo';
    const expected = nlToSpace(`
      var ref0_ = foo;
      const a = ref0_.a;
      const b = ref0_.b;
      const c = ref0_.c;
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a tuple destructure ending with new lines', () => {
    const toCompile = `{a, b, c\n\n} = foo`;
    const expected = nlToSpace(`
      var ref0_ = foo;
      const a = ref0_.a;
      const b = ref0_.b;
      const c = ref0_.c;
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a tuple destructure beginning and ending with new lines', () => {
    const toCompile = `{\n\na, b, c\n\n} = foo`;
    const expected = nlToSpace(`
      var ref0_ = foo;
      const a = ref0_.a;
      const b = ref0_.b;
      const c = ref0_.c;
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a tuple destructure with new lines between items', () => {
    const toCompile = `{a,\nb,\nc} = foo`;
    const expected = nlToSpace(`
      var ref0_ = foo;
      const a = ref0_.a;
      const b = ref0_.b;
      const c = ref0_.c;
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a tuple destructure with new lines everywhere', () => {
    const toCompile = `{\n  a,\n  b,\n  c\n} = foo`;
    const expected = nlToSpace(`
      var ref0_ = foo;
      const a = ref0_.a;
      const b = ref0_.b;
      const c = ref0_.c;
    `);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
