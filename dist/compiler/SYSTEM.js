const CNS_ = {

  tuple: function (arr) {
    if (!arr.length) throw new Error('Tuples can not be empty.');
    Object.defineProperty
      ? Object.defineProperty(arr, 'CNS_isTuple_', {enumerable: false, configurable: false, writable: false, value: CNS_})
      : (arr.CNS_isTuple_ = CNS_);
    return arr;
  },

  // CNS_.listToObject([fun1, fun2], function (fun) { return fun.name }) -> {fun1: fun1, fun2: fun2}
  tupleToObject: function (list, fn) {
    const obj = {};
    if (list.CNS_isTuple_ !== CNS_) throw new Error('Argument provided is not a tuple');
    list.forEach(function (item, index) { obj[fn ? fn(item, index) : index] = item });
    return obj;
  },

  // CNS_.tupleToArray({{ a, b }}) -> [ a, b ]
  tupleToArray: function (tuple) {
    if (tuple.CNS_isTuple_ !== CNS_) throw new Error('Argument provided is not a tuple');
    return tuple.slice();
  },

  // CNS_.arrayToTuple([1, 2]) -> {{ 1, 2 }}
  arrayToTuple: function (arr) {
    if (arr.CNS_isTuple_ === CNS_ || !Array.isArray(arr)) throw new Error('Argument provided is not an array');
    return CNS_.tuple(arr.slice());
  },

  // CNS_.qualify(x === 4, function () { return doSomething() })
  qualify: function (condition, callback, elseCase) {
    return condition ? callback() : elseCase ? elseCase() : undefined;
  },

  // CNS_.eql([1, 2, 3], [1, 2, 3]) -> true
  eql: function (a, b) {
    if (a === CNS_ || b === CNS_) return true; // <- Hack to force a match
    if (a === b || (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b))) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'object') {
      if (Array.isArray(a)) return a.every(function(item, index) { return this.eql(item, b[index]) }.bind(this));
      const ks = Object.keys, ak = ks(a), bk = ks(b);
      if (!CNS_.eql(ak, bk)) return false;
      return ak.every(function (key) { return this.eql(a[key], b[key]) }.bind(this));
    }
    return false;
  },

  // CNS_.match(args, [['Identifier', 'x']])
  match: function (args, pattern) {
    const NUMTEST    = /^(\-)?[0-9]+(\.[0-9]+)?(e\-?[0-9]+)?$/;
    const ATOMTEST   = /^[\$_A-z][\$_A-z0-9]*$/;
    const SYMTEST    = /^Symbol\.for\(/;
    const SYMREPLACE = /^Symbol\.for\((\'|\")|(\'|\")\)$/g;
    function convertSpecial(special) {
      switch (special) {
        case 'null': return null; case 'undefined': return undefined;
        case 'true': return true; case 'false': return false; default: return special;
      }
    }
    function arrMismatch(matchType, arg) {
      switch (matchType) {
        case 'Tuple': return arg.CNS_isTuple_ !== CNS_;
        case 'Arr': return arg.CNS_isTuple_ === CNS_;
      }
    }
    function testArrParam(arg, arrParam, position) {
      if (arrParam === '_') return true; // Yes, if it's the catch all.
      if (arrParam === 'NaN') return isNaN(arg[position]); // Yes, if they're both NaN.
      if ((converted = convertSpecial(arrParam)) !== arrParam) return arg[position] === converted; // Yes, if it's a special and the specials match.
      if (SYMTEST.test(arrParam)) return arg[position] === Symbol.for(arrParam.replace(SYMREPLACE, '')); // Yes, if it's a symbol and symbols match.
      return ATOMTEST.test(arrParam) ? true : CNS_.eql(arg[position], JSON.parse(arrParam)); // Yes, for identifiers, recursive equality check for anything else.
    }
    return args.every(function (arg, index) {
      if (!pattern[index]) return false; // No match if the arity's wrong.
      var matchType = pattern[index][0]; // For example "Tuple"
      var matchVal  = pattern[index][1]; // For example ["x","y"]
      var converted;
      switch(matchType) {
        case 'Identifier': return true; // An identifier is a variable assignment so we allow it.
        case 'Atom': return arg === Symbol.for(matchVal); // Match if it's the same atom.
        case 'String': return arg === matchVal; // Match if it's the same string.
        case 'Number': return NUMTEST.test(arg) && arg === parseFloat(matchVal); // Match if the arg is a number and the numbers are equal.
        case 'Special': return matchVal === 'NaN' ? isNaN(arg) : arg === convertSpecial(matchVal); // Match if the special values are equal.
        case 'HeadTail':
        case 'LeadLast':
          return Array.isArray(arg); // Match any array because we're just doing array destructuring.
        case 'Arr':
        case 'Tuple':
          // No match if it's not an array, we've mismatched arrays/tuples, or if we have the wrong amount of items.
          if (!Array.isArray(arg) || arrMismatch(matchType, arg) || arg.length !== matchVal.length) return false;
          // Match if all of the subobjects match.
          return matchVal.every(function (arrParam, position) {
            return testArrParam(arg, arrParam, position);
          });
        case 'Keys':
        case 'Obj':
          // Similar to the arr/tuple condition except here we don't care if the amount of keys matches our pattern length.
          if (typeof arg !== 'object' || arg.constructor !== Object) return false; // No match if the arg isn't an object.
          if (matchType === 'Keys') return true; // Match if the arg is an object and we're just destructuring keys.
          return matchVal.every(function (pair) {
            const kv = pair.split(':');
            if (SYMTEST.test(kv[0])) (kv[0] = Symbol.for(kv[0].replace(SYMREPLACE, '')));
            return testArrParam(arg, kv[1].trim(), typeof kv[0] === 'string' ?  kv[0].trim() : kv[0]);
          });
        default: throw new Error('Can not pattern match against type ' + matchType); // No match if we don't have a matchable type.
      }
    });
  },

  // CNS_.args(arguments) -> [...arguments]
  args: function (args) {
    const out = [];
    Array.prototype.push.apply(out, args);
    return out;
  },

  // CNS_.get(0, [1, 2, 3, 4]) -> 1
  get: function (item, collection) {
    return collection[item];
  },

  // CNS_.throw(create(Error))
  throw: function (err) {
    throw err;
  },

  // CNS_.create(ClassName, arg1, arg2) -> ClassName { ... }
  create: function(cls) {
    return new (Function.prototype.bind.apply(cls, arguments));
  },

  // CNS_.type('hello') -> 'string'
  type: function (val) {
    const type = typeof val;
    switch (type) {
      case 'symbol': return 'atom';
      case 'number': return isNaN(val) ? 'nan' : type;
      case 'object': return val === null ? 'null' :
                              Array.isArray(val) ? (val.CNS_isTuple_ === CNS_ ? 'tuple' : 'array') :
                                val instanceof Date ? 'date' :
                                  val instanceof RegExp ? 'regexp':
                                    (typeof HTMLElement !== 'undefined' && val instanceof HTMLElement) ? 'htmlelement' :
                                      (
                                        (typeof Worker !== 'undefined' && val instanceof Worker) ||
                                        (val.constructor.name === 'ChildProcess' && typeof val.pid === 'number')
                                      )
                                      ? 'process' : type;
      default: return type;
    }
  },

  // CNS_.instanceof([], Object) -> true
  instanceof: function (val, type) {
    return val instanceof type;
  },

  // CNS_.head([1, 2, 3]) -> 1
  head: function (list) {
    return list[0];
  },

  // CNS_.tail([1, 2, 3]) -> [2, 3]
  tail: function (list) {
    return list.slice(1);
  },

  // CNS_.random([1, 2, 3, 4]) -> 3
  random: function (list) {
    return list[Math.floor(Math.random()*list.length)];
  },

  // CNS_.lead([1, 2, 3]) -> [1, 2]
  lead: function (list) {
    return list.slice(0, list.length - 1);
  },

  // CNS_.last([1, 2, 3]) -> 3
  last: function (list) {
    return list[list.length - 1];
  },

  // CNS_.apply(function () { ... }, [1, 2, 3])
  apply: function (fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return args.length ? fn.apply(null, args) : fn();
  },

  // CNS_.update('name', 'john', {name: 'bill'}) -> {name: 'john'}
  // CNS_.update(1, 'x', ['a', 'b', 'c']) -> ['a', 'x', 'c']
  update: function (keyOrIndex, val, collection) {
    if (Array.isArray(collection)) {
      if (collection.CNS_isTuple_ === CNS_ && collection.indexOf(keyorIndex) === -1) {
        throw new Error('Can not add extra items to tuples.');
      }
      const newSlice = collection.slice();
      newSlice[keyOrIndex] = val;
      return newSlice;
    } else if (typeof HTMLElement !== 'undefined' && collection instanceof HTMLElement) {
      const clone = collection.cloneNode();
      clone[keyOrIndex] = val;
      return clone;
    } else {
      const replacer = {};
      replacer[keyOrIndex] = val;
      return Object.assign({}, collection, replacer);
    }
  },

  // CNS_.remove(1, ['a', 'b', 'c']) -> ['a', 'b']
  // CNS_.remove('name', {name: 'john', age: 33}) -> {age: 33}
  remove: function (keyOrIndex, collection) {
    if (Array.isArray(collection)) {
      if (collection.CNS_isTuple_ === CNS_) throw new Error('Can not remove items from tuples.');
      const splicer = collection.slice();
      splicer.splice(keyOrIndex, 1);
      return splicer;
    } else {
      const newObj = {};
      const keys = Object.keys(collection).concat(
        Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(collection) : []
      );
      keys.forEach(function (key) {
        keyOrIndex !== key && (newObj[key] = collection[key]);
      });
      return newObj;
    }
  },

  // CNS_.createElement('div', {className: 'foo'}, [CNS_.createElement(...)])
  createElement: function (type, attrs, body) {
    var react;
    const a = attrs || {}, b = body || [];
    if (typeof React !== 'undefined') react = React;
    if (!react && typeof require !== 'undefined') {
      try { react = require('react') } catch (_) { react = null }
    }
    if (react) return react.createElement(type, a, b);
    if (typeof document === 'undefined') throw new Error('No HTML document is available.');
    const elem = document.createElement(type);
    Object.keys(a).forEach(function (key) {
      const cleanKey = key === 'className' ? 'class' : key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      elem.setAttribute(cleanKey, a[key]);
    });
    b.forEach(function (node) { elem.appendChild(node) });
    return elem;
  },

  // CNS_.aritize(fun, 2);
  aritize: function (fun, arity) {
    return function () {
      if (arguments.length === arity) {
        return fun.apply(undefined, arguments);
      } else {
        throw new Error('Function ' + (fun.name || '') + ' called with wrong arity. Expected ' + arity + ' got ' + arguments.length + '.');
      }
    };
  },

  dom: function (selector) {
    return document.querySelector(selector);
  },

  domArray: function (selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
  },

  /********************************
   * Begin message passing stuff
   ********************************/

   // A pack of utils for handling message passing.
   msgs: {
     isBrowser: function () { return typeof navigator !== 'undefined' },
     isChild: false,
     queue: [],
     handlers: [],
     isWaiting: false,

     // Should only be used on objects that you know for sure only contain
     // functions, objects, and arrays, deeply nested.
     stringify: function (obj) {
       if (typeof obj === 'function') {
         return obj.toString();
       } else if (typeof obj === 'string') {
         return obj;
       } else if (obj === true || obj === false) {
         return obj;
       } else if (Array.isArray(obj)) {
         return '[' + obj.map(function (item) { return CNS_.msgs.stringify(item) }).join(', ') + ']';
       } else {
         return '{' + Object.keys(obj).map(function (key) { return key + ':' + CNS_.msgs.stringify(obj[key]) }).join(',\n') + '}';
       }
     },

     symbolize: function (data, reSymbolize) {
       // If we need to stringify a symbol, give it a special syntax and return it.
       if (!reSymbolize && typeof data === 'symbol') return '__' + data.toString() + '__';
       // If we need to turn a string into a symbol, generate a symbol and return it.
       if (reSymbolize && typeof data === 'string' && /^__Symbol\(.+\)__$/.test(data)) {
         return Symbol.for(data.replace(/^__Symbol\(|\)__$/g, ''));
       }
       // If this is an array, map over it and see if we need to symbolize any data in it.
       // Return the new array.
       if (Array.isArray(data)) {
         var out = [];
         data.forEach(function (item) { out.push(CNS_.msgs.symbolize(item, reSymbolize)) });
         if (!reSymbolize && data.CNS_isTuple_ === CNS_) (out = { CNS_tuple_: out });
         return out;
       // If this is an object, check to see if it's supposed to be a tuple.
       } else if (typeof data === 'object' && data !== null) {
         // If it's supposed to be a tuple, take care of recursively building a new
         // array and then turn it into a tuple and return it.
         if (reSymbolize && data.CNS_tuple_) {
           var out = CNS_.msgs.symbolize(data.CNS_tuple_, true);
           return CNS_.tuple(out);
         // If it's actually an object, build a new object, symbolizing all the values.
         // We don't try to symbolize object keys because the purpose of a symbol as an object
         // key is to not have it be enumerable.
         } else {
           var out = {};
           Object.keys(data).forEach(function (key) { out[key] = CNS_.msgs.symbolize(data[key], reSymbolize) });
           return out;
         }
       }
       return data;
     },

     onMsg: function (msg) {
       CNS_.msgs.isBrowser() && (msg = msg.data);
       const m = CNS_.msgs.symbolize(msg, true);
       CNS_.msgs.queue.push(m);
       if (!CNS_.msgs.isWaiting) {
         CNS_.msgs.isWaiting = true;
         setTimeout(function () {
           CNS_.msgs.runQueue();
         }, 0);
       }
     },

     runQueue: function () {
       this.queue.forEach(function (msgObj) {
         this.handlers.forEach(function (handler) {
           handler(msgObj);
         });
       }.bind(this));
       this.queue = [];
       this.isWaiting = false;
     },

     Thread: function(fnBody) {
       const isBrowser = typeof navigator !== 'undefined';
       const body = 'const CNS_ = ' + CNS_.msgs.stringify(CNS_) + ';\n' +
                    'CNS_.msgs.isChild = true;\n' +
                    'CNS_.msgs.handlers = [];\n' +
                    (isBrowser ? 'this.onmessage = CNS_.msgs.onMsg;\n'
                               : 'process.on("message", CNS_.msgs.onMsg);\n') +
                    'var arguments = [];\n' +
                    fnBody;
       this.isBrowser  = isBrowser;
       this.thread     = isBrowser
                       ? new Worker(window.URL.createObjectURL(
                           new Blob([body], {type: 'application/javascript'})
                         ))
                       : require('child_process').fork(null, [], {
                           execPath: 'node',
                           execArgv: ['-e', body]
                         })
                       ;
       isBrowser ? (this.thread.onmessage = CNS_.msgs.onMsg)
                 : this.thread.on('message', CNS_.msgs.onMsg);
       !isBrowser && this.thread.on('exit', function () { console.log('process exited') })
       return this;
     }
   },

   // Create a new process exclusively from a function body.
   // Example:
   // createProcess _ =>
   //   spawn fn =>
   //     ...process body...
   // export { createProcess: aritize createProcess 0 }
   spawn: function (fn) {
    return new CNS_.msgs.Thread('(' + fn.toString() + '())');
   },

   // Specifies what to do when a message comes in
   receive: function (fn) {
     CNS_.msgs.handlers.push(fn);
   },

   // Kills a process
   kill: function (thread) {
     thread.isBrowser ? thread.thread.terminate() : thread.thread.kill('SIGINT');
   },

   // Should be like send(msg)
   reply: function (msg) {
     const m = CNS_.msgs.symbolize(msg, false);
     CNS_.msgs.isBrowser() ? postMessage(m) : process.send(m) ;
   },

   // Should be like send(thread, msg)
   send: function (thread, msg) {
     const m = CNS_.msgs.symbolize(msg, false);
     CNS_.msgs.isBrowser() ? thread.thread.postMessage(m) : thread.thread.send(m);
   }

   /********************************
    * End message passing stuff
    ********************************/
};





// export default CNS_;
module.exports = CNS_;
