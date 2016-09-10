import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Try/Catch', () => {

  it('should compile a try/catch statement', () => {
    const toCompile = `try dostuff() catch err: doOtherStuff() end`;
    const expected = nlToSpace(`(function () {
      try {
        return dostuff();
      } catch (err) {
        return doOtherStuff();
      }
    }.bind(this)())`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a try/catch statement with complex function bodies', () => {
    const toCompile = `try
      dostuff()
      doMoreStuff()
    catch err:
      doOtherStuff()
      doMoreOtherStuff()
    end`;
    const expected = nlToSpace(`(function () {
      try {
        dostuff();
        return doMoreStuff();
      } catch (err) {
        doOtherStuff();
        return doMoreOtherStuff();
      }
    }.bind(this)())`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
