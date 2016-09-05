import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Try/Catch', () => {

  it('should compile a try/catch statement', () => {
    const toCompile = `try fn -> dostuff()
    catch fn err -> doOtherStuff()`;
    const expected = nlToSpace(`(function () {
      try {
        return (function () {
          const args = SYSTEM.args(arguments);
          return dostuff();
        }());
      } catch (__err__) {
        return (function () {
          const args = SYSTEM.args(arguments);
          const err = args[0];
          return doOtherStuff();
        }(__err__));
      }
    }.bind(this)())`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a try/catch statement with complex function bodies', () => {
    const toCompile = `try fn ->
      dostuff()
      doMoreStuff()
    end
    catch fn err ->
      doOtherStuff()
      doMoreOtherStuff()
    end`;
    const expected = nlToSpace(`(function () {
      try {
        return (function () {
          const args = SYSTEM.args(arguments);
          dostuff();
          return doMoreStuff();
        }());
      } catch (__err__) {
        return (function () {
          const args = SYSTEM.args(arguments);
          const err = args[0];
          doOtherStuff();
          return doMoreOtherStuff();
        }(__err__));
      }
    }.bind(this)())`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
