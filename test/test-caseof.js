import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Caseof', () => {

  it('should compile a basic caseof statement', () => {
    const toCompile = 'caseof err\n'
                    + "  'hello' -> doStuff _\n"
                    + "  default -> doOtherStuff _\n\n";
    const expected = nlToSpace(`(function () {
      switch (err) {
        case 'hello':
          return doStuff();
        default:
          return doOtherStuff();
      }
    }.bind(this)());`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a multiline caseof statement', () => {
    const toCompile = 'caseof err\n'
                    + "  'hello'\n"
                    + '    doStuff _\n'
                    + '  default\n'
                    + '    doOtherStuff _\n\n';
    const expected = nlToSpace(`(function () {
      switch (err) {
        case 'hello':
          return doStuff();
        default:
          return doOtherStuff();
      }
    }.bind(this)());`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a multiline caseof statement with optional arrows', () => {
    const toCompile = 'caseof err\n'
                    + "  'hello' ->\n"
                    + '    doStuff _\n'
                    + '  default ->\n'
                    + '    doOtherStuff _\n\n';
    const expected = nlToSpace(`(function () {
      switch (err) {
        case 'hello':
          return doStuff();
        default:
          return doOtherStuff();
      }
    }.bind(this)());`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a caseof statement without a default case', () => {
    const toCompile = "caseof err\n"
                    + "  'hello' -> doStuff _\n"
                    + "  'goodbye' -> doOtherStuff _\n\n";
    const expected = nlToSpace(`(function () {
      switch (err) {
        case 'hello':
          return doStuff();
        case 'goodbye':
          return doOtherStuff();
        default: throw new Error('No match found for "caseof" statement.');
      }
    }.bind(this)());`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
