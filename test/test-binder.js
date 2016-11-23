import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';

describe('Binder', () => {

  it('should compile a bound value', () => {
    const toCompile = ':: foo';
    assert.equal(compileCode(toCompile).trim(), "CNS_.lazify(foo, this);");
  });

  it('should compile a bound function call', () => {
    const toCompile = ':: foo bar';
    assert.equal(compileCode(toCompile).trim(), "CNS_.lazify(foo(bar), this);");
  });

});
