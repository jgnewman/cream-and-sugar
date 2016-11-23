import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';

describe('Protects', () => {

  it('should allow reserved words to pass through the compiler', () => {
    const toCompile = '~when.foo.bar';
    assert.equal(compileCode(toCompile).trim(), "when.foo.bar;");
  });

  it('should allow bifs to pass through the compiler', () => {
    const toCompile = '~lang.foo.bar';
    assert.equal(compileCode(toCompile).trim(), "lang.foo.bar;");
  });

});
