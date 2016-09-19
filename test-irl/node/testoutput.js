var SYSTEM = typeof SYSTEM !== "undefined" ? SYSTEM : {};
SYSTEM.match = SYSTEM.match || function (args, pattern) {
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
              return /^[\$_A-z][\$_A-z0-9]*$/.test(each) ? SYSTEM : JSON.parse(each);
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
  };
SYSTEM.eql = SYSTEM.eql || function (a, b) {
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
  };
SYSTEM.args = SYSTEM.args || function (args) {
    const out = [];
    Array.prototype.push.apply(out, args);
    return out;
  };
SYSTEM.noMatch = SYSTEM.noMatch || function (type) {
    throw new Error('No match found for ' + type + ' statement.');
  };
SYSTEM.exp = SYSTEM.exp || (function () {
    var exp = (typeof module === 'undefined' || !module.exports) ? this : module.exports;
    return function (name, val) {
      exp[name] = val;
    };
  }());
SYSTEM.aritize = SYSTEM.aritize || function (fun, arity) {
    return function () {
      if (arguments.length === arity) {
        return fun.apply(undefined, arguments);
      } else {
        throw new Error('Function ' + (fun.name || '') + ' called with wrong arity. Expected ' + arity + ' got ' + arguments.length + '.');
      }
    };
  };


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
