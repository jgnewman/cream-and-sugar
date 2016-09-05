import assert from 'assert';
import { shrink } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Atoms', () => {

  it('should compile an atom into a symbol', () => {
    const toCompile = '~atom';
    assert.equal("Symbol.for('atom')", compileCode(toCompile));
  });

  it('should compile an atom into an object key', () => {
    const toCompile = '{~atom:foo}';
    assert.equal("{[Symbol.for('atom')]:foo}", shrink(compileCode(toCompile)));
  });

});
