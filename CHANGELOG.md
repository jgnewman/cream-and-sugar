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
