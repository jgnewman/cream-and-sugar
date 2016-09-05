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
SYSTEM.createElement = function createElement(type, attrs, body) {
    var react = void 0;
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
  };
SYSTEM.dom = function dom(selector) {
    return document.querySelector(selector);
  }
const React = require('react');
const ReactDOM = require('react-dom');
const Title = React.createClass({ factorial: function () {
    const args = SYSTEM.args(arguments);
    if (args.length === 1 && SYSTEM.match(args, [["Number","0"]])) {
      
      return 1;
    } else if (args.length === 1 && SYSTEM.match(args, [["Identifier","n"]])) {
      const n = args[0];
      return n * this.factorial(n - 1);
    } else {
      return SYSTEM.noMatch('match');
    }
  }, render: function () {
    const args = SYSTEM.args(arguments);
    
    return SYSTEM.createElement("h1", {}, [
'Hello, friends. The factorial of 5 is ',
this.factorial(5)
]);
  } });
ReactDOM.render(SYSTEM.createElement(Title, {}, []), SYSTEM.dom('#app'));
