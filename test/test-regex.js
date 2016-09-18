import assert from 'assert';
import { shrink } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Regex', () => {

  it('should compile a basic regular expression', () => {
    const toCompile = '/a/';
    assert.equal(toCompile, compileCode(toCompile));
  });

  it('should compile a complex regular expression', () => {
    const toCompile = '/^abc([^xyz]|0-9|a-z_\\-)$/gim';
    assert.equal(toCompile, compileCode(toCompile));
  });

});
