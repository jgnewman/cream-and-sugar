import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Anonymous Functions', () => {

  it('should compile an anonymous function', () => {
    const toCompile = `fn => eat food`;
    const expected = nlToSpace(`function () {
      return eat(food);
    };`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile an anonymous function with implicit binding', () => {
    const toCompile = `fn ::=> eat food`;
    const expected = nlToSpace(`function () {
      return eat(food);
    }.bind(this);`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile an anonymous function with arguments', () => {
    const toCompile = `fn x, y => eat food`;
    const expected = nlToSpace(`function () {
      const args = CNS_.args(arguments);
      const x = args[0];
      const y = args[1];
      return eat(food);
    };`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile an anonymous function with a function body', () => {
    const toCompile = 'fn x, y =>\n'
                    + '  eat food\n'
                    + '  drink drinks\n\n';
    const expected = nlToSpace(`function () {
      const args = CNS_.args(arguments);
      const x = args[0];
      const y = args[1];
      eat(food);
      return drink(drinks);
    };`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });


});
