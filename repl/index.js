import { compileCode } from '../src/compiler/compiler';
import CNS_ from 'cns-lib';
import colors from 'colors/safe';
import readline from 'readline';

// Determines how to display and evaluated piece of data.
// Takes the data and its context.
function translate(evalled, ctx) {
  switch (typeof evalled) {

    // For these basic types, just color them appropriately.
    case 'string':    return colors.green(evalled);
    case 'number':    return colors.yellow(evalled);
    case 'undefined': return colors.gray(evalled);

    // In the case of a function, spit out [Function: fnname]
    case 'function':
      if (!ctx.CNS_[evalled.name]) {
        return colors.cyan(`[Function: ${evalled.name || 'anonymous'}]`);
      } else {
        return colors.gray('undefined');
      }

    // In the default case, just spit out the value.
    default: return evalled;
  }
}

// The main function that reads, evaluates, prints, and loops
export default function go() {

  // Jump to the next event loop so we don't get mixed output from gulp.
  setTimeout(() => {

    // Spit out a welcome message
    console.log(colors.rainbow('\n-------------------------------'));
    console.log(colors.white(    '   Welcome to Cream & Sugar!'));
    console.log(colors.rainbow(  '-------------------------------\n'));
    console.log(colors.gray('\nThis is a limited REPL where not all functionality is included.\nIf you would like to contribute, please visit\nhttp://github.com/jgnewman/cream-and-sugar.\n'));

    // Reference the correct require function
    const ctx = global;
    ctx.require = module.require;
    ctx.CNS_ = CNS_;

    // Create a readline interface
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Begin by starting with an empty string that will accumulate code.
    let buffer = '';

    // Define what the prompt will look like.
    rl.setPrompt('> ');

    // Display the prompt to the user.
    rl.prompt();

    // When a line gets submitted
    rl.on('line', line => {
      const trimmed = line.trim();

      switch (trimmed) {

        // If the user gave us the clear command, clear out the buffer
        // and prompt again.
        case 'clear _':
          buffer = '';
          console.log(colors.gray('Input cleared.'));
          rl.prompt();
          break;

        // If the user gave us the exit command, exit the repl.
        case 'exit _':
        case 'e _':
          console.log(colors.gray('Exiting...'));
          rl.close();
          break;

        // In any other case, start the eval process.
        default:
          buffer += (line + '\n');

          // Try to compile the code, reset the buffer, and prompt again.
          try {
            const compiled = compileCode(buffer, null, {finalize: true}).replace(/^\s*var\s+CNS_\s+=[^\;]+;/, '');
            const evalled = eval.call(ctx, compiled);

            if (!/\/\/\*\*END LIBRARY\*\*\/\/\s*$/.test(compiled)) {
              console.log(translate(evalled, ctx));
            }
            buffer = '';

            rl.prompt();

          // If the code didn't compile, assume we need more to come on
          // subsequent lines.
          } catch (err) {

            if (!err.hash || err.hash.token !== 'NEWLINE') {
              console.log(colors.red(`${err}\n`));
              buffer = '';
              rl.prompt();

            } else {
              process.stdout.write(colors.gray('> '));
            }
          }
      }
    });
  });
}
