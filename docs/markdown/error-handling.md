---
layout: reference
title: Error Handling
subhead: Watch Out For Those Keywords!
---

{{#markdown}}
{{{{raw}}}}

```
try
  JSON.parse '{.}'
default err
  throw err
```

Cream & Sugar handles errors in a friendly and familiar way, using an expression that is very similar to JavaScript's try/catch statement. There are two main differences between the C&S version and the JavaScript version.

```
value1 =
  try
    2 + 2
  default err
    3 + 3

value1 #=> 4
```

1. Whereas JavaScript uses the keywords `try` and `catch`, C&S uses the keywords `try` and `default`. This decision was made for the purpose of keeping syntax cleaner in the future as we natively incorporate more of JavaScript's cutting-edge features.
2. C&S' try/default returns a value – either from the `try` block if it was successful or from the `default` block if it was not.

The try/default expression consists of the keyword `try`, followed by an indented block of code, the keyword `default` plus an error identifier, and another indented block of code.

```
incase JSON.parse '{.}' throws err do log err
```

C&S also provides a try/default shorthand that works much like a conditional qualifier, in case you don't need to execute large blocks of code.


{{{{/raw}}}}
{{/markdown}}
