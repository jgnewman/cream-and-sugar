---
layout: reference
title: Logic & Infix Operations
subhead: Familiar Forms in Some New Flavors
---

{{#markdown}}
{{{{raw}}}}

```
# Infix operations take this form
a OPERATOR b
```

Most of what you'll do in C&S will take the form of a function call. However, like in most languages, There are some quick operations you can perform and comparisons you can make outside of function call syntax using infix operators.

Let's start with basic math:

```
3 + 2 #=> 5
3 - 2 #=> 1
3 * 2 #=> 6
3 / 2 #=> 1.5
3 % 2 #=> 1
```

- Addition is performed with the `+` operator.
- Subtraction is performed with the `-` operator.
- Multiplication is performed with the `*` operator.
- Basic division is performed in two ways –
  - To get a rounded float, use the `/` operator.
  - To get the a remainder, use the `%` operator.

You will also use infix operators to perform comparisons:

```
3 is 3 #=> true
3 == 3 #=> true
3 isnt 2 #=> true
3 != 2 #=> true
```

- Equality is tested in two ways –
  - For strict equal comparison, use the `is` or `==` operators.
  - For strict unequal comparison, use the `isnt` or `!=` operators.

Note that C&S does not allow type coercive comparisons, equality checks are translated to JavaScript's `===` operator, while inequality checks are translated to `!==`.

```
3 lt 2 #=> false
3 gt 2 #=> true
3 lte 2 #=> false
3 gte 2 #=> true
```

- For a "<" comparison, use the `lt` operator.
- For a ">" comparison, use the `gt` operator.
- For a "<=" comparison, use the `lte` operator.
- For a ">=" comparison, use the `gte` operator.

C&S also includes friendly, readable operators for basic logic:

```
a and b
a or b
```

- The `and` operator returns true if both operands are truthy.
- The `or` operator returns true if either operand is truthy.

Note that `&&` and `||` are not logic operators in C&S.

Two other infix operators worthy of note are the cons and back cons operators.

```
1 >> [2, 3, 4] #=> [1, 2, 3, 4]
[1, 2, 3] << 4 #=> [1, 2, 3, 4]
```

- To add an item to the front of an array, use the `>>` operator.
- To add an item to the back of an array, use the `<<` operator.


{{{{/raw}}}}
{{/markdown}}
