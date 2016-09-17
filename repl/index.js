import { compileCode } from '../src/compiler/compiler';
import colors from 'colors/safe';
import readline from 'readline';

function translate(evalled, ctx) {
  switch (typeof evalled) {
    case 'string':    return colors.green(evalled);
    case 'number':    return colors.yellow(evalled);
    case 'undefined': return colors.gray(evalled);
    case 'function':
      if (!ctx.SYSTEM[evalled.name]) {
        return colors.cyan(`[Function: ${evalled.name || 'Anonymous'}]`);
      } else {
        return colors.gray('undefined');
      }
    default: return evalled;
  }
}

export default function go() {
  setTimeout(() => {
    console.log(colors.rainbow('\n-------------------------------'));
    console.log(colors.white(    '   Welcome to Cream & Sugar!'));
    console.log(colors.rainbow(  '-------------------------------\n'));

    const ctx = global;
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    let buffer = '';

    rl.setPrompt('> ');

    rl.prompt();

    rl.on('line', line => {
      buffer += (line + '\n');

      try {
        const compiled = compileCode(buffer, null, {finalize: true});
        const evalled = eval.call(ctx, compiled);

        console.log(translate(evalled, ctx));
        buffer = '';

        rl.prompt();

      } catch (err) {

        if (!err.hash || err.hash.token !== 'EOF') {
          console.log(colors.red(`${err}\n`));
          buffer = '';
          rl.prompt();

        } else {
          process.stdout.write('... ');
        }
      }
    });
  });
}
