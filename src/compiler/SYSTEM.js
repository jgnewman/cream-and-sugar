const CNS_ = {

  tuple: function (arr) {
    if (!arr.length) throw new Error('Tuples can not be empty.');
    Object.defineProperty
      ? Object.defineProperty(arr, 'CNS_isTuple_', {enumerable: false, configurable: false, writable: false, value: CNS_})
      : (arr.CNS_isTuple_ = CNS_);
    return arr;
  },

  // CNS_.qualify(x === 4, function () { return doSomething() })
  qualify: function (condition, callback, elseCase) {
    return condition ? callback() : elseCase ? elseCase() : undefined;
  },

  // CNS_.noMatch('cond')
  noMatch: function (type) {
    throw new Error('No match found for ' + type + ' statement.');
  },

  // CNS_.eql([1, 2, 3], [1, 2, 3]) -> true
  eql: function (a, b) {
    if (a === CNS_ || b === CNS_) return true; // <- Hack to force a match
    if (a === b || (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b))) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'object') {
      if (Array.isArray(a)) return a.every(function(item, index) { return this.eql(item, b[index]) }.bind(this));
      const ks = Object.keys, ak = ks(a), bk = ks(b);
      if (!this.eql(ak, bk)) return false;
      return ak.every(function (key) { return this.eql(a[key], b[key]) }.bind(this));
    }
    return false;
  },

  // CNS_.match(args, [['Identifier', 'x']])
  match: function (args, pattern) {
    return args.every(function (arg, index) {
      if (!pattern[index]) return false;
      var matchType = pattern[index][0];
      var matchVal  = pattern[index][1];
      switch (matchType) {
        case 'Identifier': return true;
        case 'Atom': return Symbol.for(matchVal.slice(1)) === arg;
        case 'Number': return typeof arg === 'number' && arg === parseFloat(matchVal);
        case 'String': return arg === matchVal;
        case 'Cons': case 'BackCons': return Array.isArray(arg);
        case 'Arr':
        case 'Tuple':
          if (Array.isArray(arg)) {
            if (matchType === 'Tuple' && arg.CNS_isTuple_ !== CNS_) return false;
            if (matchType === 'Arr' && arg.CNS_isTuple_ === CNS_) return false;
            const eqlTestStr = matchVal.replace(/^(\[|\{\{)|\s+|(\]|\}\})$/g, '');
            const eqlTest = !eqlTestStr.length ? [] : eqlTestStr.split(',').map(function (each) {
              if (each === 'null') return null;
              if (each === 'undefined') return undefined;
              if (each === 'NaN') return NaN;
              if (each === 'true') return true;
              if (each === 'false') return false;
              if (/^[A-Z][A-Z_]+$/.test(each)) return Symbol.for(each.slice(1));
              return /^[\$_A-z][\$_A-z0-9]*$/.test(each) ? CNS_ : JSON.parse(each);
            });
            return this.eql(arg, eqlTest);
          }
          return false;
        case 'Special':
          if ((matchVal === 'null' && arg === null) ||
              (matchVal === 'undefined' && arg === undefined) ||
              (matchVal === 'true' && arg === true) ||
              (matchVal === 'false' && arg === false) ||
              (matchVal === 'NaN') && isNaN(arg)) return true;
          return false;
        case 'Tuple': throw new Error("Can't currently match against tuple forms.");
        case 'Object': throw new Error("Can't currently match against object forms.");
        default: return false;
      }
    }.bind(this));
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

  // CNS_.exp(someValue)
  exp: function (val) {
    typeof module === 'undefined'
      ? typeof console !== 'undefined' &&
        console.warn('Warning: You are attempting to export module values in a non-modular environment.')
      : module.exports = val;
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
