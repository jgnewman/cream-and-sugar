---
layout: reference
title: Method Chaining
subhead: Clutter Reduction For the Win!
---

{{#markdown}}
{{{{raw}}}}

```
# JavaScript chaining
foo(a, b).bar(c, d).baz(e, f)

# Cream & Sugar's gross equivalent
(((foo a b).bar c d).baz e f)
```

In Cream & Sugar, function calls do not take parentheses. This departure from JavaScript syntax has pros and cons. One thing you may notice rather quickly is that method chaining is not quite so easy. While it can be accomplished using standard call syntax, it is much nicer to use C&S' chain syntax.

```
chain
  foo a, b
  bar c, d
  baz e, f
```

So instead of using all of those hard-to-parse parentheses, we can use the keyword `chain` followed by an indented block where each line constitutes a method chained off of the method before it.

```
chain
  $ '#some-dom-node'
  addClass 'foo'
  insertBefore '#some-other-node'

chain
  asyncCall _
  then  fn x => resolver x
  then  fn y => resolver y
  catch fn z => end z
```

This is especially nice for things like jQuery or `promise` syntax.

Because there are no dots in this syntax, there may be times when built-in function names or reserved words need to be used because they are method names on the object returned from the previous item in the chain. In cases like this, you might normally expect to get a compile or, even worse, a runtime error because the compiler translated out your method name for a bif by accident.

```
chain
  getObject _
  ~default 'some argument'

# Compiled output
getObject().default('some argument')
```

In all cases in Cream & Sugar you have the option of protecting a word from compiler translation by prefixing it with the `~`. The provided example uses `~default` in order to prevent the compiler from tripping up on the fact that `default` is normally a reserved word.


{{{{/raw}}}}
{{/markdown}}