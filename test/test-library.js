import assert from 'assert';
import CNS_SYSTEM from '../src/compiler/SYSTEM';
import { compileCode } from  '../src/compiler/compiler';


describe('SYSTEM Library', () => {

  it('should handle conditions', () => {
    assert.equal(CNS_SYSTEM.qualify(true, function(){return 1}), 1);
    assert.equal(CNS_SYSTEM.qualify(false, function(){return 1}), undefined);
    assert.equal(CNS_SYSTEM.qualify(true, function(){return 1}, function(){return 2}), 1);
    assert.equal(CNS_SYSTEM.qualify(false, function(){return 1}, function(){return 2}), 2);
  });

  it('should handle equality testing', () => {
    assert.equal(CNS_SYSTEM.eql('0', 0), false);
    assert.equal(CNS_SYSTEM.eql(NaN, NaN), true);
    assert.equal(CNS_SYSTEM.eql(0, function () {}), false);
    assert.equal(CNS_SYSTEM.eql({a: [1, 2, {e: 'f'}], b: {c: 'd'}}, {a: [1, 2, {e: 'f'}], b: {c: 'd'}}), true);
  });

  it('should match against patterns', () => {
    assert.equal(CNS_SYSTEM.match([1],      [['Identifier', 'x']]), true);
    assert.equal(CNS_SYSTEM.match([1, 2],   [['Identifier', 'x']]), false);
    assert.equal(CNS_SYSTEM.match([1, 2],   [['Number', '1'], ['Number', '2']]), true);
    assert.equal(CNS_SYSTEM.match([[1, 2]], [['Arr', '[1, 2]']]), true);
    assert.equal(CNS_SYSTEM.match([[1, 2]], [['Arr', '[1, x]']]), true);
    assert.equal(CNS_SYSTEM.match([[1, 2]], [['Arr', '[1]']]), false);
    assert.equal(CNS_SYSTEM.match([[1, 2]], [['Cons', '[hd|tl]']]), true);
    assert.equal(CNS_SYSTEM.match([1, 2],   [['Cons', '[hd|tl]']]), false);
  });

  it('should convert arguments to arrays', () => {
    const args = (function (x, y) { return arguments }(1, 2));
    assert.deepEqual(CNS_SYSTEM.args(args), [1, 2]);
    assert.equal(Array.isArray(CNS_SYSTEM.args(args)), true);
  });

  it('should retrieve elements from collections', () => {
    assert.equal(CNS_SYSTEM.elem(2, ['a', 'b', 'c']), 'c');
    assert.equal(CNS_SYSTEM.elem('foo', {foo: 'bar', baz: 'quux'}), 'bar');
  });

  it('should instantiate classes', () => {
    function Foo (name) { this.name = name }
    const foo = CNS_SYSTEM.create(Foo, 'John');
    assert.equal(foo.constructor, Foo);
    assert.equal(foo.name, 'John');
  });

  it('should intelligently assess types', () => {
    assert.equal(CNS_SYSTEM.type('foo'), 'string');
    assert.equal(CNS_SYSTEM.type(0), 'number');
    assert.equal(CNS_SYSTEM.type(NaN), 'nan');
    assert.equal(CNS_SYSTEM.type(function () {}), 'function');
    assert.equal(CNS_SYSTEM.type([]), 'array');
    assert.equal(CNS_SYSTEM.type({}), 'object');
    assert.equal(CNS_SYSTEM.type(/a/), 'regexp');
    assert.equal(CNS_SYSTEM.type(new Date()), 'date');
    assert.equal(CNS_SYSTEM.type(null), 'null');
  });

  it('should correctly abstract instanceof', () => {
    assert.equal(CNS_SYSTEM.instanceof({}, Object), true);
  });

  it('should retrieve the head of a list', () => {
    assert.equal(CNS_SYSTEM.head([1, 2, 3]), 1);
  });

  it('should retrieve the tail of a list', () => {
    assert.deepEqual(CNS_SYSTEM.tail([1, 2, 3]), [2, 3]);
  });

  it('should retrieve the lead of a list', () => {
    assert.deepEqual(CNS_SYSTEM.lead([1, 2, 3]), [1, 2]);
  });

  it('should retrieve the last of a list', () => {
    assert.equal(CNS_SYSTEM.last([1, 2, 3]), 3);
  });

  it('should choose a random number from a list', () => {
    const choice = CNS_SYSTEM.random([1, 2, 3, 4]);
    assert.equal(typeof choice, 'number');
    assert.equal(choice, parseInt(choice));
    assert.ok(choice < 5 && choice > 0);
  });

  it('should execute a function', () => {
    assert.equal(CNS_SYSTEM.do(function () { return 1 }), 1);
  });

  it('should update a collection to a new collection', () => {
    assert.deepEqual(CNS_SYSTEM.update(1, 4, [1, 2, 3]), [1, 4, 3]);
    assert.deepEqual(CNS_SYSTEM.update('foo', 'baz', {foo: 'bar'}), {foo: 'baz'});
  });

  it('should remove an item from a collection', () => {
    assert.deepEqual(CNS_SYSTEM.remove(1, [1, 2, 3]), [1, 3]);
    assert.deepEqual(CNS_SYSTEM.remove('foo', {foo: 'bar', baz: 'quux'}), {baz: 'quux'});
  });

  it('should guard against bad arities', () => {
    const fn = CNS_SYSTEM.aritize(function () {}, 2);
    assert.doesNotThrow(function () { fn(1, 2) });
    assert.throws(function () { fn() });
    assert.throws(function () { fn(1) });
    assert.throws(function () { fn(1, 2, 3) });
  });

});
