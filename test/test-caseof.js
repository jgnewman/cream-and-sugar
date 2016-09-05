import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Caseof', () => {

  it('should compile a basic caseof statement', () => {
    const toCompile = `caseof err:
      'hello' -> doStuff()
      default -> doOtherStuff()
    end`;
    const expected = nlToSpace(`(function () {
      switch (err) {
        case 'hello':
          return doStuff();
        default:
          return doOtherStuff();
      }
    }.bind(this)())`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a basic caseof statement with multi-line bodies', () => {
    const toCompile = `caseof err:
      'hello' ->
        doStuff()
      end
      default ->
        doOtherStuff()
      end
    end`;
    const expected = nlToSpace(`(function () {
      switch (err) {
        case 'hello':
          return doStuff();
        default:
          return doOtherStuff();
      }
    }.bind(this)())`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a caseof statement without a default case', () => {
    const toCompile = `caseof err:
      'hello' -> doStuff()
      'goodbye' -> doOtherStuff()
    end`;
    const expected = nlToSpace(`(function () {
      switch (err) {
        case 'hello':
          return doStuff();
        case 'goodbye':
          return doOtherStuff();
        default:
          SYSTEM.noMatch('caseof');
      }
    }.bind(this)())`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
