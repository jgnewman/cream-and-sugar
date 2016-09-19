import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Cond', () => {

  it('should compile a basic cond statement', () => {
    const toCompile = `cond
      false -> doStuff()
      true -> doOtherStuff()
    end`;
    const expected = nlToSpace(`(function () {
      if (false) {
        return doStuff()
      } else if (true) {
        return doOtherStuff()
      } else {
        return CNS_SYSTEM.noMatch('cond');
      }
    }.bind(this)())`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a basic cond statement with multi-line bodies', () => {
    const toCompile = `cond
      true ->
        doA()
        doB()
      end
      false ->
        doC()
        doD()
      end
    end`;
    const expected = nlToSpace(`(function () {
      if (true) {
        doA();
        return doB()
      } else if (false) {
        doC();
        return doD()
      } else {
        return CNS_SYSTEM.noMatch('cond');
      }
    }.bind(this)())`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
