---
layout: reference
title: Overview
subhead: What is Cream & Sugar Anyway?
---

{{#markdown}}

```
# create a basic factorial calculator
factorial 0 => 1
factorial n => n * factorial n - 1


# call the factorial function
factorial 5 #=> 120
```

Cream & Sugar (also called C&S) is a functional language that compiles to JavaScript. It has a couple of benefits over pure JavaScript as well as other "meta-JavaScript" dialects:

1. C&S has a beautiful, easy-to-read syntax inspired in part by Elixir and Haskell, but retaining all of JavaScript's familiar data forms.
2. C&S provides [JSX-like structures](/reference/creamml/) as part of the native syntax. And if you aren't using React, you can still use these structures to generate DOM elements.
3. C&S makes it extremely simple to spin up [child processes](/reference/processes/) in both Node.js and the browser as well as pass messages between them.
4. C&S implements all the best parts of functionalism including **immutable data**, **pattern matching**, **arity requirements**, and **recursion**, all in a forgiving way and with minimal performance overhead.

If this sounds interesting to you, we'd recommend reading on. Why not start with [data types](/reference/data-types/)?

{{/markdown}}
