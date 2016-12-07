import assert from 'assert';
import { nlToSpace } from './utils';
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

  it('should use ? to test if a value is available', () => {
    const toCompile = 'foo?';
    const expected = `
    (function () {
      var ref0_;
      if (typeof foo === 'undefined') { return false }
      return (ref0_ = foo) == null ? false : true;
    }());
    `.trim();
    assert.equal(compileCode(toCompile).trim(), nlToSpace(expected));
  });

  it('should use ? multiple times in a chain', () => {
    const toCompile = 'foo?.bar?.baz';
    const expected = `
    (function () {
      var ref0_;
      if (typeof foo === 'undefined') { return void 0 }
      return (ref0_ = foo) == null ? ref0_ : (function () {
        var ref1_;
        return (ref1_ = ref0_.bar) == null ? ref1_ : ref1_.baz;
      }())
    }());
    `.trim();
    assert.equal(compileCode(toCompile).trim(), nlToSpace(expected));
  });

  it('should use ? with chained function calls', () => {
    const toCompile = '((foo _)?.bar _)?.baz';
    const expected = `
    (function () {
      var ref0_;
      return (ref0_ = ((function () {
        var ref1_;
        return (ref1_ = foo()) == null ? ref1_ : ref1_.bar();
      }()))) == null ? ref0_ : ref0_.baz;
    }());
    `.trim();
    assert.equal(compileCode(toCompile).trim(), nlToSpace(expected));
  });

});
