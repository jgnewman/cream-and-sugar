import assert from 'assert';
import CNS_ from '../src/compiler/SYSTEM';
import { compileCode } from  '../src/compiler/compiler';


describe('SYSTEM Library', () => {

  it('should handle conditions', () => {
    assert.equal(CNS_.qualify(true, function(){return 1}), 1);
    assert.equal(CNS_.qualify(false, function(){return 1}), undefined);
    assert.equal(CNS_.qualify(true, function(){return 1}, function(){return 2}), 1);
    assert.equal(CNS_.qualify(false, function(){return 1}, function(){return 2}), 2);
  });

  it('should handle equality testing', () => {
    assert.equal(CNS_.eql('0', 0), false);
    assert.equal(CNS_.eql(NaN, NaN), true);
    assert.equal(CNS_.eql(0, function () {}), false);
    assert.equal(CNS_.eql({a: [1, 2, {e: 'f'}], b: {c: 'd'}}, {a: [1, 2, {e: 'f'}], b: {c: 'd'}}), true);
  });

  it('should pattern match against identifiers', () => {
    assert.equal(CNS_.match([1],    [['Identifier', 'x']]), true);
    assert.equal(CNS_.match([1, 2], [['Identifier', 'x']]), false);
  });

  it('should pattern match against special values', () => {
    assert.equal(CNS_.match([true],  [['Special', 'true']]), true);
    assert.equal(CNS_.match([false], [['Special', 'true']]), false);
    assert.equal(CNS_.match([NaN],   [['Special', 'NaN']]), true);
  });

  it('should pattern match against numbers', () => {
    assert.equal(CNS_.match([1, 2], [['Number', '1'], ['Number', '2']]), true);
  });

  it('should pattern match against arrays', () => {
    assert.equal(CNS_.match([[1, 2]], [['Arr', [1, 2]]]), true);
    assert.equal(CNS_.match([[1, 2]], [['Arr', [1, 'x']]]), true);
    assert.equal(CNS_.match([[1, 2]], [['Arr', [1]]]), false);
    assert.equal(CNS_.match([[NaN]],  [['Arr', ['NaN']]]), true);
    assert.equal(CNS_.match([[300]],  [['Arr', ['NaN']]]), false);
  });

  it('should pattern match against tuples', () => {
    assert.equal(CNS_.match([CNS_.tuple([1, 2])], [['Tuple', [1, 'x']]]), true);
    assert.equal(CNS_.match([CNS_.tuple([1, 2])], [['Tuple', [1]]]), false);
    assert.equal(CNS_.match([[1, 2]], [['Tuple', [1, 'x']]]), false);
  });

  it('should pattern match against HeadTails and LeadLasts', () => {
    assert.equal(CNS_.match([[1, 2]], [['HeadTail', ['a', 'b']]]), true);
    assert.equal(CNS_.match([1, 2],   [['HeadTail', ['a', 'b']]]), false);
    assert.equal(CNS_.match([[1, 2]], [['LeadLast', ['a', 'b']]]), true);
    assert.equal(CNS_.match([1, 2],   [['LeadLast', ['a', 'b']]]), false);
  });

  it('should pattern match against keys', () => {
    assert.equal(CNS_.match([{x:1,y:2}], [['Keys', ['x', 'y']]]), true);
  });

  it('should pattern match against objects', () => {
    assert.equal(CNS_.match([{x:1,y:2}], [['Obj', ['x:1', 'y:2']]]), true);
    assert.equal(CNS_.match([{x:1,y:2}], [['Obj', ['x:1']]]), true);
    assert.equal(CNS_.match([{x:1}], [['Obj', ['x:1', 'y:a']]]), true);
    assert.equal(CNS_.match([{x:1}], [['Obj', ['x:y']]]), true);
    assert.equal(CNS_.match([{[Symbol.for('FOO')]:1}], [['Obj', ['Symbol.for("FOO"):1']]]), true);
    assert.equal(CNS_.match([{x:Symbol.for('FOO')}], [['Obj', ['x:Symbol.for("FOO")']]]), true);
  });

  it('should convert arguments to arrays', () => {
    const args = (function (x, y) { return arguments }(1, 2));
    assert.deepEqual(CNS_.args(args), [1, 2]);
    assert.equal(Array.isArray(CNS_.args(args)), true);
  });

  it('should retrieve elements from collections', () => {
    assert.equal(CNS_.get(2, ['a', 'b', 'c']), 'c');
    assert.equal(CNS_.get('foo', {foo: 'bar', baz: 'quux'}), 'bar');
    assert.equal(CNS_.get(0, CNS_.tuple([1, 2, 3])), 1);
  });

  it('should instantiate classes', () => {
    function Foo (name) { this.name = name }
    const foo = CNS_.create(Foo, 'John');
    assert.equal(foo.constructor, Foo);
    assert.equal(foo.name, 'John');
  });

  it('should intelligently assess types', () => {
    assert.equal(CNS_.type('foo'), 'string');
    assert.equal(CNS_.type(0), 'number');
    assert.equal(CNS_.type(NaN), 'nan');
    assert.equal(CNS_.type(function () {}), 'function');
    assert.equal(CNS_.type([]), 'array');
    assert.equal(CNS_.type({}), 'object');
    assert.equal(CNS_.type(/a/), 'regexp');
    assert.equal(CNS_.type(new Date()), 'date');
    assert.equal(CNS_.type(null), 'null');
    assert.equal(CNS_.type(CNS_.tuple([0])), 'tuple');
  });

  it('should correctly abstract instanceof', () => {
    assert.equal(CNS_.instanceof({}, Object), true);
  });

  it('should retrieve the head of a list', () => {
    assert.equal(CNS_.head([1, 2, 3]), 1);
  });

  it('should retrieve the tail of a list', () => {
    assert.deepEqual(CNS_.tail([1, 2, 3]), [2, 3]);
  });

  it('should retrieve the lead of a list', () => {
    assert.deepEqual(CNS_.lead([1, 2, 3]), [1, 2]);
  });

  it('should retrieve the last of a list', () => {
    assert.equal(CNS_.last([1, 2, 3]), 3);
  });

  it('should choose a random number from a list', () => {
    const choice = CNS_.random([1, 2, 3, 4]);
    assert.equal(typeof choice, 'number');
    assert.equal(choice, parseInt(choice));
    assert.ok(choice < 5 && choice > 0);
  });

  it('should execute a function', () => {
    assert.equal(CNS_.apply(function () { return 1 }), 1);
  });

  it('should update a collection to a new collection', () => {
    assert.deepEqual(CNS_.update(1, 4, [1, 2, 3]), [1, 4, 3]);
    assert.deepEqual(CNS_.update('foo', 'baz', {foo: 'bar'}), {foo: 'baz'});
  });

  it('should remove an item from a collection', () => {
    assert.deepEqual(CNS_.remove(1, [1, 2, 3]), [1, 3]);
    assert.deepEqual(CNS_.remove('foo', {foo: 'bar', baz: 'quux'}), {baz: 'quux'});
  });

  it('should guard against bad arities', () => {
    const fn = CNS_.aritize(function () {}, 2);
    assert.doesNotThrow(function () { fn(1, 2) });
    assert.throws(function () { fn() });
    assert.throws(function () { fn(1) });
    assert.throws(function () { fn(1, 2, 3) });
  });

});
