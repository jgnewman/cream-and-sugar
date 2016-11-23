import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Qualifiers', () => {

  it('should compile a basic qualifier based on a function call', () => {
    const toCompile = `if food do eat food`;
    const expected = nlToSpace(`CNS_.qualify(food, function () {
      return eat(food);
    }.bind(this));`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a basic qualifier based on an operation', () => {
    const toCompile = `if food do 2 + 2`;
    const expected = nlToSpace(`CNS_.qualify(food, function () {
      return 2 + 2;
    }.bind(this));`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a qualifier with an else case', () => {
    const toCompile = `if food do eat food else drink drinks`;
    const expected = nlToSpace(`CNS_.qualify(food, function () {
      return eat(food);
    }.bind(this), function () {
      return drink(drinks);
    }.bind(this));`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
