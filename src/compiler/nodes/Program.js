import { compile, nodes } from '../utils';

/*
 * Loop over all nodes in the program body and call
 * compile for each one. Make sure we have a shared string
 * to contain the output.
 */
compile(nodes.ProgramNode, function () {
  this.shared.output = '';
  this.shared.lib = new Set();
  this.shared.insertSemis = true; // Turn this off when we're going to manually handle it
  this.body.forEach(node => {
    try {
      node.compile();
    } catch (err) {
      console.log(`Error: Could not compile ${node.type ? node.type : 'node ' + JSON.stringify(node)}`);
      throw err;
    }
  });
  return '';
});
