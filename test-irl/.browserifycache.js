var CNS_ = typeof CNS_ !== "undefined" ? CNS_ : {};

    if      (typeof global !== "undefined") { global.CNS_ = CNS_ }
    else if (typeof window !== "undefined") { window.CNS_ = CNS_ }
    else if (typeof self   !== "undefined") { self.CNS_ = CNS_   }
    else { this.CNS_ = CNS_ }

  
//**END LIBRARY**//
CNS_.update = CNS_.update || function (keyOrIndex, val, collection) {
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
  };
CNS_.match = CNS_.match || function (args, pattern) {
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
  };
CNS_.eql = CNS_.eql || function (a, b) {
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
  };
CNS_.args = CNS_.args || function (args) {
    const out = [];
    Array.prototype.push.apply(out, args);
    return out;
  };
CNS_.createElement = CNS_.createElement || function (type, attrs, body) {
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
  };
CNS_.dom = CNS_.dom || function (selector) {
    return document.querySelector(selector);
  };

const React = require('react');
const ReactDOM = require('react-dom');



function reactify () {
    const args = CNS_.args(arguments);
    if (args.length === 1 && CNS_.match(args, [["Identifier","fnList"]])) {
      const fnList = args[0];
      return reactify(fnList, {});
    } else if (args.length === 2 && CNS_.match(args, [["Arr",[]],["Identifier","accum"]])) {
      const accum = args[1];
      return React.createClass(accum);
    } else if (args.length === 2 && CNS_.match(args, [["HeadTail",["hd","tl"]],["Identifier","accum"]])) {
      const hd = args[0][0];
const tl = args[0].slice(1);
const accum = args[1];
      return reactify(tl, CNS_.update(hd.name, hd, accum));
    } else {
      throw new Error('No match found for def statement.');
    }
  };


function factorial () {
    const args = CNS_.args(arguments);
    if (args.length === 1 && CNS_.match(args, [["Number","0"]])) {
      
      return 1;
    } else if (args.length === 1 && CNS_.match(args, [["Identifier","n"]])) {
      const n = args[0];
      return n * factorial(n - 1);
    } else {
      throw new Error('No match found for def statement.');
    }
  };

function render () {
  var ref0_ = this.props;
const calc = ref0_.calc;
return CNS_.createElement("h1", {}, [
`Hello, friends. The factorial of ${calc} is ${factorial(calc)}`
]);
};
const Title = reactify([factorial, render]);
ReactDOM.render(CNS_.createElement(Title, {calc: 5}, []), CNS_.dom('#app'));
