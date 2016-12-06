'use strict';

var _utils = require('../utils');

/*
 * Compile . lookups 1-1.
 */

/*
foo?.bar?.baz

(function () {
  var ref0_;
  return (ref0_ = foo) == null ? ref0_ : (function () {
    var ref1_;
    return (ref1_ = ref0_.bar) == null ? ref1_ : ref1.baz;
  }())
}())
*/
(0, _utils.compile)(_utils.nodes.LookupNode, function () {
  if (this.hasQuestion) {

    var resetsDisabled = this.shared.disableLookupResets;
    if (!resetsDisabled) {
      this.shared.lookups = -1;
      this.shared.prevLookup = '';
      this.shared.disableLookupResets = true;
    }

    var lookupName = 'ref' + (this.shared.lookups += 1) + '_'; // ref1_
    var prevLookup = this.shared.prevLookup; // ref0_
    var compiledLeft = this.left.compile(true); // foo

    this.shared.prevLookup = lookupName;

    var out = '(function () { ' + ('var ' + lookupName + '; ') + ('return (' + lookupName + ' = ' + (prevLookup ? prevLookup + '.' : '') + compiledLeft + ') == null ? ' + (this.right.type === null ? 'false' : lookupName) + ' : ')
    // Use == instead of === because we want to match both null and undefined -----^^
    + (this.right.type === 'Lookup' ? this.right.compile(true) + ' ' : this.right.type === null ? 'true; ' : lookupName + '.' + this.right.compile(true) + '; ') + '}())';

    if (!resetsDisabled) {
      this.shared.disableLookupResets = false;
    }

    return out;
  }
  return this.left.compile(true) + '.' + this.right.compile(true);
});