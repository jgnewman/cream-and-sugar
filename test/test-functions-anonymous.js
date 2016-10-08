import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Anonymous Functions', () => {

  it('should compile an anonymous function', () => {
    const toCompile = `fn -> eat(food)`;
    const expected = nlToSpace(`function () {
      return eat(food);
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile an anonymous function with implicit binding', () => {
    const toCompile = `fn => eat(food)`;
    const expected = nlToSpace(`function () {
      return eat(food);
    }.bind(this)`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile an anonymous function with arguments', () => {
    const toCompile = `fn(x, y) -> eat(food)`;
    const expected = nlToSpace(`function () {
      const args = CNS_SYSTEM.args(arguments);
      const x = args[0];
      const y = args[1];
      return eat(food);
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile an anonymous function with arguments and no parens', () => {
    const toCompile = `fn x, y -> eat(food)`;
    const expected = nlToSpace(`function () {
      const args = CNS_SYSTEM.args(arguments);
      const x = args[0];
      const y = args[1];
      return eat(food);
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile an anonymous function with an extraneous "end"', () => {
    const toCompile = `fn x, y -> eat(food) end`;
    const expected = nlToSpace(`function () {
      const args = CNS_SYSTEM.args(arguments);
      const x = args[0];
      const y = args[1];
      return eat(food);
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile an anonymous function with a function body', () => {
    const toCompile = `fn x, y ->
      eat(food)
      drink(drinks)
    end`;
    const expected = nlToSpace(`function () {
      const args = CNS_SYSTEM.args(arguments);
      const x = args[0];
      const y = args[1];
      eat(food);
      return drink(drinks);
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });


});
