import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';


describe('Numbers', () => {

  it('should compile a positive integer', () => {
    const toCompile = '1';
    assert.equal(compileCode(toCompile).trim(), toCompile + ';');
  });

  it('should compile a negative integer', () => {
    const toCompile = '-1';
    assert.equal(compileCode(toCompile).trim(), toCompile + ';');
  });

  it('should compile a positive float', () => {
    const toCompile = '32.3456';
    assert.equal(compileCode(toCompile).trim(), toCompile + ';');
  });

  it('should compile a negative float', () => {
    const toCompile = '-32.3456';
    assert.equal(compileCode(toCompile).trim(), toCompile + ';');
  });

  it('should compile an positive exponent', () => {
    const toCompile = '123e5';
    assert.equal(compileCode(toCompile).trim(), toCompile + ';');
  });

  it('should compile an negative exponent', () => {
    const toCompile = '123e-5';
    assert.equal(compileCode(toCompile).trim(), toCompile + ';');
  });

  it('should compile a negative number with a negative exponent', () => {
    const toCompile = '-123e-5';
    assert.equal(compileCode(toCompile).trim(), toCompile + ';');
  });

  it('should compile a hexidecimal', () => {
    const toCompile = '0xFF';
    assert.equal(compileCode(toCompile).trim(), toCompile + ';');
  });

  it('should compile Infinity', () => {
    const toCompile = 'Infinity';
    assert.equal(compileCode(toCompile).trim(), toCompile + ';');
  });

  it('should compile NaN', () => {
    const toCompile = 'NaN';
    assert.equal(compileCode(toCompile).trim(), toCompile + ';');
  });

});
