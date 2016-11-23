import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';

describe('Lookups', () => {

  it('should compile "@" to "this"', () => {
    const toCompile = '@';
    assert.equal(compileCode(toCompile).trim(), 'this;');
  });

  it('should compile the "@" prefix to the "this." prefix', () => {
    const toCompile = '@foo';
    assert.equal(compileCode(toCompile).trim(), 'this.foo;');
  });

  it('should compile a multi-item dot chain', () => {
    const toCompile = '@foo.bar.baz';
    assert.equal(compileCode(toCompile).trim(), 'this.foo.bar.baz;');
  });

});
