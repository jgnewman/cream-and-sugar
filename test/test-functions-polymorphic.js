import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Polymorphic Function Definitions', () => {

  it('should compile a named function without polymorphism', () => {
    const toCompile = 'myfun _ =>\n'
                    + '  doStuff _\n'
                    + '  a is 4 and b is 4\n\n';
    const expected = nlToSpace(`function myfun () {
      doStuff();
      return a === 4 && b === 4;
    };`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a basic polymorphic function', () => {
    const toCompile = 'factorial 0 => 1\n'
                    + 'factorial n => n * factorial n - 1\n\n';
    const expected = nlToSpace(`function factorial () {
      const args = CNS_.args(arguments);
      if (args.length === 1 && CNS_.match(args, [["Number","0"]])) {
        return 1;
      } else if (args.length === 1 && CNS_.match(args, [["Identifier","n"]])) {
        const n = args[0];
        return n * factorial(n - 1);
      } else {
        throw new Error('No match found for functional pattern match statement.');
      }
    };`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a basic polymorphic function using implicit binding', () => {
    const toCompile = 'factorial 0 ::=> 1\n'
                    + 'factorial n ::=> n * factorial n - 1\n\n';
    const expected = nlToSpace(`function factorial () {
      const args = CNS_.args(arguments);
      if (args.length === 1 && CNS_.match(args, [["Number","0"]])) {
        return 1;
      } else if (args.length === 1 && CNS_.match(args, [["Identifier","n"]])) {
        const n = args[0];
        return n * factorial(n - 1);
      } else {
        throw new Error('No match found for functional pattern match statement.');
      }
    };`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a more complex polymorphic function', () => {
    const toCompile = 'foo [hd|tl] =>\n'
                    + '  {a, b, c} = something\n'
                    + '  foo (doStuff hd), tl\n'
                    + 'foo item, [] => item\n'
                    + 'foo item, list =>\n'
                    + '  doStuff _\n'
                    + '  doMoreStuff _\n\n';
    const expected = nlToSpace(`function foo () {
      const args = CNS_.args(arguments);
      if (args.length === 1 && CNS_.match(args, [["HeadTail",["hd","tl"]]])) {
        const hd = args[0][0];
        const tl = args[0].slice(1);
        var ref0_ = something;
        const a = ref0_.a;
        const b = ref0_.b;
        const c = ref0_.c;
        return foo(doStuff(hd), tl);
      } else if (args.length === 2 && CNS_.match(args, [["Identifier","item"],["Arr",[]]])) {
        const item = args[0];
        return item;
      } else if (args.length === 2 && CNS_.match(args, [["Identifier","item"],["Identifier","list"]])) {
        const item = args[0];
        const list = args[1];
        doStuff();
        return doMoreStuff();
      } else {
        throw new Error('No match found for functional pattern match statement.');
      }
    };`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a polymorphic function with guards', () => {
    const toCompile = 'factorial 0 => 1\n'
                    + 'factorial n where n lt 2 => 1\n'
                    + 'factorial n => n * factorial n - 1\n\n';
    const expected = nlToSpace(`function factorial () {
      const args = CNS_.args(arguments);
      if (args.length === 1 && CNS_.match(args, [["Number","0"]])) {
        return 1;
      } else if (args.length === 1 && CNS_.match(args, [["Identifier","n"]])) {
        const n = args[0];
        if (n < 2) {
          return 1;
        } else {
          return n * factorial(n - 1);
        }
      } else {
        throw new Error('No match found for functional pattern match statement.');
      }
    };`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a polymorphic function with more complex guards', () => {
    const toCompile = 'factorial 0 => 1\n'
                    + 'factorial n where n lt 2 and n gt -1 => 1\n'
                    + 'factorial n => n * factorial n - 1\n\n';
    const expected = nlToSpace(`function factorial () {
      const args = CNS_.args(arguments);
      if (args.length === 1 && CNS_.match(args, [["Number","0"]])) {
        return 1;
      } else if (args.length === 1 && CNS_.match(args, [["Identifier","n"]])) {
        const n = args[0];
        if (n < 2 && n > -1) {
          return 1;
        } else {
          return n * factorial(n - 1);
        }
      } else {
        throw new Error('No match found for functional pattern match statement.');
      }
    };`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile a large, complex function body', () => {
    const toCompile = 'up _ =>\n'
                    + '  # Create and return a new process from a function.\n'
                    + '  spawn fn =>\n'
                    + '    # When we receive a message, pattern match it to figure out what to do.\n'
                    + '    receive match\n'
                    + '      # If the message is an array beginning with the atom FACTORIAL, we will\n'
                    + '      # calculate the factorial of num and send it back marked as OK.\n'
                    + '      [FACTORIAL, num] => reply [OK, factorial num]\n'
                    + '      # If the message is anything else, send a reply marked as "ERR" and\n'
                    + '      # pass along a reason.\n'
                    + '      _ => reply [ERR, "Unknown command received"]\n'
                    + '    # Define the factorial function so that we can actually calculate them.\n'
                    + '    factorial 0 => 1\n'
                    + '    factorial n => n * factorial n - 1\n\n';

    const expected = nlToSpace(`function up () {
      return CNS_.spawn(function () {
        CNS_.receive(function () {
          const args = CNS_.args(arguments);
          if (args.length === 1 && CNS_.match(args, [["Arr",["Symbol.for('FACTORIAL')","num"]]])) {
            const num = args[0][1];
            return CNS_.reply([Symbol.for('OK'), factorial(num)]);
          } else if (args.length === 1 && CNS_.match(args, [["Identifier","_"]])) {
            return CNS_.reply([Symbol.for('ERR'), "Unknown command received"]);
          } else {
            throw new Error('No match found for match statement.');
          }
        });
        return function factorial () {
          const args = CNS_.args(arguments);
          if (args.length === 1 && CNS_.match(args, [["Number","0"]])) {
            return 1;
          } else if (args.length === 1 && CNS_.match(args, [["Identifier","n"]])) {
            const n = args[0];
            return n * factorial(n - 1);
          } else {
            throw new Error('No match found for functional pattern match statement.');
          }
        };
      });
    };`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
