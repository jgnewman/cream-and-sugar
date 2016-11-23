import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';

describe('Cons', () => {

  it('should compile a cons form into a function call', () => {
    const toCompile = 'hd >> tl';
    assert.equal(compileCode(toCompile).trim(), "[hd].concat(tl);");
  });

  it('should compile a back cons form into a function call', () => {
    const toCompile = 'ld << lst';
    assert.equal(compileCode(toCompile).trim(), "ld.concat([lst]);");
  });

});
