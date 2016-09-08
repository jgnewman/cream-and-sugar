import { compile, nodes, compileBody } from '../utils';

/**
 * Takes an array of function parameter nodes and creates
 * patterns we can match against.
 *
 * @param  {Array} args  A list of parameter nodes.
 *
 * @return {Array}       [["Arr", "[]"], ["Identifier", "foo"], ["Cons", "[h|t]"]]
 */
function getPatterns(args) {
  return args.map(arg => {
    const realArg = arg.type === 'Wrap' ? arg.item : arg ;
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
  const acc = [];
  const patts = typeof patterns === 'string' ? JSON.parse(patterns) : patterns;
  patts.forEach((pattern, index) => {
    switch (pattern[0]) {
      case 'Identifier':
        pattern[1] !== '_' && acc.push(`const ${pattern[1]} = args[${index}];`);
        break;
      case 'Cons':
        const headMatch = pattern[1].match(/^\[(.+)\|/)[1];
        const tailMatch = pattern[1].match(/\|([^\]]+)\]/)[1];
        headMatch !== '_' && acc.push(`const ${headMatch} = args[${index}][0];`);
        tailMatch !== '_' && acc.push(`const ${tailMatch} = args[${index}].slice(1);`);
        break;
      case 'Arr':
        // This will come back to haunt us if the user tries to match against a string with a comma or space in it.
        const items = pattern[1].replace(/^\[|\s+|\]$/g, '').split(',');
        items.forEach((item, i) => {
          if (item && item !== '_' && /^[\$_A-z][\$_A-z0-9]*$/.test(item)) {
            acc.push(`const ${item} = args[${index}][${i}];`);
          }
        });
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
  const name = fnList[0].preArrow.type === 'FunctionCall' ? fnList[0].preArrow.fn.compile(true) : null;
  const bind = fnList[0].bind;
  const errText = loc => {
    return `\nERROR compiling Polymorph node between ${loc.start.line}:${loc.start.column} and ${loc.end.line}:${loc.end.column}.\n`;
  };
  fnList.slice(1).forEach(fn => {
    let localName;
    if (name && (fn.preArrow.type !== 'FunctionCall' || (localName = fn.preArrow.fn.compile(true)) !== name)) {
      console.log(errText(fn.loc));
      console.log(`Problem: "Function names do not match. (${name} vs ${localName})"\n`);
      console.log((new Error()).stack);
      process.exit(1);
    } else if (fn.bind !== bind) {
      console.log(errText(fn.loc));
      console.log(`Problem: "Arrow bindings do not match."\n`);
      console.log((new Error()).stack);
      process.exit(1);
    }
  });
  return { name: name, bind: bind, anon: fnList[0].preArrow.type !== 'FunctionCall' };
}

/*
 * Handle format of basic functions.
 */
compile(nodes.FunNode, function () {
  const preFn  = this.preArrow.type === 'FunctionCall';
  const args   = compileArgs(getPatterns(preFn ? this.preArrow.args.items : this.preArrow.items));
  const prefix = preFn ? `${this.preArrow.fn.compile(true)} ()` : `()`;
  this.shared.lib.add('args');
  return `function ${prefix} {
    const args = SYSTEM.args(arguments);
    ${args}
    ${compileBody(this.body)};
  }${this.bind ? '.bind(this)' : ''}`;
});

/*
 * Handle format of polymorphic functions.
 */
compile(nodes.PolymorphNode, function () {

  // Force name and binding consistency, get name, binding, and whether this is anonymous
  const meta = sanitizeFnMeta(this.fns);

  // Determine whether we call this 'function foo()' or 'function ()'
  const prefix = meta.anon ? '()' : `${meta.name} ()`;

  // Create a place to store common patterns and the order they appear in
  const patterns = {};
  const patternOrder = [];

  // Loop over all of our function bodies. Group all bodies with the same
  // pattern but different guards together. For each one, create an object
  // containing args, the guard, and the body, all compiled.
  this.fns.map((fn, index) => {

    // Isolate the array containing the parameter items
    const args = meta.anon ? fn.preArrow.items : fn.preArrow.args.items;

    // Create a list of pattern matches like [["Identifier", "foo"], ...]
    const pattern = JSON.stringify(getPatterns(args));

    // Create a group for bodies of a similar pattern.
    patterns[pattern] = patterns[pattern] || [];

    // Track the order that this pattern appeared in by storing the
    // pattern in an array.
    patternOrder.indexOf(pattern) === -1 && patternOrder.push(pattern);

    // Output a match object.
    patterns[pattern].push({
      args: args,
      guard: fn.guard ? fn.guard.compile(true) : fn.guard,
      body: compileBody(fn.body)
    });
  });

  // Loop over the patterns as they appear in order and compile a top-level
  // conditional statement for each function body within them.
  const compiledFns = patternOrder.map((pattern, index) => {

    // If this is the first body, drop in "if", otherwise use "else if"
    const keyword = index === 0 ? 'if' : 'else if';

    // Isolate the correct match object group. Each of these will compile to
    // a sub condition based on their guard.
    const matchObjs = patterns[pattern];

    // Generate an else case to use when we're finished with sub conditions.
    const elseCase = ` else {
      return SYSTEM.noMatch('${this.isNamed ? 'def' : 'match'}');
    }`;

    let subBodies;

    // If we don't need sub conditions, just spit out the body.
    if (matchObjs.length === 1 && !matchObjs[0].guard) {
      subBodies = matchObjs[0].body + ';'

    // Otherwise...
    } else {
      let needsElse = true;

      // Create our subconditions by looping over each match object and
      // spitting out the associated body under a conditional statement that
      // checks the associated guard.
      subBodies = matchObjs.map((obj, subIndex) => {

        // Determine whether to use "if" or "else if"
        let subKey = subIndex === 0 ? 'if ' : 'else if ';
        let condition;

        // If we're on the last body in this group and it doesn't
        // have a guard, we can use it as the else case.
        if (!obj.guard && subIndex === matchObjs.length - 1) {
          needsElse = false;
          subKey = 'else';
          condition = '';

        // Otherwise, define the conditional express to be used
        } else {
          condition = `(${!obj.guard ? 'true' : obj.guard})`;
        }

        // Spit out the subcondition and drop in an else case if needed
        return `${subKey}${condition} {
          ${obj.body};
        }${subIndex === matchObjs.length - 1 && needsElse ? elseCase : ''}`;
      }).join(' ');
    }

    // Spit out the top-level condition based on precompiled information
    return `${keyword} (args.length === ${matchObjs[0].args.length} && SYSTEM.match(args, ${pattern})) {
      ${compileArgs(pattern)}
      ${subBodies}
    }`;
  }).join(' ');

  // Add appropriate library functions
  this.shared.lib.add('match');
  this.shared.lib.add('eql'); // necessary to run match
  this.shared.lib.add('args');
  this.shared.lib.add('noMatch');

  // Spit out the top-level function string. Within it, drop in the
  // conditions for different function bodies and add an else case for
  // no match at the end.
  return `function ${prefix} {
    const args = SYSTEM.args(arguments);
    ${compiledFns} else {
      return SYSTEM.noMatch('${this.isNamed ? 'def' : 'match'}');
    }
  }${meta.anon && meta.bind ? '.bind(this)' : ''}`;
});
