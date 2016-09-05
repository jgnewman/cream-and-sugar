import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Array Comprehensions', () => {

  it('should compile a basic array comprehension', () => {
    const toCompile = 'eat food for food in foods';
    const expected = nlToSpace(`foods.map(function (food) {
      return eat(food);
    }.bind(this))`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a basic array comprehension using 2 parameters', () => {
    const toCompile = 'eat food, index for food, index in foods';
    const expected = nlToSpace(`foods.map(function (food, index) {
      return eat(food, index);
    }.bind(this))`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile an array comprehension with a qualifier', () => {
    const toCompile = 'eat food, index for food, index in foods when index is 0';
    const expected = nlToSpace(`(function () {
      const __acc__ = [];
      foods.forEach(function (food, index) {
        if (index === 0) {
          __acc__.push(eat(food, index));
        }
      }.bind(this));
      return __acc__;
    }.bind(this)())`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
