import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Polymorphic Function Definitions', () => {

  it('should compile a named function without polymorphism', () => {
    const toCompile = `myfun() ->
      doStuff()
      a is 4 and b is 4
    end`;
    const expected = nlToSpace(`function myfun () {
      const args = SYSTEM.args(arguments);
      doStuff();
      return a === 4 && b === 4;
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a basic polymorphic function', () => {
    const toCompile = `def
      factorial(0) -> 1
      factorial(n) -> n * factorial(n - 1)
    end`;
    const expected = nlToSpace(`function factorial () {
      const args = SYSTEM.args(arguments);
      if (args.length === 1 && SYSTEM.match(args, [["Number","0"]])) {
        return 1;
      } else if (args.length === 1 && SYSTEM.match(args, [["Identifier","n"]])) {
        const n = args[0];
        return n * factorial(n - 1);
      } else {
        return SYSTEM.noMatch('def');
      }
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a basic polymorphic function without parens', () => {
    const toCompile = `def
      factorial 0 -> 1
      factorial n -> n * factorial n - 1
    end`;
    const expected = nlToSpace(`function factorial () {
      const args = SYSTEM.args(arguments);
      if (args.length === 1 && SYSTEM.match(args, [["Number","0"]])) {
        return 1;
      } else if (args.length === 1 && SYSTEM.match(args, [["Identifier","n"]])) {
        const n = args[0];
        return n * factorial(n - 1);
      } else {
        return SYSTEM.noMatch('def');
      }
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a basic polymorphic function without parens and using implicit binding', () => {
    const toCompile = `def
      factorial 0 => 1
      factorial n => n * factorial n - 1
    end`;
    const expected = nlToSpace(`function factorial () {
      const args = SYSTEM.args(arguments);
      if (args.length === 1 && SYSTEM.match(args, [["Number","0"]])) {
        return 1;
      } else if (args.length === 1 && SYSTEM.match(args, [["Identifier","n"]])) {
        const n = args[0];
        return n * factorial(n - 1);
      } else {
        return SYSTEM.noMatch('def');
      }
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a more complex polymorphic function', () => {
    const toCompile = `def
      foo [hd|tl] ->
        {a, b, c} = something
        foo doStuff(hd), tl
      end
      foo item, [] -> item
      foo item, list ->
        doStuff()
        doMoreStuff()
      end
    end`;
    const expected = nlToSpace(`function foo () {
      const args = SYSTEM.args(arguments);
      if (args.length === 1 && SYSTEM.match(args, [["Cons","[hd|tl]"]])) {
        const hd = args[0][0];
        const tl = args[0].slice(1);
        const {a, b, c} = something;
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
        return SYSTEM.noMatch('def');
      }
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a polymorphic function with guards', () => {
    const toCompile = `def
      factorial 0 -> 1
      factorial n when n lt 2 -> 1
      factorial n -> n * factorial n - 1
    end`;
    const expected = nlToSpace(`function factorial () {
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
        return SYSTEM.noMatch('def');
      }
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile a polymorphic function with more complex guards', () => {
    const toCompile = `def
      factorial 0 -> 1
      factorial n when n lt 2 and n gt -1 -> 1
      factorial n -> n * factorial n - 1
    end`;
    const expected = nlToSpace(`function factorial () {
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
        return SYSTEM.noMatch('def');
      }
    }`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
