# Cream & Sugar Functions

In CnS, there are a few different ways to create functions. However, the result of each technique is the same under the hood. You always end up with a first-class piece of data that can be executed and passed around just as you'd expect any function should.

Functions in CnS can be named or anonymous. They can also make use of pattern matching, even when they're technically anonymous. In fact, the whole concept of the function is a little bit different in CnS than in vanilla JavaScript because it's all about pattern matching.

In JavaScript, you create functions that takes arguments. In Cream & Sugar, you define syntactical patterns that stand in as shortcuts for larger blocks of code. This may seem like we're mincing words, but the shift in mindset is important to understanding functional programming. Consider the following recursive factorial calculator written in JavaScript:

```javascript
function factorial(n) {
  if (n === 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}
```

The mindset here is that we've created a function called `factorial` that takes a single argument (n). Within the function body, we examine `n` and perform different actions depending on the value of `n`.

Now consider the same function written in CnS:

```coffeescript
factorial 0 => 1
factorial n => n * factorial n - 1
```

In this case, `factorial 0` is a pattern that matches up with the value 1. When the language detects this pattern, it spits out 1. We also have another pattern (`factorial n`) that will be matched in the case that the user attempts to call the function with a single argument that is not 0. This pattern matches up with a function body that ends up calling `factorial` over and over again, subtracting 1 from its argument each time until the first pattern is matched and the recursion ends.

If you take a look at the CnS compiled output, you'll notice that, under the hood, we're still just building functions that do a conditional analysis of their arguments. However, getting yourself into the pattern match mindset will be very useful in terms of getting used to pattern matching as a tool for shortening your syntax and making your functions logically simpler.

And at this point, you should have a decent grasp on the first technique for defining functions in Cream & Sugar – using named patterns. But before we get into the details, let's talk about function calls.


## Function Calls

Function calls in CnS look like function calls in JavaScript, **minus** the parentheses. So, whereas in JavaScript you might write `foo(x, y)`, in CnS, you would write `foo x, y`. Arguments should still be separated by commas, however you will not surround them with parentheses. Instead, you will use parentheses to denote a function call taking another function call as an argument. For example, in JavaScript you might write `foo(bar(x), y)`, but in CnS you could write `foo (bar x), y`

If you need to call a function with no arguments, you will call it using the "empty identifier" `_` as follows: `foo _` which translates to `foo()` in JavaScript. In CnS, a lone underscore signifies either an un-needed parameter in pattern matches (more on that later) or an empty argument list in function calls.

Now let's talk about the different ways you can create functions.


## Named Patterns

Using named patterns means using a "rocket" symbol to match up a function call pattern with a body that should be executed when we detect that pattern. You can define as many patterns for a function call as you need. The compiled output is optimized for efficiency. For example this:

```coffeescript
add x, y => x + y
```

...turns into the following JavaScript function:

```javascript
function add(x, y) {
  return x + y;
}
```

And if we add in a pattern like this...

```coffeescript
add 0, 0 => 0
add x, y => x + y
```

...then we'll get something a little closer to this:

```javascript
function add(x, y) {
  if (/* we have 2 arguments where both of them equal zero */) {
    return 0;
  } else if (/* we have 2 arguments where both are variable */) {
    return x + y;
  } else {
    throw new Error('No match found.');
  }
}
```

Notice that if you use multiple patterns, Cream & Sugar will demand that one of your patterns be matched whenever the function is called. If no match is found, it'll produce an error rather than potentially failing more ambiguously somewhere later on in the flow.

Because functions created with this technique are not any different than other functions, they can be used without any problems when passed to a metafunction such as `Array.map`:

```coffeescript
# A pattern for when our argument is 0
add2 0 => 2

# A pattern for when our argument is anything else
add2 x => x + 2

[1, 2, 3].map add2 #=> [3, 4, 5]
```

Before moving on, it should be noted that often times you'll need a function block to span multiple lines. In a case like this, all we need to do is let the compiler know where the block ends. So if your function block spans multiple lines, just use indentation. Like so:

```coffeescript
add2 x =>
  x + 2
```

_The last expression evaluated in your function will always be returned automatically._

When it comes to pattern matching, there is a lot that you can do. But before we dive into all the ways pattern matching can make your life easier, let's talk about the other techniques available for creating functions.

## Anonymous Functions

Sometimes you want to create a function on the fly. It won't be re-used anywhere so you don't need to give it a name. In CnS you can do this with the `fn` keyword. Like so:

```coffeescript
[1, 2, 3].map fn item => item + 2
```

And, of course, you can use indentation if you want the function to span multiple lines.

This syntax is also nice if you'd like to assign a function to a varaible:

```coffeescript
add = fn x, y => x + y

add 2, 2 #=> 4
```

The `fn` keyword keeps our syntax consistent. Whereas in one case, we might say that `add x, y => x + y` could be read as "the function add of x and y returns the result of x plus y," we might also say that `add = fn x, y => x + y` could be read as "add is a function of x and y that returns the result of x plus y".

If there are no parameters to be passed to an anonymous function, then the parameter list is unnecessary:

```coffeescript
createDate = fn => create Date

createDate _ #=> Sat Sep 10 2016 16:06:07 GMT-0400 (EDT)
```

## Context Binding

