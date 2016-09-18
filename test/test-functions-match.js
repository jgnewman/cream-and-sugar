import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Polymorphic Match Expressions', () => {

  it('should compile a basic polymorphic match expression', () => {
    const toCompile = `match
      0 -> 1
      x, y -> n * factorial(n - 1)
    end`;
    const expected = nlToSpace(`function () {
      const args = SYSTEM.args(arguments);
      if (args.length === 1 && SYSTEM.match(args, [["Number","0"]])) {
        return 1;
      } else if (args.length === 2 && SYSTEM.match(args, [["Identifier","x"],["Identifier","y"]])) {
        const x = args[0];
        const y = args[1];
        return n * factorial(n - 1);
      } else {
        return SYSTEM.noMatch('match');
      }
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a basic polymorphic match expression with parens', () => {
    const toCompile = `match
      (0) -> 1
      (x, y) -> n * factorial(n - 1)
    end`;
    const expected = nlToSpace(`function () {
      const args = SYSTEM.args(arguments);
      if (args.length === 1 && SYSTEM.match(args, [["Number","0"]])) {
        return 1;
      } else if (args.length === 2 && SYSTEM.match(args, [["Identifier","x"],["Identifier","y"]])) {
        const x = args[0];
        const y = args[1];
        return n * factorial(n - 1);
      } else {
        return SYSTEM.noMatch('match');
      }
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a basic polymorphic match using implicit binding', () => {
    const toCompile = `match
      (0) => 1
      (x, y) => n * factorial(n - 1)
    end`;
    const expected = nlToSpace(`function () {
      const args = SYSTEM.args(arguments);
      if (args.length === 1 && SYSTEM.match(args, [["Number","0"]])) {
        return 1;
      } else if (args.length === 2 && SYSTEM.match(args, [["Identifier","x"],["Identifier","y"]])) {
        const x = args[0];
        const y = args[1];
        return n * factorial(n - 1);
      } else {
        return SYSTEM.noMatch('match');
      }
    }.bind(this)`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a more complex polymorphic match', () => {
    const toCompile = `match
      [hd|tl] ->
        {a, b, c} = something
        foo doStuff(hd), tl
      end
      item, [] -> item
      item, list ->
        doStuff()
        doMoreStuff()
      end
    end`;
    const expected = nlToSpace(`function () {
      const args = SYSTEM.args(arguments);
      if (args.length === 1 && SYSTEM.match(args, [["Cons","[hd|tl]"]])) {
        const hd = args[0][0];
        const tl = args[0].slice(1);
        var __ref0__ = something;
        const a = __ref0__.a;
        const b = __ref0__.b;
        const c = __ref0__.c;
        return foo(doStuff(hd), tl);
      } else if (args.length === 2 && SYSTEM.match(args, [["Identifier","item"],["Arr","[]"]])) {
        const item = args[0];
        return item;
      } else if (args.length === 2 && SYSTEM.match(args, [["Identifier","item"],["Identifier","list"]])) {
        const item = args[0];
        const list = args[1];
        doStuff();
        return doMoreStuff();
      } else {
        return SYSTEM.noMatch('match');
      }
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a polymorphic match with guards', () => {
    const toCompile = `factorial = match
      0 -> 1
      n when n lt 2 -> 1
      n -> n * factorial n - 1
    end`;
    const expected = nlToSpace(`const factorial = function () {
      const args = SYSTEM.args(arguments);
      if (args.length === 1 && SYSTEM.match(args, [["Number","0"]])) {
        return 1;
      } else if (args.length === 1 && SYSTEM.match(args, [["Identifier","n"]])) {
        const n = args[0];
        if (n < 2) {
          return 1;
        } else {
          return n * factorial(n - 1);
        }
      } else {
        return SYSTEM.noMatch('match');
      }
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a polymorphic match with more complex guards', () => {
    const toCompile = `factorial = match
      0 -> 1
      n when n lt 2 and n gt -1 -> 1
      n -> n * factorial n - 1
    end`;
    const expected = nlToSpace(`const factorial = function () {
      const args = SYSTEM.args(arguments);
      if (args.length === 1 && SYSTEM.match(args, [["Number","0"]])) {
        return 1;
      } else if (args.length === 1 && SYSTEM.match(args, [["Identifier","n"]])) {
        const n = args[0];
        if (n < 2 && n > -1) {
          return 1;
        } else {
          return n * factorial(n - 1);
        }
      } else {
        return SYSTEM.noMatch('match');
      }
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
