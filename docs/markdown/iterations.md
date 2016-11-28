---
layout: reference
title: Iterations
subhead: Recursing with Style
---

{{#markdown}}
{{{{raw}}}}

Cream & Sugar does not include a classical expression for iteration. In other words, there is no `while` loop, no `for` loop, and no `do` loop. There are, however, many ways to iterate over a collection of items. The most important of these is recursion.

## Recursion

```
recur [] => undefined
recur [_|t] => recur t
```

In C&S, you will often want to perform an action once for each item in a list. Let's take a look at a simple way to do that using recursion. The provided example illustrates a completely useless function that takes an array and calls itself once for each item in the array.

Using this technique, you can loop forever, stop when you hit a particular value, keep looping as long as some condition is true, or whatever. All of the power of traditional iterative expressions is packed into recursion with pattern matching by default. It also encourages you to keep your functions smaller and more atomic.

That said, there are other ways to perform certain types of iterations in C&S. We'll cover those now.

## JavaScript Methods

```
[1, 2, 3].forEach fn => _
```

C&S has not been so heartless as to remove your ability to use the JavaScript methods you know and love. So, for example, instead of using the `recur` function we defined above, you could use `Array.forEach`.

## Array Comprehensions

```
for num in [1, 2, 3] do num + 1
#=> [2, 3, 4]


# Compiled JavaScript
[1, 2, 3].map(function (num) {
  return num + 1;
})
```

C&S also provides convenient array comprehensions. Comprehensions are a syntactical shortcut for building an array from another array. These are provided in much the same way that comprehensions in CoffeeScript are provided, but with a slightly more readable syntactical pattern.

A basic comprehension begins with the keyword `for`, followed by a variable list denoting item and index, the keyword `in`, an array, the keyword `do`, and finally some expression to execute using the variables defined.

```
for x, i in [1, 2, 3] do x onlyif i % 2 == 0
#=> [1, 3]
```

You also have the option of adding qualifiers to the end of your comprehensions.

This example collects all of the items in an array that have an even numbered index. Qualifiers are placed at the end of a comprehension and begin with the keyword `onlyif`. They will cause that any iteration that does not meet the condition of the qualifier will be skipped.

{{{{/raw}}}}
{{/markdown}}
