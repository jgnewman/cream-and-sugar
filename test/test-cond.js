import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('When', () => {

  it('should compile a basic when statement', () => {
    const toCompile = 'when\n'
                    + '  false -> doStuff _\n'
                    + '  true -> doOtherStuff _\n\n';
    const expected = nlToSpace(`(function () {
      if (false) {
        return doStuff()
      } else if (true) {
        return doOtherStuff()
      } else {
        throw new Error('No match found for "when" statement.');
      }
    }.bind(this)());`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a multi-line statement', () => {
    const toCompile = 'when\n'
                    + '  true\n'
                    + '    doA _\n'
                    + '    doB _\n'
                    + '  false\n'
                    + '    doC _\n'
                    + '    doD _\n\n';
    const expected = nlToSpace(`(function () {
      if (true) {
        doA();
        return doB()
      } else if (false) {
        doC();
        return doD()
      } else {
        throw new Error('No match found for "when" statement.');
      }
    }.bind(this)());`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a multiline statement with optional arrows', () => {
    const toCompile = 'when\n'
                    + '  true ->\n'
                    + '    doA _\n'
                    + '    doB _\n'
                    + '  false ->\n'
                    + '    doC _\n'
                    + '    doD _\n\n';
    const expected = nlToSpace(`(function () {
      if (true) {
        doA();
        return doB()
      } else if (false) {
        doC();
        return doD()
      } else {
        throw new Error('No match found for "when" statement.');
      }
    }.bind(this)());`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
