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

```ruby
def
  factorial(0) -> 1
  factorial(n) -> n * factorial(n - 1)
end
```

In this case, `factorial(0)` is a pattern that matches up with the value 1. When the language detects this pattern, it spits out 1. We also have another pattern (`factorial(n)`) that will be matched in the case that the user attempts to call the function with a single argument that is not 0. This pattern matches up with a function body that ends up calling `factorial` over and over again, subtracting 1 from its argument each time until the first pattern is matched and the recursion ends.

If you take a look at the CnS compiled output, you'll notice that, under the hood, we're still just building functions that do a conditional analysis of their arguments. However, getting yourself into the pattern match mindset will be very useful in terms of getting used to pattern matching as a tool for shortening your syntax and making your functions logically simpler.

And at this point, you should have a decent grasp on the first technique for defining functions in Cream & Sugar – using `def ... end`. But before we get into the details, let's talk about function calls.


## Function Calls

Function calls in CnS look like function calls in most other languages. That is, they are usually marked by a word followed by parentheses. For example `foo()`. If the function takes arguments, they should be placed inside the parentheses and separated by commas. For example `foo(x, y)`.

For convenience, CnS does not require these parentheses. As such, writing `foo x, y` is directly equivalent to writing `foo(x, y)`. However, if you are not passing any arguments to your function, you will need to include the parentheses in order to indicate that you are actually calling the function instead of just referencing it. For example, `foo` does not actually call the function but `foo()` does.

In most of the following examples in this section we'll be including the parentheses. This is simply because most people are used to them and it should help newcomers get a feel for the language more quickly.

Now let's talk about the different ways you can create functions.


## def ... end

Using `def ... end` creates a named function that translates to with a single, named JavaScript function, no matter how many patterns you include. For example this:

```ruby
def
  add(x, y) -> x + y
end

# 3 lines, 28 chars
```

...turns into the following (simplified) JavaScript function:

```javascript
function add(x, y) {
  if (/* we have 2 arguments and both are variable */) {
    return x + y;
  } else {
    throw new Error('No pattern matched.');
  }
}

// 3 lines, 38 chars
```

And if we add in a pattern like...

```ruby
def
  add(0, 0) -> 0
  add(x, y) -> x + y
end
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

Notice that if you use pattern matching, Cream & Sugar will demand that one of your patterns be matched whenever the function is called. If no match is found, it'll produce an error rather than potentially failing more ambiguously somewhere later on in the flow.

Because functions created with this technique are not any different than other functions, they can be used without any problems when passed to a metafunction such as `Array.map`:

```ruby
def
  add2(x) -> x + 2
end

[1, 2, 3].map(add2) #=> [3, 4, 5]
```

Also, keep in mind that parentheses are optional when defining functions as well as calling them. As such, the above example could just as easily be written like this:

```ruby
def
  add 2 x -> x + 2
end

[1, 2, 3].map add2 #=> [3, 4, 5]
```

For many people, this reduction in clutter makes things a bit easier to read. For others, it loses a bit of clarity through explicitness. A good rule of thumb is to pick a style that works for you and stick to it in most cases.

Before moving on, it should be noted that often times you'll need a function block to span multiple lines. In a case like this, all we need to do is let the compiler know where the block ends. So if your function block spans multiple lines, just use `end` to end it. Like so:

```ruby
def
  add(2, x) ->
    x + 2
  end
end
```

_The last expression evaluated in your function will always be returned automatically._

When it comes to pattern matching, there is a lot that you can do. But before we dive into all the ways pattern matching can make your life easier, let's talk about the other techniques available for creating functions.

## Simple Functions

If you don't need to make use of pattern matching, you don't have to. In fact, using `def ... end` is specifically meant for creating patterns and it's technically a bit of overkill to use it when you only want to match one pattern. So, in the real world, instead of defining our `add` example the way we did under the `def ... end` heading, it's probably better to do it like this:

```ruby
add(x, y) -> x + y
```

...or, if you want to break your function body onto multiple lines:

```ruby
add(x, y) ->
  x + y
end
```

This style will literally compile one-to-one to a simple JavaScript function with no extra sugar added:

```javascript
function add(x, y) {
  return x + y;
}
```

## Anonymous Functions

Sometimes you want to create a function on the fly. It won't be re-used anywhere so you don't need to give it a name. In CnS you can do this with the `fn` keyword. Like so:

```ruby
[1, 2, 3].map(fn(item) -> item + 2)
```

And, of course, you can append `end` to the function body if you want it to span multiple lines.

This syntax is also nice if you'd like to assign a function to a varaible:

```ruby
add = fn(x, y) -> x + y

add(2, 2) #=> 4
```

The `fn` keyword keeps our syntax consistent. Whereas in one case, we might say `add(x, y) -> x + y` could be read as "the function add of x and y returns the result of x plus y," we might also say that `add = fn(x, y) -> x + y` could be read as "add is a function of x and y that returns the result of x plus y".

If there are no parameters to be passed to an anonymous function, then the parameter list is unnecessary:

```ruby
createDate = fn -> create(Date)

createDate() #=> Sat Sep 10 2016 16:06:07 GMT-0400 (EDT)
```

## Anonymous Pattern Matches with match ... end

One nice feature of Cream & Sugar is that you can actually define pattern matches without naming a function. Doing so follows the same syntax form as `def ... end` except that you'll use `match` instead of `def`, and you won't need to write the name of the function in each pattern. Consider the following:

```ruby
factorializeList = match
  (0) -> 1
  (n) -> n * factorial(n - 1)
end

[3, 4, 5].map(factorializeList) #=> [6, 24, 120]
```

This technique is especially useful when accepting messages from [external processes](processes.md). For example, CnS actually allows you to quickly and easily spin up extra operating system processes and pass messages between them. In order to handle incoming messages, you call the `receive` function and pass a function to it. This is a great place to use `match ... end`.

```ruby
receive match
  [~ok, msg] -> doSomethingWith(msg)
  [~err, msg] -> throw(create(Error, msg))
end
```

This example handles messages coming in from other OS processes. It expects messages to come in as two-item arrays where the first item is an [atom](datatypes.md) and the second item is a string.

## More Pattern Matching Tricks

Apart from simply detecting specific values and variable data, you can also use pattern matching to destructure your arguments and pick up on things like empty arrays. To illustrate, let's use pattern matching to re-write JavaScript's `Array.map` function.

```ruby
def
  map(list, fun) -> map(list, fun, [])
  map([], fun, acc) -> acc
  map([h|t], fun, acc) -> map(t, fun, [acc || fun(h, acc.length)])
end

# 5 lines, 140 chars
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

## Allowed Arities

"Arity" refers to the amount of arguments a function takes. In the previous example, you will no doubt realize that our `map` function can be called with an arity of either 2 or 3 (meaning 2 arguments or 3 arguments). However, you may not want to let your users call this function with 3 arguments. The 3 arguments version, you will probably say, should be reserved for recursion.

This problem is solved when you export the function from your module. An export statement looks like this:

```javascript
export { map/2 }
```

The `/2` on the end of the function name denotes the allowed arity that the function is to be exported with. Now, when a user imports `map` from your module, they will get an error if they try to call it with any amount of arguments other than 2. However, recursion within the function will still work just fine with 3 arguments.

[<- Back to the overview](overview.md)
