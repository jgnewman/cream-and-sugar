export default {

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
      var matchType = pattern[index][0];
      var matchVal  = pattern[index][1];
      switch (matchType) {
        case 'Identifier': return true;
        case 'Number': return typeof arg === 'number' && arg === parseFloat(matchVal);
        case 'Arr': return Array.isArray(arg) && this.eql(arg, JSON.parse(matchVal));
        case 'Cons': return Array.isArray(arg);
        case 'Tuple': throw new Error(`Can't currently match against tuple forms.`);
        case 'Object': throw new Error(`Can't currently match against object forms.`);
        default: return false;
      }
    });
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
  typeof: function (val) {
    const type = typeof val;
    switch (type) {
      case 'number': return isNaN(val) ? 'nan' : type;
      case 'object': return val === null ? 'null' :
                              Array.isArray(val) ? 'array' :
                                val instanceof Date ? 'date' :
                                  val instanceof RegExp ? 'regexp':
                                    val instanceof HTMLElement ? 'htmlelement' :
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
      return collection.slice()[keyOrIndex] = val;
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
    let react;
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
        return fun(...arguments);
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
  }
};
