const SYSTEM = {};
SYSTEM.match = function match(args, pattern) {
    return args.every(function (arg, index) {
      var matchType = pattern[index][0];
      var matchVal = pattern[index][1];
      switch (matchType) {
        case 'Identifier':
          return true;
        case 'Number':
          return typeof arg === 'number' && arg === parseFloat(matchVal);
        case 'Arr':
          return Array.isArray(arg) && this.eql(arg, JSON.parse(matchVal));
        case 'Cons':
          return Array.isArray(arg);
        case 'Tuple':
          throw new Error('Can\'t currently match against tuple forms.');
        case 'Object':
          throw new Error('Can\'t currently match against object forms.');
        default:
          return false;
      }
    });
  };
SYSTEM.eql = function eql(a, b) {
    var _this = this;

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
  };
SYSTEM.args = function args(_args) {
    var out = [];
    Array.prototype.push.apply(out, _args);
    return out;
  };
SYSTEM.noMatch = function noMatch(type) {
    throw new Error('No match found for ' + type + ' statement.');
  };
SYSTEM.exp = (function () {
    var exp = (typeof module === 'undefined' || !module.exports) ? this : module.exports;
    return function (name, val) {
      exp[name] = val;
    };
  }());
SYSTEM.aritize = function aritize(fun, arity) {
    return function () {
      if (arguments.length === arity) {
        return fun.apply(undefined, arguments);
      } else {
        throw new Error('Function ' + (fun.name || '') + ' called with wrong arity. Expected ' + arity + ' got ' + arguments.length + '.');
      }
    };
  }

function factorial () {
    const args = SYSTEM.args(arguments);
    if (args.length === 1 && SYSTEM.match(args, [["Number","0"]])) {
      
      return 1;
    } else if (args.length === 1 && SYSTEM.match(args, [["Identifier","n"]])) {
      const n = args[0];
      return n * factorial(n - 1);
    } else {
      return SYSTEM.noMatch('def');
    }
  };
SYSTEM.exp("factorial", SYSTEM.aritize(factorial, 1));
