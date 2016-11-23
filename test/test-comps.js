import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Array Comprehensions', () => {

  it('should compile a basic array comprehension', () => {
    const toCompile = 'for food in foods do eat food';
    const expected = nlToSpace(`foods.map(function (food) {
      return eat(food);
    }.bind(this));`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a basic array comprehension using 2 parameters', () => {
    const toCompile = 'for food, index in foods do eat food, index';
    const expected = nlToSpace(`foods.map(function (food, index) {
      return eat(food, index);
    }.bind(this));`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile an array comprehension with a qualifier', () => {
    const toCompile = 'for food, index in foods do eat food, index onlyif index is 0';
    const expected = nlToSpace(`(function () {
      const acc_ = [];
      foods.forEach(function (food, index) {
        if (index === 0) {
          acc_.push(eat(food, index));
        }
      }.bind(this));
      return acc_;
    }.bind(this)());`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
