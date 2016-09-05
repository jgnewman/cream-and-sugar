'use strict';

var _utils = require('../utils');

/**
 * Takes an array of function parameter nodes and creates
 * patterns we can match against.
 *
 * @param  {Array} args  A list of parameter nodes.
 *
 * @return {Array}       [["Arr", "[]"], ["Identifier", "foo"], ["Cons", "[h|t]"]]
 */
function getPatterns(args) {
  return args.map(function (arg) {
    var realArg = arg.type === 'Wrap' ? arg.item : arg;
    return [realArg.type, realArg.src];
  });
}

/**
 * Since arguments can take so many forms, we need a way to convert those
 * into usable values within JavaScript. We do that by creating a variable
 * for each identifer we find in the parameter set.
 *
 * @param  {Array}  patterns  The result of calling `getPatterns`
 *
 * @return {String}           A compiled string of variables.
 */
function compileArgs(patterns) {
  var acc = [];
  var patts = typeof patterns === 'string' ? JSON.parse(patterns) : patterns;
  patts.forEach(function (pattern, index) {
    switch (pattern[0]) {
      case 'Identifier':
        pattern[1] !== '_' && acc.push('const ' + pattern[1] + ' = args[' + index + '];');
        break;
      case 'Cons':
        acc.push('const ' + pattern[1].match(/^\[(.+)\|/)[1] + ' = args[' + index + '][0];');
        acc.push('const ' + pattern[1].match(/\|([^\]]+)\]/)[1] + ' = args[' + index + '].slice(1);');
        break;
    }
  });
  return acc.join('\n');
}

/**
 * Force all functions in a polymorphic function list to have the same
 * name and same arrow binding.
 *
 * @param  {Arrary} fnList  A list of Fun nodes.
 * @return {Object}         Contains the common name and binding value.
 */
function sanitizeFnMeta(fnList) {
  var name = fnList[0].preArrow.type === 'FunctionCall' ? fnList[0].preArrow.fn.compile(true) : null;
  var bind = fnList[0].bind;
  var errText = function errText(loc) {
    return '\nERROR compiling Polymorph node between ' + loc.start.line + ':' + loc.start.column + ' and ' + loc.end.line + ':' + loc.end.column + '.\n';
  };
  fnList.slice(1).forEach(function (fn) {
    var localName = void 0;
    if (name && (fn.preArrow.type !== 'FunctionCall' || (localName = fn.preArrow.fn.compile(true)) !== name)) {
      console.log(errText(fn.loc));
      console.log('Problem: "Function names do not match. (' + name + ' vs ' + localName + ')"\n');
      console.log(new Error().stack);
      process.exit(1);
    } else if (fn.bind !== bind) {
      console.log(errText(fn.loc));
      console.log('Problem: "Arrow bindings do not match."\n');
      console.log(new Error().stack);
      process.exit(1);
    }
  });
  return { name: name, bind: bind, anon: fnList[0].preArrow.type !== 'FunctionCall' };
}

/*
 * Handle format of basic functions.
 */
(0, _utils.compile)(_utils.nodes.FunNode, function () {
  var preFn = this.preArrow.type === 'FunctionCall';
  var args = compileArgs(getPatterns(preFn ? this.preArrow.args.items : this.preArrow.items));
  var prefix = preFn ? this.preArrow.fn.compile(true) + ' ()' : '()';
  this.shared.lib.add('args');
  return 'function ' + prefix + ' {\n    const args = SYSTEM.args(arguments);\n    ' + args + '\n    ' + (0, _utils.compileBody)(this.body) + ';\n  }' + (this.bind ? '.bind(this)' : '');
});

/*
 * Handle format of polymorphic functions.
 */
(0, _utils.compile)(_utils.nodes.PolymorphNode, function () {
  var meta = sanitizeFnMeta(this.fns);
  var prefix = meta.anon ? '()' : meta.name + ' ()';
  var compiledFns = this.fns.map(function (fn, index) {
    var args = meta.anon ? fn.preArrow.items : fn.preArrow.args.items;
    var pattern = JSON.stringify(getPatterns(args));
    var keyword = index === 0 ? 'if' : 'else if';
    return keyword + ' (args.length === ' + args.length + ' && SYSTEM.match(args, ' + pattern + ')) {\n      ' + compileArgs(pattern) + '\n      ' + (0, _utils.compileBody)(fn.body) + ';\n    }';
  }).join(' ');
  this.shared.lib.add('match');
  this.shared.lib.add('eql'); // necessary to run match
  this.shared.lib.add('args');
  this.shared.lib.add('noMatch');
  return 'function ' + prefix + ' {\n    const args = SYSTEM.args(arguments);\n    ' + compiledFns + ' else {\n      return SYSTEM.noMatch(\'' + (this.isNamed ? 'def' : 'match') + '\');\n    }\n  }' + (meta.anon && meta.bind ? '.bind(this)' : '');
});