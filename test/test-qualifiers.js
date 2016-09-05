import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Qualifiers', () => {

  it('should compile a basic qualifier based on a function call', () => {
    const toCompile = `eat food if food`;
    const expected = nlToSpace(`SYSTEM.qualify(food, function () {
      return eat(food);
    }.bind(this))`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a basic qualifier based on an operation', () => {
    const toCompile = `2 + 2 if food`;
    const expected = nlToSpace(`SYSTEM.qualify(food, function () {
      return 2 + 2;
    }.bind(this))`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a basic negative qualifier', () => {
    const toCompile = `eat food unless food`;
    const expected = nlToSpace(`SYSTEM.qualify(!(food), function () {
      return eat(food);
    }.bind(this))`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a qualifier with an else case', () => {
    const toCompile = `eat food if food else drink drinks`;
    const expected = nlToSpace(`SYSTEM.qualify(food, function () {
      return eat(food);
    }.bind(this), function () {
      return drink(drinks);
    }.bind(this))`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
