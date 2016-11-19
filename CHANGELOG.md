0.4.1
=====

Shipped on 11.19.2016

### Fix

- Fixed `type` bif conflicting with html `type` property.
- Upgrade to cns-lib 0.3.3 containing a fix for the `key` property in react iterators and a renamed `type` bif.
- Fixed logic keywords as well as true, false, null, undefined, and NaN conflicting with identifiers in some instances.

### Change

- The `type` bif has been renamed `dataType`.

### Under the Hood

- Small test updates


0.4.0
=====

Shipped on 11.12.2016

### Fix

- The error message for lack of match in a pattern match function now reads "No match found for functional pattern match statement" instead of "...for def statement".

### Feature

- New bif `lang` allows you to set language runtime config options. For example, using `lang 'use.react', false` prevents using React.js when compiling JSX-like syntax.

### Change

- n/a

### Under the Hood

- Added CHANGELOG.md
- Removed syntaxtheory.txt and syntax.cns
- Removed TODO.md in favor of CHANGELOG.md
- Removed some unused matches from the grammar file and Jison lexer.
- Updated docs.
