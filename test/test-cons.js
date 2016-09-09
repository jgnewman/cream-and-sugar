import assert from 'assert';
import { compileCode } from  '../src/compiler/compiler';

describe('Cons', () => {

  it('should compile a cons form into a function call', () => {
    const toCompile = '[hd | tl]';
    assert.equal("[hd].concat(tl)", compileCode(toCompile));
  });

  it('should compile a back cons form into a function call', () => {
    const toCompile = '[ld || lst]';
    assert.equal("ld.concat([lst])", compileCode(toCompile));
  });

});
