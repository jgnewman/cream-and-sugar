import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';

describe('Strings', () => {

  it('should compile a single quoted string', () => {
    const toCompile = "'This is a single quoted string'";
    assert.equal(compileCode(toCompile).trim(), toCompile + ';');
  });

  it('should compile a double quoted string', () => {
    const toCompile = '"This is a double quoted string"';
    assert.equal(compileCode(toCompile).trim(), toCompile + ';');
  });

  it('should compile a backtick string', () => {
    const toCompile = '`This is a backtick string`';
    assert.equal(compileCode(toCompile).trim(), toCompile + ';');
  });

  it('should include interpolations in backtick strings', () => {
    const toCompile = '`This is an interpolated string ${2 + 2}`';
    assert.equal(compileCode(toCompile).trim(), toCompile + ';');
  });

  it('should allow multiline backtick strings', () => {
    const toCompile = "`\n  hello\n`";
    assert.equal(compileCode(toCompile).trim(), toCompile + ';');
  });

});