Whereas in JavaScript, the "fat arrow" (what we've been calling a "rocket") is used exclusively as a shortcut for `Function.bind`, in Cream & Sugar, all functions use the rocket. If you want to use `Function.bind`, you have 2 options. The first is to actually call `bind` like so...

```coffeescript
uselessFn = (fn x => x).bind(@)
```

Notice that, in Cream & Sugar, JavaScript's keyword `this` has become `@`. By the same token, an expression such as `this.foo` can be written as simply `@foo` in CnS.

What's a whole lot nicer than using `.bind` is using the scope resolution (or "bind") operator to make sure that your function is always executed within the current scope.

```coffeescript
uselessFn = fn x ::=> x
```

In fact, you can even use this operator to apply bindings to named patterns!

```coffeescript
add 0, 0 ::=> 0
add x, y ::=> x + y
```

You'll just need to make sure that if you use the bind operator in one of your patterns, you'll need to use it in all of them.

## Anonymous Pattern Matches with `match`

One nice feature of Cream & Sugar is that you can actually define pattern matches without naming a function. Doing so follows as similar form as named patterns except that you'll use `match` and indentation to group your function bodies together rather than writing the name of the function for each pattern. Consider the following:

```coffeescript
eatFood =
  match
    'pizza' => 'ate pizza'
    food    => 'ate some other kind of food'

eatFood 'hamburger' #=> 'ate some other kind of food'
```

This technique is especially useful when accepting messages from [external processes](processes.md). For example, CnS actually allows you to quickly and easily spin up extra operating system processes and pass messages between them. In order to handle incoming messages, you call the `receive` function and pass a function to it. This is a great place to use `match`.

```ruby
receive match
  {{ OK, msg }} => doSomethingWith msg
  {{ ERR, msg }} => throw (create Error, msg)
```

This example handles messages coming in from other OS processes. It expects messages to come in as tuples where the first item is an [atom](datatypes.md) and the second item is a string.

## More Pattern Matching Tricks

Apart from simply detecting specific values and variable data, you can also use pattern matching to destructure your arguments and pick up on things like empty arrays. To illustrate, let's use pattern matching to re-write JavaScript's `Array.map` function.

```coffeescript
map list, fun => map list, fun, []
map [], fun, acc => acc
map [h|t], fun, acc => map t, fun, acc << (fun h, acc.length)

# 3 lines, 120 chars
```

Before we get into an explanation of what's going on here, let's look at a JavaScript equivalent.

```javascript
function map(list, fun, acc) {
  if (arguments.length === 2) {
    return map(list, fun, []);
  } else if (!list.length) {
    return acc;
  } else {
    const h = list[0];
    const t = list.slice(1);
    return map(t, fun, acc.concat(fun(h, acc.length)));
  }
}

// 11 lines, 263 chars
```

Hopefully the JavaScript translation will help make things clearer if you aren't used to this type of syntax yet. Essentially, we've defined 3 patterns for the `map` function. If it is called with 2 arguments (`list`, `fun`), we'll immediately recurse with both of these arguments as well as an extra array that we'll use to accumulate values.

At some point, we'll end up hitting pattern 2 where our `list` argument is an empty array. If this happens, recursion will end and we'll return the accumulator.

In every other case, we'll be hitting pattern 3 and accumulating values. We use the form `[h|t]` to destructure our `list` argument into two pieces – `h` for the first item in the array and `t` for a new array comprised of all the remaining items. The names `h` and `t` are short for "head" and "tail". We'll recurse with the "tail" array so that eventually we'll run out of items and hit pattern 2. As we do, we'll also pass in the function and a new array created by concatenating our current accumulator with the result of calling `fun` with our "head" item and the length of the accumulator.

When destructuring arguments, you may sometimes want to make use of part of a destructured collection, but not the rest of it. However, in CnS, it is bad practice to name a variable and then never use it. Consider the following:

```coffeescript
recur [] => undefined
recur [h|t] => recur t
```

In this example, we created a function called `recur` that takes an array and calls itself once for every item in that array. In the second pattern, we slice the head off of the array so that the function can be called again with only the tail. The gross part is that we went so far as to name the head of our array `h` but then never actually reference `h` anywhere in the function body. If we're not careful, it can look like a mistake. The way to compensate is to use the `_` identifier. Like so:

```coffeescript
recur [] => undefined
recur [_|t] => recur t
```

In this case, we've assigned the head of our array to `_` which is a special identifier in CnS that doesn't actually reference anything. It essentially tells the program (and anyone who may read your code), "something will be here but I don't care what it is because I'm not going to use it". If you were to try to get the value of `_` from within the function body, it would be undefined.

## Allowed Arities

"Arity" refers to the amount of arguments a function takes. In the previous example, you will no doubt realize that our `map` function can be called with an arity of either 2 or 3 (meaning 2 arguments or 3 arguments). However, you may not want to let your users call this function with 3 arguments. The 3 arguments version, you will probably say, should be reserved for recursion.

A good place to solve this problem is when you export the function from your module. An export statement can look like this:

```coffeescript
export {
  map: aritize map, 2
}
```

The built-in `aritize` function takes a function and an arity as its arguments and returns a new function that can only be called with the allowed arity. Now, when a user imports `map` from your module, they will get an error if they try to call it with any amount of arguments other than 2. However, recursion within the function will still work just fine with 3 arguments.

Note that you do not have to force an arity when you export a function. You could just as easily write the following to allow users to call your function with any arity at all:

```javascript
export {
  map: map
}
```

[<- Back to the overview](overview.md)
