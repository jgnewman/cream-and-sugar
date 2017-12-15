---
layout: reference
title: Conditions
subhead: Else Cases Required
---

{{#markdown}}
{{{{raw}}}}

Whereas in JavaScript, your standard `if` statement doesn't actually return a value, every type of conditional expression in C&S does.

There are a few ways to handle conditions, and we'll talk about each one here.

> In the coming examples we'll be using the infix operators `==` and `!=`. In C&S, these operators translate to `===` and `!==` respectively. You also have the option of writing them as `is` and `isnt`.

## Multi-Clause Conditions

```
myVar = 4

when
  myVar == 2 -> doSomething _
  myVar != 2 -> doSomethingElse _
```

The multi-clause condition is the most similar to JavaScript's `if`. It begins with the keyword `when`, followed by an indent and terminates with a dedent. Between these markers, you'll create your conditional clauses. Each one is comprised of a test condition, followed by an arrow, followed by a block of what to do if the condition was truthy. If that block needs to span multiple lines you will trade out the arrow for indentation. Here are a couple of examples:

In the provided `when` example, the first condition does not evaluate truthily and so `doSomething` is never executed. Instead, the second condition does evaluate truthily and so `doSomethingElse` is executed. Since this is the only statement in the block, the block returns the value of that statement and, consequently, the `when` expression itself returns the result of that block.

```
myVar = 4

when
  myVar == 4
    doSomething _
    doSomethingElse _
  true
    doThirdThing _
```

In this next `when` example, the first condition evaluates truthily and its block is executed. This time, the block contains multiple statements so we use indentation instead of an arrow. The block returns the result of the last statement executed and, consequently, the `when` expression returns the result of whichever block was executed.

<br/>
<br/>

```
myVar =
  when
    4 == 4 -> 'hello'
    4 != 4 -> 'goodbye'

myVar == 'hello'
#=> true
```

Because `when` statements return values, they can be assigned to variables.

Notice that there is no `else` statement as part of a `when` block. This is because Cream & Sugar is big on getting things to match up. You can use `true` as the condition of your final clause if you want to simulate an `else` case (as you saw in a previous example) but, really, it's better to be specific about what you're looking for. In the most recent example, the two conditions we used were `4 == 4` and `4 != 4`. This is good for the psychology of code readability and helps us quickly understand exactly what it is we are really looking for.

If a `when` expression is executed and none of the conditions are matched, you'll get an error. This helps to ensure that you're truly covering all your bases rather than having potentially accidental data simply flow through an `else` case.

## Case Switching

Similar to the `when` expression is the `caseof` expression. Like `when`, it returns a value. Unlike `when`, it makes use of JavaScript's `switch` statement under the hood. As such, it does have the equivalent of an "else" case in the form of a `default` clause. However, unlike JavaScript's `switch`, there are no case fall-throughs. Following is an example.

```
greeting = 'hello'

caseof greeting
  'hello' -> doSomething _
  'how are you?' -> doSomethingElse _
  default -> doThirdThing _
```

As you can see in this example, `caseof` is extremely similar to `when`. It is comprised of the keyword `caseof`, followed by some value to examine, followed by indentation, your various clauses, and finally a dedent. In each clause, we are testing the equality of our condition against our comparative value. If we find a match, that block is executed. If not, the `default` block is executed. If you don't include a `default` clause and no matches are found, you'll get an error.

Just like the `when` expression (and in fact almost everywhere in C&S), if one of your blocks needs to take up multiple lines, just try using indentation.

## Qualifiers

```
if food != gone do eat food

if food != gone do eat food else starve _
```

Qualifiers are a quick way to perform either a function call or an operation under a certain condition without requiring the verbosity of a `when` or `caseof` expression. It is only within the syntax of a qualifier expression that you will use the keywords `if` and `else`. Here are a few examples:

```
fs.writeFileSync './file', 'text', fn err, res ->
  if err do throw err
  doSomethingWith res
```

When using qualifiers, the `else` case is optional and, like all conditional expressions in C&S, qualifiers return values. If you include an `else` case, the qualifier expression will always return the result of whichever statement is executed. If you don't include an `else` case, the expression will return the result of the conditional action if it is executed or `undefined` if it is not. Unlike `when`, it will not throw an error.


{{{{/raw}}}}
{{/markdown}}
