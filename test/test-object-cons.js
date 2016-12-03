import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';

describe('Object Cons', () => {

  it('should compile a basic object cons', () => {
    const toCompile = 'a <- b';
    assert.equal(compileCode(toCompile).trim(), "CNS_.assign(a, b);");
  });

  it('should compile a more verbose object cons', () => {
    const toCompile = '{foo: bar} <- {baz: quux}';
    assert.equal(compileCode(toCompile).trim(), "CNS_.assign({ foo: bar }, { baz: quux });");
  });

  it('should correctly compile an object cons in a function call', () => {
    const toCompile = 'foo bar <- baz';
    assert.equal(compileCode(toCompile).trim(), "foo(CNS_.assign(bar, baz));");
  });

});
