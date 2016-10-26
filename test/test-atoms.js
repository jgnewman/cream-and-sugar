import assert from 'assert';
import { shrink } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Atoms', () => {

  it('should compile an atom into a symbol', () => {
    const toCompile = 'ATOM';
    assert.equal("Symbol.for('ATOM')", compileCode(toCompile));
  });

  it('should compile an atom into an object key', () => {
    const toCompile = '{ATOM:foo}';
    assert.equal("{[Symbol.for('ATOM')]:foo}", shrink(compileCode(toCompile)));
  });

});
