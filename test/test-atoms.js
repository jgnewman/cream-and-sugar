import assert from 'assert';
import { shrink } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Atoms', () => {

  it('should compile an atom into a symbol', () => {
    const toCompile = 'ATOM';
    assert.equal(compileCode(toCompile).trim(), "Symbol.for('ATOM');");
  });

  it('should compile an atom into an object key', () => {
    const toCompile = '{ATOM:foo}';
    assert.equal(shrink(compileCode(toCompile)), "{[Symbol.for('ATOM')]:foo};");
  });

});
