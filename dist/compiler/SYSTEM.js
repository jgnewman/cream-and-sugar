'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var SYSTEM = {

  // SYSTEM.qualify(x === 4, function () { return doSomething() })
  qualify: function qualify(condition, callback, elseCase) {
    return condition ? callback() : elseCase ? elseCase() : undefined;
  },

  // SYSTEM.noMatch('cond')
  noMatch: function noMatch(type) {
    throw new Error('No match found for ' + type + ' statement.');
  },

  // SYSTEM.eql([1, 2, 3], [1, 2, 3]) -> true
  eql: function eql(a, b) {
    var _this = this;

    if (a === SYSTEM || b === SYSTEM) return true; // <- Hack to force a match
    if (a === b || typeof a === 'number' && typeof b === 'number' && isNaN(a) && isNaN(b)) return true;
    if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) !== (typeof b === 'undefined' ? 'undefined' : _typeof(b))) return false;
    if ((typeof a === 'undefined' ? 'undefined' : _typeof(a)) === 'object') {
      if (Array.isArray(a)) return a.every(function (item, index) {
        return _this.eql(item, b[index]);
      });
      var ks = Object.keys,
          ak = ks(a),
          bk = ks(b);
      if (!this.eql(ak, bk)) return false;
      return ak.every(function (key) {
        return _this.eql(a[key], b[key]);
      });
    }
    return false;
  },

  // SYSTEM.match(args, [['Identifier', 'x']])
  match: function match(args, pattern) {
    return args.every(function (arg, index) {
      if (!pattern[index]) return false;
      var matchType = pattern[index][0];
      var matchVal = pattern[index][1];
      switch (matchType) {
        case 'Identifier':
          return true;
        case 'Number':
          return typeof arg === 'number' && arg === parseFloat(matchVal);
        case 'Cons':case 'BackCons':
          return Array.isArray(arg);
        case 'Arr':
          if (Array.isArray(arg)) {
            var eqlTestStr = matchVal.replace(/^\[|\s+|\]$/g, '');
            var eqlTest = !eqlTestStr.length ? [] : eqlTestStr.split(',').map(function (each) {
              if (each === 'null') return null;
              if (each === 'undefined') return undefined;
              if (each === 'NaN') return NaN;
              return (/^[\$_A-z][\$_A-z0-9]*$/.test(each) ? SYSTEM : JSON.parse(each)
              );
            });
            return this.eql(arg, eqlTest);
          }
          return false;
        case 'Tuple':
          throw new Error('Can\'t currently match against tuple forms.');
        case 'Object':
          throw new Error('Can\'t currently match against object forms.');
        default:
          return false;
      }
    }.bind(this));
  },

  // SYSTEM.args(arguments) -> [...arguments]
  args: function args(_args) {
    var out = [];
    Array.prototype.push.apply(out, _args);
    return out;
  },

  // SYSTEM.elem(0, [1, 2, 3, 4]) -> 1
  elem: function elem(item, collection) {
    return collection[item];
  },

  // SYSTEM.throw(create(Error))
  throw: function _throw(err) {
    throw err;
  },

  // SYSTEM.create(ClassName, arg1, arg2) -> ClassName { ... }
  create: function create(cls) {
    return new (Function.prototype.bind.apply(cls, arguments))();
  },

  // SYSTEM.typeof('hello') -> 'string'
  type: function type(val) {
    var type = typeof val === 'undefined' ? 'undefined' : _typeof(val);
    switch (type) {
      case 'symbol':
        return 'atom';
      case 'number':
        return isNaN(val) ? 'nan' : type;
      case 'object':
        return val === null ? 'null' : Array.isArray(val) ? 'array' : val instanceof Date ? 'date' : val instanceof RegExp ? 'regexp' : typeof HTMLElement !== 'undefined' && val instanceof HTMLElement ? 'htmlelement' : typeof Worker !== 'undefined' && val instanceof Worker || val.constructor.name === 'ChildProcess' && typeof val.pid === 'number' ? 'process' : type;
      default:
        return type;
    }
  },

  // SYSTEM.instanceof([], Object) -> true
  instanceof: function _instanceof(val, type) {
    return val instanceof type;
  },

  // SYSTEM.head([1, 2, 3]) -> 1
  head: function head(list) {
    return list[0];
  },

  // SYSTEM.tail([1, 2, 3]) -> [2, 3]
  tail: function tail(list) {
    return list.slice(1);
  },

  // SYSTEM.exp('myFn', function () { ... })
  exp: '(function () {\n    var exp = (typeof module === \'undefined\' || !module.exports) ? this : module.exports;\n    return function (name, val) {\n      exp[name] = val;\n    };\n  }())',

  // SYSTEM.assnCons([1, 2, 3], 'hd', 'tl')
  assnCons: function assnCons(list, hName, tName) {
    var out = {};
    out[hName] = list[0];
    out[tName] = list.slice(1);
    return out;
  },

  // SYSTEM.assnCons([1, 2, 3], 'hd', 'tl')
  assnBackCons: function assnBackCons(list, ldName, lstName) {
    var out = {};
    out[ldName] = list.slice(0, list.length - 1);
    out[lstName] = list[list.length - 1];
    return out;
  },

  // SYSTEM.random([1, 2, 3, 4]) -> 3
  random: function random(list) {
    return list[Math.floor(Math.random() * list.length)];
  },

  // SYSTEM.lead([1, 2, 3]) -> [1, 2]
  lead: function lead(list) {
    return list.slice(0, list.length - 1);
  },

  // SYSTEM.last([1, 2, 3]) -> 3
  last: function last(list) {
    return list[list.length - 1];
  },

  // SYSTEM.do(function () { ... }, [1, 2, 3])
  do: function _do(fn) {
    var args = Array.prototype.slice.call(arguments, 1);
    return args.length ? fn.apply(null, args) : fn();
  },

  // SYSTEM.update('name', 'john', {name: 'bill'}) -> {name: 'john'}
  // SYSTEM.update(1, 'x', ['a', 'b', 'c']) -> ['a', 'x', 'c']
  update: function update(keyOrIndex, val, collection) {
    if (Array.isArray(collection)) {
      var newSlice = collection.slice();
      newSlice[keyOrIndex] = val;
      return newSlice;
    } else if (typeof HTMLElement !== 'undefined' && collection instanceof HTMLElement) {
      var clone = collection.cloneNode();
      clone[keyOrIndex] = val;
      return clone;
    } else {
      var replacer = {};
      replacer[keyOrIndex] = val;
      return Object.assign({}, collection, replacer);
    }
  },

  // SYSTEM.remove(1, ['a', 'b', 'c']) -> ['a', 'b']
  // SYSTEM.remove('name', {name: 'john', age: 33}) -> {age: 33}
  remove: function remove(keyOrIndex, collection) {
    if (Array.isArray(collection)) {
      var splicer = collection.slice();
      splicer.splice(keyOrIndex, 1);
      return splicer;
    } else {
      var _ret = function () {
        var newObj = {};
        var keys = Object.keys(collection).concat(Object.getOwnPropertySymbols ? Object.getOwnPropertySymbols(collection) : []);
        keys.forEach(function (key) {
          keyOrIndex !== key && (newObj[key] = collection[key]);
        });
        return {
          v: newObj
        };
      }();

      if ((typeof _ret === 'undefined' ? 'undefined' : _typeof(_ret)) === "object") return _ret.v;
    }
  },

  // SYSTEM.createElement('div', {className: 'foo'}, [SYSTEM.createElement(...)])
  createElement: function createElement(type, attrs, body) {
    var react;
    var a = attrs || {},
        b = body || [];
    if (typeof React !== 'undefined') react = React;
    if (!react && typeof require !== 'undefined') react = require('React');
    if (react) return react.createElement(type, a, b);
    var elem = document.createElement(type);
    Object.keys(a).forEach(function (key) {
      var cleanKey = key === 'className' ? 'class' : key.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
      elem.setAttribute(cleanKey, a[key]);
    });
    b.forEach(function (node) {
      return elem.appendChild(node);
    });
    return elem;
  },

  // SYSTEM.aritize(fun, 2);
  aritize: function aritize(fun, arity) {
    return function () {
      if (arguments.length === arity) {
        return fun.apply(undefined, arguments);
      } else {
        throw new Error('Function ' + (fun.name || '') + ' called with wrong arity. Expected ' + arity + ' got ' + arguments.length + '.');
      }
    };
  },

  dom: function dom(selector) {
    return document.querySelector(selector);
  },

  domArray: function domArray(selector) {
    return Array.prototype.slice.call(document.querySelectorAll(selector));
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
    stringify: function stringify(obj) {
      if (typeof obj === 'function') {
        return obj.toString();
      } else if (typeof obj === 'string') {
        return obj;
      } else if (obj === true || obj === false) {
        return obj;
      } else if (Array.isArray(obj)) {
        return '[' + obj.map(function (item) {
          return SYSTEM.msgs.stringify(item);
        }).join(', ') + ']';
      } else {
        return '{' + Object.keys(obj).map(function (key) {
          return key + ':' + SYSTEM.msgs.stringify(obj[key]);
        }).join(',\n') + '}';
      }
    },

    symbolize: function symbolize(data, reSymbolize) {
      if (!reSymbolize && (typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'symbol') return '__' + data.toString() + '__';
      if (reSymbolize && typeof data === 'string' && /^__Symbol\(.+\)__$/.test(data)) {
        return Symbol.for(data.replace(/^__Symbol\(|\)__$/g, ''));
      }
      if (Array.isArray(data)) {
        return data.map(function (item) {
          return SYSTEM.msgs.symbolize(item, reSymbolize);
        });
      } else if ((typeof data === 'undefined' ? 'undefined' : _typeof(data)) === 'object' && data !== null) {
        var out = {};
        Object.keys(data).forEach(function (key) {
          out[key] = SYSTEM.msgs.symbolize(data[key], reSymbolize);
        });
        return out;
      }
      return data;
    },

    onMsg: function onMsg(msg) {
      SYSTEM.msgs.isBrowser && (msg = msg.data);
      var m = SYSTEM.msgs.symbolize(msg, true);
      SYSTEM.msgs.queue.push(m);
      if (!SYSTEM.msgs.isWaiting) {
        SYSTEM.msgs.isWaiting = true;
        setTimeout(function () {
          SYSTEM.msgs.runQueue();
        }, 0);
      }
    },

    runQueue: function runQueue() {
      this.queue.forEach(function (msgObj) {
        this.handlers.forEach(function (handler) {
          handler(msgObj);
        });
      }.bind(this));
      this.queue = [];
      this.isWaiting = false;
    },

    Thread: function Thread(fnBody) {
      var isBrowser = typeof window !== 'undefined';
      var body = 'const SYSTEM = ' + SYSTEM.msgs.stringify(SYSTEM) + ';\n' + 'SYSTEM.msgs.isChild = true;\n' + 'SYSTEM.msgs.handlers = [];\n' + (isBrowser ? 'this.onmessage = SYSTEM.msgs.onMsg;\n' : 'process.on("message", SYSTEM.msgs.onMsg);\n') + fnBody;
      this.isBrowser = isBrowser;
      this.thread = isBrowser ? new Worker(window.URL.createObjectURL(new Blob([body], { type: 'application/javascript' }))) : require('child_process').fork(null, [], {
        execPath: 'node',
        execArgv: ['-e', body]
      });
      isBrowser ? this.thread.onmessage = SYSTEM.msgs.onMsg : this.thread.on('message', SYSTEM.msgs.onMsg);
      !isBrowser && this.thread.on('exit', function () {
        console.log('process exited');
      });
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
  spawn: function spawn(fn) {
    var wrap = /^[^\{]+\{|\}(\.bind\(.*\))?$/g;
    return new SYSTEM.msgs.Thread(fn.toString().replace(wrap, '').trim());
  },

  // Specifies what to do when a message comes in
  receive: function receive(fn) {
    SYSTEM.msgs.handlers.push(fn);
  },

  // Kills a process
  kill: function kill(thread) {
    thread.isBrowser ? thread.thread.terminate() : thread.thread.kill('SIGINT');
  },

  // Should be like send(msg)
  reply: function reply(msg) {
    var m = SYSTEM.msgs.symbolize(msg, false);
    SYSTEM.msgs.isBrowser ? postMessage(m) : process.send(m);
  },

  // Should be like send(thread, msg)
  send: function send(thread, msg) {
    var m = SYSTEM.msgs.symbolize(msg, false);
    SYSTEM.msgs.isBrowser ? thread.thread.postMessage(m) : thread.thread.send(m);
  }

  /********************************
   * End message passing stuff
   ********************************/
};

// export default SYSTEM;
module.exports = SYSTEM;