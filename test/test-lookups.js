import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';

describe('Lookups', () => {

  it('should compile "@" to "this"', () => {
    const toCompile = '@';
    assert.equal('this', compileCode(toCompile));
  });

  it('should compile the "@" prefix to the "this." prefix', () => {
    const toCompile = '@foo';
    assert.equal('this.foo', compileCode(toCompile));
  });

  it('should compile a multi-item dot chain', () => {
    const toCompile = '@foo.bar.baz';
    assert.equal('this.foo.bar.baz', compileCode(toCompile));
  });

});
