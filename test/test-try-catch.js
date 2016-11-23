import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Try/Catch', () => {

  it('should compile a try/catch statement', () => {
    const toCompile = 'try\n'
                    + '  dostuff _\n'
                    + '  doMoreStuff _\n'
                    + 'default err\n'
                    + '  doOtherStuff _\n'
                    + '  doMoreOtherStuff _\n';
    const expected = nlToSpace(`(function () {
      try {
        dostuff();
        return doMoreStuff();
      } catch (err) {
        doOtherStuff();
        return doMoreOtherStuff();
      }
    }.bind(this)());`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a try/catch shortcut', () => {
    const toCompile = `incase something _ throws err do handle err`;
    const expected = nlToSpace(`(function () {
      try {
        return something();
      } catch (err) {
        return handle(err);
      }
    }.bind(this)());`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a try/catch shortcut with an operation', () => {
    const toCompile = `incase 2 + 2 throws err do handle err`;
    const expected = nlToSpace(`(function () {
      try {
        return 2 + 2;
      } catch (err) {
        return handle(err);
      }
    }.bind(this)());`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a try/catch shortcut without parens', () => {
    const toCompile = `incase something x throws err do handle err`;
    const expected = nlToSpace(`(function () {
      try {
        return something(x);
      } catch (err) {
        return handle(err);
      }
    }.bind(this)());`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
