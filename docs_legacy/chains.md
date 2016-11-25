# Cream & Sugar Method Chaining

In Cream & Sugar, function calls do not take parentheses. This departure from JavaScript syntax has pros and cons. One thing you may notice rather quickly is that method chaining (syntax like `foo(a, b).bar(c, d).baz(e, f)`) is not quite so easy. While it can be accomplished using standard call syntax, it is much nicer to use CnS' chain syntax.

So instead of this:

```coffeescript
(((foo a b).bar c d).baz e f)
```

We can do this:

```coffeescript
chain
  foo a b
  bar c d
  baz e f
```

This is especially nice for things like jQuery or `promise` syntax:

```coffeescript
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

Because there are no dots in this syntax, there may be times when built-in function names or reserved words need to be used because they are method names on the object returned from the previous item in the chain. In cases like this, you might normally expect to get a compile or, even worse, a runtime error because the compiler translated out your method name for a bif by accident.

In all cases in Cream & Sugar you have the option of protecting a word from compiler translation by prefixing it with the `~`. So, to illustrate, whereas the following will throw an error...

```coffeescript
chain
  getObject _
  default 'some argument'

#=> ERROR! Not expecting keyword "default" in this context.
```

...you can prevent the error like this:

```coffeescript
chain
  getObject _
  ~default 'some argument'
```

This, of course, will be compiled to `getObject().default('some argument')`.

[<- Back to the overview](overview.md)
