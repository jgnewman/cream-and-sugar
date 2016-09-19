const CNS_SYSTEM = {

  // CNS_SYSTEM.qualify(x === 4, function () { return doSomething() })
  qualify: function (condition, callback, elseCase) {
    return condition ? callback() : elseCase ? elseCase() : undefined;
  },

  // CNS_SYSTEM.noMatch('cond')
  noMatch: function (type) {
    throw new Error('No match found for ' + type + ' statement.');
  },

  // CNS_SYSTEM.eql([1, 2, 3], [1, 2, 3]) -> true
  eql: function (a, b) {
    if (a === CNS_SYSTEM || b === CNS_SYSTEM) return true; // <- Hack to force a match
    if (a === b || (typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b))) return true;
    if (typeof a !== typeof b) return false;
    if (typeof a === 'object') {
      if (Array.isArray(a)) return a.every((item, index) => this.eql(item, b[index]));
      const ks = Object.keys, ak = ks(a), bk = ks(b);
      if (!this.eql(ak, bk)) return false;
      return ak.every(key => this.eql(a[key], b[key]));
    }
    return false;
  },

  // CNS_SYSTEM.match(args, [['Identifier', 'x']])
  match: function (args, pattern) {
    return args.every(function (arg, index) {
      if (!pattern[index]) return false;
      var matchType = pattern[index][0];
      var matchVal  = pattern[index][1];
      switch (matchType) {
        case 'Identifier': return true;
        case 'Atom': return Symbol.for(matchVal.slice(1)) === arg;
        case 'Number': return typeof arg === 'number' && arg === parseFloat(matchVal);
        case 'Cons': case 'BackCons': return Array.isArray(arg);
        case 'Arr':
          if (Array.isArray(arg)) {
            const eqlTestStr = matchVal.replace(/^\[|\s+|\]$/g, '');
            const eqlTest = !eqlTestStr.length ? [] : eqlTestStr.split(',').map(each => {
              if (each === 'null') return null;
              if (each === 'undefined') return undefined;
              if (each === 'NaN') return NaN;
              if (each === 'true') return true;
              if (each === 'false') return false;
              if (each[0] === '~') return Symbol.for(each.slice(1));
              return /^[\$_A-z][\$_A-z0-9]*$/.test(each) ? CNS_SYSTEM : JSON.parse(each);
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
        case 'Tuple': throw new Error(`Can't currently match against tuple forms.`);
        case 'Object': throw new Error(`Can't currently match against object forms.`);
        default: return false;
      }
    }.bind(this));
  },

  // CNS_SYSTEM.args(arguments) -> [...arguments]
  args: function (args) {
    const out = [];
    Array.prototype.push.apply(out, args);
    return out;
  },

  // CNS_SYSTEM.elem(0, [1, 2, 3, 4]) -> 1
  elem: function (item, collection) {
    return collection[item];
  },

  // CNS_SYSTEM.throw(create(Error))
  throw: function (err) {
    throw err;
  },

  // CNS_SYSTEM.create(ClassName, arg1, arg2) -> ClassName { ... }
  create: function(cls) {
    return new (Function.prototype.bind.apply(cls, arguments));
  },

  // CNS_SYSTEM.typeof('hello') -> 'string'
  type: function (val) {
    const type = typeof val;
    switch (type) {
      case 'symbol': return 'atom';
      case 'number': return isNaN(val) ? 'nan' : type;
      case 'object': return val === null ? 'null' :
                              Array.isArray(val) ? 'array' :
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

  // CNS_SYSTEM.instanceof([], Object) -> true
  instanceof: function (val, type) {
    return val instanceof type;
  },

  // CNS_SYSTEM.head([1, 2, 3]) -> 1
  head: function (list) {
    return list[0];
  },

  // CNS_SYSTEM.tail([1, 2, 3]) -> [2, 3]
  tail: function (list) {
    return list.slice(1);
  },

  // CNS_SYSTEM.exp('myFn', function () { ... })
  exp: `(function () {
    var exp = (typeof module === 'undefined' || !module.exports) ? this : module.exports;
    return function (name, val) {
      exp[name] = val;
    };
  }())`,

  // CNS_SYSTEM.random([1, 2, 3, 4]) -> 3
  random: function (list) {
    return list[Math.floor(Math.random()*list.length)];
  },

  // CNS_SYSTEM.lead([1, 2, 3]) -> [1, 2]
  lead: function (list) {
    return list.slice(0, list.length - 1);
  },

  // CNS_SYSTEM.last([1, 2, 3]) -> 3
  last: function (list) {
    return list[list.length - 1];
  },

  // CNS_SYSTEM.do(function () { ... }, [1, 2, 3])
  do: function (fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return args.length ? fn.apply(null, args) : fn();
  },

  // CNS_SYSTEM.update('name', 'john', {name: 'bill'}) -> {name: 'john'}
  // CNS_SYSTEM.update(1, 'x', ['a', 'b', 'c']) -> ['a', 'x', 'c']
  update: function (keyOrIndex, val, collection) {
    if (Array.isArray(collection)) {
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

  // CNS_SYSTEM.remove(1, ['a', 'b', 'c']) -> ['a', 'b']
  // CNS_SYSTEM.remove('name', {name: 'john', age: 33}) -> {age: 33}
  remove: function (keyOrIndex, collection) {
    if (Array.isArray(collection)) {
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

  // CNS_SYSTEM.createElement('div', {className: 'foo'}, [CNS_SYSTEM.createElement(...)])
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
    Object.keys(a).forEach(key => {
      const cleanKey = key === 'className' ? 'class' : key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      elem.setAttribute(cleanKey, a[key]);
    });
    b.forEach(node => elem.appendChild(node));
    return elem;
  },

  // CNS_SYSTEM.aritize(fun, 2);
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
         return '[' + obj.map(function (item) { return CNS_SYSTEM.msgs.stringify(item) }).join(', ') + ']';
       } else {
         return '{' + Object.keys(obj).map(function (key) { return key + ':' + CNS_SYSTEM.msgs.stringify(obj[key]) }).join(',\n') + '}';
       }
     },

     symbolize: function (data, reSymbolize) {
       if (!reSymbolize && typeof data === 'symbol') return '__' + data.toString() + '__';
       if (reSymbolize && typeof data === 'string' && /^__Symbol\(.+\)__$/.test(data)) {
         return Symbol.for(data.replace(/^__Symbol\(|\)__$/g, ''));
       }
       if (Array.isArray(data)) {
         return data.map(function (item) { return CNS_SYSTEM.msgs.symbolize(item, reSymbolize) });
       } else if (typeof data === 'object' && data !== null) {
         var out = {};
         Object.keys(data).forEach(function (key) { out[key] = CNS_SYSTEM.msgs.symbolize(data[key], reSymbolize) });
         return out;
       }
       return data;
     },

     onMsg: function (msg) {
       CNS_SYSTEM.msgs.isBrowser() && (msg = msg.data);
       const m = CNS_SYSTEM.msgs.symbolize(msg, true);
       CNS_SYSTEM.msgs.queue.push(m);
       if (!CNS_SYSTEM.msgs.isWaiting) {
         CNS_SYSTEM.msgs.isWaiting = true;
         setTimeout(function () {
           CNS_SYSTEM.msgs.runQueue();
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
       const body = 'const CNS_SYSTEM = ' + CNS_SYSTEM.msgs.stringify(CNS_SYSTEM) + ';\n' +
                    'CNS_SYSTEM.msgs.isChild = true;\n' +
                    'CNS_SYSTEM.msgs.handlers = [];\n' +
                    (isBrowser ? 'this.onmessage = CNS_SYSTEM.msgs.onMsg;\n'
                               : 'process.on("message", CNS_SYSTEM.msgs.onMsg);\n') +
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
       isBrowser ? (this.thread.onmessage = CNS_SYSTEM.msgs.onMsg)
                 : this.thread.on('message', CNS_SYSTEM.msgs.onMsg);
       !isBrowser && this.thread.on('exit', function () { console.log('process exited') })
       return this;
     }
   },

   // Create a new process exclusively from a function body.
   // Example:
   // createProcess ->
   //   spawn fn ->
   //     ...process body...
   //   end
   // end
   // export { createProcess/0 }
   spawn: function (fn) {
    return new CNS_SYSTEM.msgs.Thread('(' + fn.toString() + '())');
   },

   // Specifies what to do when a message comes in
   receive: function (fn) {
     CNS_SYSTEM.msgs.handlers.push(fn);
   },

   // Kills a process
   kill: function (thread) {
     thread.isBrowser ? thread.thread.terminate() : thread.thread.kill('SIGINT');
   },

   // Should be like send(msg)
   reply: function (msg) {
     const m = CNS_SYSTEM.msgs.symbolize(msg, false);
     CNS_SYSTEM.msgs.isBrowser() ? postMessage(m) : process.send(m) ;
   },

   // Should be like send(thread, msg)
   send: function (thread, msg) {
     const m = CNS_SYSTEM.msgs.symbolize(msg, false);
     CNS_SYSTEM.msgs.isBrowser() ? thread.thread.postMessage(m) : thread.thread.send(m);
   }

   /********************************
    * End message passing stuff
    ********************************/
};





// export default CNS_SYSTEM;
module.exports = CNS_SYSTEM;
