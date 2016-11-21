#! /usr/bin/env node

var compiler = require('./dist/index');
var fs = require('fs');

var compile = compiler.compile;
var compileCode = compiler.compileCode;

var args = parseArgs();

function parseArgs() {
  var out = {};
  var flagOn = false;

  typeof process !== 'undefined' &&
  Array.isArray(process.argv)    &&
  process.argv.forEach(function (arg) {
    if (arg[0] === '-') {
      flagOn = arg.slice(1);
    } else {
      if (flagOn) {
        out[flagOn] = arg;
        flagOn = false;
      }
    }
  });
  return out;
}

// If the file name to compile came in through the command line,
// compile it and write it out.
if (args.i) {
  compile(args.i, function (err, result) {
    if (err) {
      throw err;
    } else {
      if (args.o) {
        fs.writeFile(args.o, result, function (err) {
          if (err) throw err;
          console.log('Finished.');
        });
      } else {
        console.log(result);
      }
    }
  }, {finalize: true}); // Adds in library code and such
}

// Otherwise, export our compile functions so this can be required
// by other modules.
module.exports = {
  compile: compile,
  compileCode: compileCode
};
