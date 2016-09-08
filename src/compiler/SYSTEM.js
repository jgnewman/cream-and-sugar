const SYSTEM = {

  // SYSTEM.qualify(x === 4, function () { return doSomething() })
  qualify: function (condition, callback, elseCase) {
    return condition ? callback() : elseCase ? elseCase() : undefined;
  },

  // SYSTEM.noMatch('cond')
  noMatch: function (type) {
    throw new Error('No match found for ' + type + ' statement.');
  },

  // SYSTEM.eql([1, 2, 3], [1, 2, 3]) -> true
  eql: function (a, b) {
    if (a === SYSTEM || b === SYSTEM) return true; // <- Hack to force a match
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

  // SYSTEM.match(args, [['Identifier', 'x']])
  match: function (args, pattern) {
    return args.every(function (arg, index) {
      if (!pattern[index]) return false;
      var matchType = pattern[index][0];
      var matchVal  = pattern[index][1];
      switch (matchType) {
        case 'Identifier': return true;
        case 'Number': return typeof arg === 'number' && arg === parseFloat(matchVal);
        case 'Cons': return Array.isArray(arg);
        case 'Arr':
          if (Array.isArray(arg)) {
            const eqlTestStr = matchVal.replace(/^\[|\s+|\]$/g, '');
            const eqlTest = !eqlTestStr.length ? [] : eqlTestStr.split(',').map(each => {
              if (each === 'null') return null;
              if (each === 'undefined') return undefined;
              if (each === 'NaN') return NaN;
              return /^[\$_A-z][\$_A-z0-9]*$/.test(each) ? SYSTEM : JSON.parse(each);
            });
            return this.eql(arg, eqlTest);
          }
          return false;
        case 'Tuple': throw new Error(`Can't currently match against tuple forms.`);
        case 'Object': throw new Error(`Can't currently match against object forms.`);
        default: return false;
      }
    }.bind(this));
  },

  // SYSTEM.args(arguments) -> [...arguments]
  args: function (args) {
    const out = [];
    Array.prototype.push.apply(out, args);
    return out;
  },

  // SYSTEM.elem(0, [1, 2, 3, 4]) -> 1
  elem: function (item, collection) {
    return collection[item];
  },

  // SYSTEM.throw(create(Error))
  throw: function (err) {
    throw err;
  },

  // SYSTEM.create(ClassName, arg1, arg2) -> ClassName { ... }
  create: function(cls) {
    return new (Function.prototype.bind.apply(cls, arguments));
  },

  // SYSTEM.typeof('hello') -> 'string'
  type: function (val) {
    const type = typeof val;
    switch (type) {
      case 'number': return isNaN(val) ? 'nan' : type;
      case 'object': return val === null ? 'null' :
                              Array.isArray(val) ? 'array' :
                                val instanceof Date ? 'date' :
                                  val instanceof RegExp ? 'regexp':
                                    (typeof HTMLElement !== 'undefined' && val instanceof HTMLElement) ? 'htmlelement' :
                                      type;
      default: return type;
    }
  },

  // SYSTEM.instanceof([], Object) -> true
  instanceof: function (val, type) {
    return val instanceof type;
  },

  // SYSTEM.head([1, 2, 3]) -> 1
  head: function (list) {
    return list[0];
  },

  // SYSTEM.tail([1, 2, 3]) -> [2, 3]
  tail: function (list) {
    return list.slice(1);
  },

  // SYSTEM.exp('myFn', function () { ... })
  exp: `(function () {
    var exp = (typeof module === 'undefined' || !module.exports) ? this : module.exports;
    return function (name, val) {
      exp[name] = val;
    };
  }())`,

  // SYSTEM.assnCons([1, 2, 3], 'hd', 'tl')
  assnCons: function (list, hName, tName) {
    const out = {};
    out[hName] = list[0];
    out[tName] = list.slice(1);
    return out;
  },

  // SYSTEM.random([1, 2, 3, 4]) -> 3
  random: function (list) {
    return list[Math.floor(Math.random()*list.length)];
  },

  // SYSTEM.lead([1, 2, 3]) -> [1, 2]
  lead: function (list) {
    return list.slice(0, list.length - 1);
  },

  // SYSTEM.last([1, 2, 3]) -> 3
  last: function (list) {
    return list[list.length - 1];
  },

  // SYSTEM.do(function () { ... }, [1, 2, 3])
  do: function (fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return args.length ? fn.apply(null, args) : fn();
  },

  // SYSTEM.update({name: 'bill'}, 'name', 'john') -> {name: 'john'}
  // SYSTEM.update(['a', 'b', 'c'], 1, 'x') -> ['a', 'x', 'c']
  update: function (collection, keyOrIndex, val) {
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

  // SYSTEM.remove(['a', 'b', 'c'], 1) -> ['a', 'b']
  // SYSTEM.remove({name: 'john', age: 33}, 'name') -> {age: 33}
  remove: function (collection, keyOrIndex) {
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

  // SYSTEM.createElement('div', {className: 'foo'}, [SYSTEM.createElement(...)])
  createElement: function (type, attrs, body) {
    var react;
    const a = attrs || {}, b = body || [];
    if (typeof React !== 'undefined') react = React;
    if (!react && typeof require !== 'undefined') react = require('React');
    if (react) return react.createElement(type, a, b);
    const elem = document.createElement(type);
    Object.keys(a).forEach(key => {
      const cleanKey = key === 'className' ? 'class' : key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      elem.setAttribute(cleanKey, a[key]);
    });
    b.forEach(node => elem.appendChild(node));
    return elem;
  },

  // SYSTEM.aritize(fun, 2);
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
    return document.querySelectorAll(selector);
  },

  /********************************
   * Begin message passing stuff
   ********************************/

   // A pack of utils for handling message passing.
   msgs: {
     isBrowser: typeof navigator !== 'undefined',
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
         return '[' + obj.map(function (item) { return SYSTEM.msgs.stringify(item) }).join(', ') + ']';
       } else {
         return '{' + Object.keys(obj).map(function (key) { return key + ':' + SYSTEM.msgs.stringify(obj[key]) }).join(',\n') + '}';
       }
     },

     symbolize: function (data, reSymbolize) {
       if (!reSymbolize && typeof data === 'symbol') return '__' + data.toString() + '__';
       if (reSymbolize && typeof data === 'string' && /^__Symbol\(.+\)__$/.test(data)) {
         return Symbol.for(data.replace(/^__Symbol\(|\)__$/g, ''));
       }
       if (Array.isArray(data)) {
         return data.map(function (item) { return SYSTEM.msgs.symbolize(item, reSymbolize) });
       } else if (typeof data === 'object' && data !== null) {
         var out = {};
         Object.keys(data).forEach(function (key) { out[key] = SYSTEM.msgs.symbolize(data[key], reSymbolize) });
         return out;
       }
       return data;
     },

     onMsg: function (msg) {
       SYSTEM.msgs.isBrowser && (msg = msg.data);
       const m = SYSTEM.msgs.symbolize(msg, true);
       SYSTEM.msgs.queue.push({ sender: this, data: m });
       if (!SYSTEM.msgs.isWaiting) {
         SYSTEM.msgs.isWaiting = true;
         setTimeout(function () {
           SYSTEM.msgs.runQueue();
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
       const isBrowser = typeof window !== 'undefined';
       const body = 'const SYSTEM = ' + SYSTEM.msgs.stringify(SYSTEM) + ';\n' +
                    'SYSTEM.msgs.isChild = true;\n' +
                    'SYSTEM.msgs.handlers = [];\n' +
                    (isBrowser ? 'this.onmessage = SYSTEM.msgs.onMsg;\n'
                               : 'process.on("message", SYSTEM.msgs.onMsg);\n') +
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
       isBrowser ? (this.thread.onmessage = SYSTEM.msgs.onMsg)
                 : this.thread.on('message', SYSTEM.msgs.onMsg);
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
     const wrap = /^[^\{]+\{|\}(\.bind\(.*\))?$/g;
     return new SYSTEM.msgs.Thread(fn.toString().replace(wrap, '').trim());
   },

   // Specifies what to do when a message comes in
   receive: function (fn) {
     SYSTEM.msgs.handlers.push(fn);
   },

   // Kills a process
   kill: function (thread) {
     thread.isBrowser ? thread.thread.terminate() : thread.thread.kill('SIGINT') ;
   },

   // Should be like send(msg)
   reply: function (msg) {
     const m = SYSTEM.msgs.symbolize(msg, false);
     return SYSTEM.msgs.isBrowser ? postMessage(m) : process.send(m) ;
   },

   // Should be like send(thread, msg)
   send: function (thread, msg) {
     const m = SYSTEM.msgs.symbolize(msg, false);
     SYSTEM.msgs.isBrowser ? thread.thread.postMessage(m) : thread.thread.send(m);
   }

   /********************************
    * End message passing stuff
    ********************************/
};





// export default SYSTEM;
module.exports = SYSTEM;
