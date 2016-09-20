var CNS_SYSTEM = typeof CNS_SYSTEM !== "undefined" ? CNS_SYSTEM : {};

    if      (typeof global !== "undefined") { global.CNS_SYSTEM = CNS_SYSTEM }
    else if (typeof window !== "undefined") { window.CNS_SYSTEM = CNS_SYSTEM }
    else if (typeof self   !== "undefined") { self.CNS_SYSTEM = CNS_SYSTEM   }
    else { this.CNS_SYSTEM = CNS_SYSTEM }

  
//**END LIBRARY**//
CNS_SYSTEM.match = CNS_SYSTEM.match || function (args, pattern) {
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
  };
CNS_SYSTEM.eql = CNS_SYSTEM.eql || function (a, b) {
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
  };
CNS_SYSTEM.args = CNS_SYSTEM.args || function (args) {
    const out = [];
    Array.prototype.push.apply(out, args);
    return out;
  };
CNS_SYSTEM.noMatch = CNS_SYSTEM.noMatch || function (type) {
    throw new Error('No match found for ' + type + ' statement.');
  };
CNS_SYSTEM.createElement = CNS_SYSTEM.createElement || function (type, attrs, body) {
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
  };
CNS_SYSTEM.dom = CNS_SYSTEM.dom || function (selector) {
    return document.querySelector(selector);
  };

const React = require('react');
const ReactDOM = require('react-dom');
const Title = React.createClass({ factorial: function () {
    const args = CNS_SYSTEM.args(arguments);
    if (args.length === 1 && CNS_SYSTEM.match(args, [["Number","0"]])) {
      
      return 1;
    } else if (args.length === 1 && CNS_SYSTEM.match(args, [["Identifier","n"]])) {
      const n = args[0];
      return n * this.factorial(n - 1);
    } else {
      return CNS_SYSTEM.noMatch('match');
    }
  }, render: function () {
    const args = CNS_SYSTEM.args(arguments);
    
    return CNS_SYSTEM.createElement("h1", {}, [
'Hello, friends. The factorial of 5 is ',
this.factorial(5)
]);
  } });
ReactDOM.render(CNS_SYSTEM.createElement(Title, {}, []), CNS_SYSTEM.dom('#app'));
