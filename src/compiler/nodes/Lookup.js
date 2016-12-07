import { compile, nodes } from '../utils';

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
compile(nodes.LookupNode, function () {
  if (this.hasQuestion) {

    const resetsDisabled = this.shared.disableLookupResets;
    if (!resetsDisabled) {
      this.shared.lookups = -1;
      this.shared.prevLookup = '';
      this.shared.disableLookupResets = true;
    }

    const refNum       = this.shared.lookups += 1;
    const lookupName   = `ref${refNum}_`;          // ref1_
    const prevLookup   = this.shared.prevLookup;   // ref0_
    const compiledLeft = this.left.compile(true);  // foo

    // In order to avoid errors in something like `foo?` when foo is undefined, we'll insert
    // an extra undefined check. This variable determines the conditions under which we want to insert
    // that check.
    const shouldUseUndefCheck = refNum === 0 && this.left.type !== 'Wrap';

    this.shared.prevLookup = lookupName;

    const out = `(function () { `
              +    `var ${lookupName}; `
              +    (!shouldUseUndefCheck ? '' : `if (typeof ${compiledLeft} === 'undefined') { return ${this.right.type === null ? 'false' : 'void 0'} } `)
              +    `return (${lookupName} = ${prevLookup ? prevLookup + '.' : ''}${compiledLeft}) == null ? ${this.right.type === null ? 'false' : lookupName} : `
                   // Use == instead of === because we want to match both null and undefined -----^^
              +    (
                     this.right.type === 'Lookup'
                       ? `${this.right.compile(true)} `
                       : this.right.type === null
                         ? `true; `
                         : `${lookupName}.${this.right.compile(true)}; `
                   )
              + `}())`;

    if (!resetsDisabled) {
      this.shared.disableLookupResets = false;
    }

    return out;
  }
  return `${this.left.compile(true)}.${this.right.compile(true)}`;
});
