'use strict';

var _utils = require('../utils');

/*
 * Loop over all nodes in the program body and call
 * compile for each one. Make sure we have a shared string
 * to contain the output.
 */
(0, _utils.compile)(_utils.nodes.ProgramNode, function () {
  var newBody = (0, _utils.groupPolymorphs)(this.body);
  this.shared.output = '';
  this.shared.insertSemis = true; // Turn this off when we're going to manually handle it
  this.shared.refs = -1;
  this.shared.lookups = -1;
  this.shared.prevLookup = '';
  this.shared.disableLookupResets = false;
  newBody.forEach(function (node) {
    try {
      node.compile();
    } catch (err) {
      console.log('Error: Could not compile ' + (node.type ? node.type : 'node ' + JSON.stringify(node)));
      throw err;
    }
  });
  return '';
});