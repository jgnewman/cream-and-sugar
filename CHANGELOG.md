0.7.0
=====

Shipped on 12.08.2016

### Feature

- Added keywords `not` and `no` as synonyms for `!`
- Syntax has been made more flexible allowing you to include expressions that require indentation as arguments to a function call without having to use parentheses.


0.6.9
=====

Shipped on 12.06.2016

### Fix

- In relation to the change shipped in 0.6.8, we won't error anymore on a phrase like `foo?` if `foo` is undefined.


0.6.8
=====

Shipped on 12.06.2016

### Change

- Change the way we do conditional lookups that end with a question mark such as `foo.bar?`. In this case, the resulting compiled code will return either true or false, rather than true or undefined.


0.6.7
=====

Shipped on 12.05.2016

### Fix

- Fix a problem with regex where we weren't properly capturing expressions that contained "/" characters.


0.6.6
=====

Shipped on 12.03.2016

### Fix

- Fix a problem with new object syntax as released in 0.6.5.

0.6.5
=====

Shipped on 12.03.2016

### Feature

- New "cons" syntax for objects. Example: `{foo: bar} <- {baz: quux}`
- Upgrade to cns-lib 0.4.7 containing support for object consing.


0.6.4
=====

Shipped on 11.30.2016

### Under the Hood

- Be more literal with compilation of backtick strings. Instead of passing these on as ES6 backtick strings, they are now compiled into pieces joined with the `+` operator in order to be more compatible with different environments and processors like uglify.


0.6.3
=====

Shipped on 11.30.2016

### Feature

- Upgraded collection syntax allows you to optionally omit commas when each item in the collection is placed on its own line.

### Under the Hood

- Updated docs.
- Remove old syntax reference file.
- Fix a bug with background images in docs.
- Fix a couple bugs with the Gulp dev environment for docs.


0.6.2
=====

Shipped on 11.29.2016

### Feature

- Upgrade to cns-lib 0.4.6 containing...
  - Support for function caching;
  - Safeguards against the reserved trailing underscore when working with objects.
- Upgraded chaining syntax using `?` mimics CoffeeScript. For example: `foo?.bar?.baz`.

### Under the Hood

- cns-lib 0.4.6 contains various optimizations for bifs.
- Updated docs.


0.6.1
=====

Shipped on 11.27.2016

### Fix

- Update to cns-lib 0.4.3 containing...
  - Fix for CreamML where it wasn't properly handling `htmlFor`;

### Feature

- New bif `dangerouslyMutate` allowing you to mutate existing objects where necessary such as in `dangerouslyMutate 'href', '/example', location`

### Change

- `when` and `caseof` no longer deliberately error if arrows are used in multiline conditional bodies.

### Under the Hood

- "JSX-like" syntax is currently being officially called CreamML.
- Launch the new docs site v1


0.6.0
=====

Shipped on 11.23.2016

#### Thanksgiving Update!

### Feature

- New `chain` syntax allows method chaining. See docs.
- New `~` symbol protects reserved references and bif references from compiler checks and translations.

### Change

- Solidified indentation rules for consistency. Any time there is an indent **ANYWHERE** there must be an accompanying dedent. This includes within objects and JSX-like notation.
- Qualifier syntax has changed. Keyword `then` was replaced with `do` for syntactical consistencys.
  - `if ... do ... else ...`
  - `for ... in ... do ... onlyif ...`
  - `incase ... throws ... do ...`
- TryCatch syntax has changed. Keyword `catch` was replaced with `default`.

### Under the Hood

- Finally updated docs.
- Fixed a couple mistakes in the README.
- Updated tests.
- Cleaner grammar handles indentation better.


0.5.0
=====

Shipped on 11.21.2016

### Fix

- Upgrade to cns-lib 0.4.1 containing...
  - a fix that allows `update` to be called on function objects;
  - a fix for `lead` and `tail` where they weren't outputting tuples when called on tuples.
- Fix a bug where you couldn't call functions like `(foo 'bar') 'baz'`.
- Fix a parsing bug having to do with indentation in nested objects and arrays.
- Fix a bug where the `get` bif was undefined.
- Fix a bug where comments inside collections would sometimes trigger parse errors. **Note:** You are still not allowed to put block comments inside collections.
- Fix a bug where the `!` operator was being applied to an entire phrase after it rather than just the first term.
- Remove certain words showing as reserved: `def, end, cond, no`

### Feature

- You can now pattern match against strings.
- New syntax `:: fnName` will create a new function bound to the current context.
- "JSX-like" syntax now accepts parens as well as brackets, for example:  `<elem attr=(ident) />`.

### Under the Hood

- Add new tests


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
