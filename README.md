# Cream and Sugar (Alpha)

[![Build Status](https://travis-ci.org/jgnewman/cream-and-sugar.svg?branch=master)](https://travis-ci.org/jgnewman/cream-and-sugar)
![Dependency Status](https://david-dm.org/jgnewman/cream-and-sugar.svg)

**Cream and Sugar (CnS) is a functional programming language that compiles to
JavaScript.** It's meant to be simple, light, and pretty, as well as a
quickly digestible introduction into functional programming.

#### Plus it natively supports JSX, which is cool.

ToC:
- [What does it look like?](#what-does-it-look-like)
- [How do I learn more?](#how-do-i-learn-more)
- [How do I use it?](#how-do-i-use-it)

## What does it look like?

Without further ado, let's look at a basic example. The following is a
simple factorial calculator in JavaScript.

```javascript
function factorial(n) {
  if (n === 0) {
    return 1;
  } else {
    return n * factorial(n - 1);
  }
}

// 7 lines, 104 chars
```

And this is how you'd write that using the most equivalent structures in CnS:

```ruby
factorial(n) ->
  cond
    n is 0 -> 1
    n isnt 0 -> n * factorial(n - 1)
  end
end

# 6 lines, 85 chars
```

Of course, we can simplify this example even further by using other structures.
But we'll get to that in a minute. More importantly there are a couple of
takeaways right off the bat including...

1. Every structure returns a value (including conditions).
2. The value returned is always the final expression executed.

Also, you'll probably notice that, in lieu of an "else" case,
we're explicitly requiring one of our conditions to evaluate to true. This is
something that sometimes bothers classical programmers at first but it's pretty
standard in a lot of functional languages and you'll get used to it. The
reason we do it this way is two-fold. Firstly, it has to do with the psychology
of readability. But also, this way the language can complain if something we
didn't intend to happen ends up happening. Instead of ambiguously erroring at
some point after hitting the else case, the `cond` expression will throw an
error if it runs and doesn't find a match to one of its conditions. This lets us
catch the error right away and be able to figure out more quickly where it came
from.

Now let's talk about another way we could have written our function that comes
out even smaller:

```ruby
def
  factorial(0) -> 1
  factorial(n) -> n * factorial(n - 1)
end

# 4 lines, 66 chars
```

This example uses a concept called pattern matching. Essentially we're defining
all the various patterns a developer could use in order to call the factorial
function and attaching them to different function bodies that will be executed
when their associated patterns are matched.

Here's how you'd read it: "If a user calls factorial of 0, return 1. If a user
calls factorial of some other value (n), return n times factorial of n minus 1."

This is called a "polymorphic function", meaning that it takes on a particular
form depending on how it was called by the user. It also illustrates another
important facet of CnS (and indeed all major functional languages) – that all
iterations should be done via recursion.

Yep, you heard that right. CnS has no, `for`, `while`, or `do`. (Technically,
it does have `do`, but not for iteration). CnS can only
recurse. That said, there are tons of convenience functions you can use in
order to do iterations. CnS is just sits on top of JavaScript after all so
you've got `Array.map` and everything similar that you can use. But for cases
where you'll have to define your own iterations, let's look at a basic example
implementing an iterative function on our own.

```ruby
def
  each(list, fun) -> each(list, fun, 0)
  each([], fun, counter) -> counter
  each(list, fun, counter) ->
    inc = counter + 1
    fun(head(list), counter)
    each(tail(list), fun, inc)
  end
end

# 9 lines, 201 chars
```

Admittedly, this could be somewhat simplified and we'll take care of that
momentarily. For now, let's look at what it's doing.

We've defined three patterns for how this function could be called. If it gets
called in any other way, it'll throw an error. The patterns are:

1. With two arguments of indeterminate value (`list`, `fun`).
2. With three arguments where the first is an empty array (`[]`, `fun`, `counter`).
3. With three arguments of indeterminate value (`list`, `fun`, `counter`).

The function will return a count of how many items it was called for.

Our intent is that the user will call the function with 2 arguments
constituting an array to loop over and a function to call for each item. when
this happens, we'll hit the first pattern and immediately recurse with
3 arguments where the counter is set to 0.

At this point, assuming the array is not empty, we'll hit the third pattern.
We'll increment the counter, call `fun` on the first item in the list
(called `head`) and the original counter, then recurse with 3 arguments again.
But this time, we'll pass in just the remaining list items (called `tail`)
as well as our incremented counter.

We'll keep hitting pattern 3 until `tail` returns an empty array. At that point
we'll hit pattern 2 and return the counter.

When we call the `each` function, it'll look like this:

```ruby
each([1, 2, 3], fn(item, index) -> item + index)
#=> 3
```

Notice that you can create anonymous functions using the keyword `fn`. This
keeps our syntax consistent. Whereas a named function would be defined using
something like `factorial(n)` (or, "factorial of n"), here we are using
`fn(item, index)` (or, "function of item and index").

Now let's simplify our example a little bit.

Step 1: **Parentheses are optional!**

```ruby
def
  each list, fun -> each list, fun, 0
  each [], fun, counter -> counter
  each list, fun, counter ->
    inc = counter + 1
    fun (head list), counter
    each (tail list), fun, inc
  end
end

# 9 lines, 197 chars
```

This piece should be pretty self explanatory. Pick a style and stick with it.

And, of course, it means we can also call the function like this:

```ruby
each [1, 2, 3], fn item, index -> item + index
#=> 3
```

Step 2: Destructuring

```ruby
def
  each list, fun -> each list, fun, 0
  each [], fun, counter -> counter
  each [hd|tl], fun, counter ->
    fun hd, counter
    each tl, fun, counter + 1
  end
end

# 8 lines, 168 chars
```

Here, we've actually simplified in two ways: first, by destructuring in order
to remove two unneeded function calls and, second, by removing an unnecessary
assignment line.

> Protip: Use pattern matching to avoid assignment lines where possible.

Let's look at destructuring. In pattern three, we're no longer using a
parameter called `list`. Instead, we've used a destructuring technique to
determine that the argument that comes in should be an array and will be
separated out into two variables: `hd`, which indicates the first item in the
array and `tl` which captures the remaining array items.

#### When to use `end`

Before moving on, let's talk about one other thing that you've hopefully picked
up on already. CnS tries to let you remove clutter wherever possible. As such,
there are no curly braces surrounding "blocks". Those are reserved for
object syntax. Instead, blocks tend to begin with either an arrow or a keyword.

If the block begins with a keyword like `def` or `cond`, it will always be
closed out with the keyword `end`.

If the block begins with an arrow, you have
the option to take a shortcut. When the block only contains 1 expression, you
can put that expression on the same line as the arrow and avoid any closing
delimiters. When it needs multiple expressions, list them all on their own lines
and use `end` to close the block.

#### Locking down arities

You may have noticed that defining a function in this way requires that you
allow future users of your code to call the function in each of its various
forms and this may not be enticing to you. For example, you may want to lock
users down to calling the `each` function with just a list and a function. You
may not want them to have access to the counter because it could easily ruin
the function's logic.

Never fear. You can take care of this when you export the function. In CnS,
you will always export functions as a group. For each one being exported, you
will choose the arity with which users will be allowed to call the function.
For example...

```erlang
export { each/2 }
```

In this example, we're exporting the `each` function with an arity of 2, meaning
that users who import it will only be allowed to pass it 2 arguments. If they
call the function with any other number of arguments, they'll get an error.

#### Recursion in CnS vs recursion in JavaScript

Let's just take a quick look at a final version of this function in
Cream & Sugar, vs how the same function would be implemented recursively in
JavaScript.

*CnS*
```ruby
def
  each list, fun -> each list, fun, 0
  each [], fun, counter -> counter
  each [hd|tl], fun, counter ->
    fun hd, counter
    each tl, fun, counter + 1
  end
end

# 8 lines, 168 chars
```

*JavaScript*
```javascript
function each(list, fun, counter) {
  if (arguments.length === 2) {
    return each(list, fun, 0);
  } else {
    if (!list.length) {
      return counter;
    } else {
      const hd = list[0];
      const tl = list.slice(1);
      fun(hd, counter);
      return each(tl, fun, counter + 1);
    }
  }
}

// 14 lines, 303 chars
```

Notice that the CnS version actually does a lot more in terms of throwing errors
when patterns don't match and locking down arities and whatnot. But this is
effectually how you'd accomplish the same thing.

#### Using guards

One other thing we ought to mention when talking about pattern matching is
using guards. Earlier we implemented a `factorial` function like this:

```ruby
def
  factorial(0) -> 1
  factorial(n) -> n * factorial(n - 1)
end
```

With pattern matching we actually have lots of options and another way we
could implement the same thing is by using guards. Guards essentially qualify
certain aspects of a pattern that are harder to express in the pattern itself.

Consider this:

```ruby
def
  factorial(n) when n lt 2 -> 1
  factorial(n) -> n * factorial(n - 1)
end
```

In this version of the function, we're matching against a single argument of
indeterminate value in both patterns. However, in the first pattern, we
qualify that match by saying `when n lt 2` (or, "when n is less than 2").

The way this function is now read would be as follows: "If a user calls
factorial of some value (n) when n is less than 2, return 1. If a user
calls factorial n in any other case, return n times factorial of n minus 1."

## How do I learn more?

Right now you may be feeling enthusiastic about Cream & Sugar for any number of
reasons, but I'm willing to bet you want to hear more about the JSX support.

Well it just so happens there's a folder full of docs for you to check out.
I'd recommend working your way sequentially through the overview.

**[Cream & Sugar Docs](docs/overview.md)**

## How do I use it?

Cream & Sugar is available through npm with both a gulp and webpack plugin soon
to come.

The npm package contains the contents of the Cream & Sugar repository. To get it,
run `$ npm install cns`. If you use `-g` to install it globally, you'll also get
access to a global bash app.

### Using the module

You don't care about a lot of words here, I bet. Here's an example on how to
compile a file:

```javascript
import { compile } from 'cns';

compile('path/to/file.cns', (err, result) => {
  if (err) throw err;
  console.log(result);
}, {finalize: true});
```

> Notice that the file extension for a Cream & Sugar file is .cns

Running the compiler on a file is an asynchronous operation behaving like most
async functions in Node.js. As a third argument, you can pass in some options.
For now, the only useful option is `finalize` which, if set to true, will make
sure that all of the CnS library bootstrapping is included in the output. If you
don't set this to true, you'll get the exact compiled transpilation without any
necessary lib code.

Here's how you'd compile a string instead:

```javascript
import { compileCode } from 'cns';

compileCode('add2(x) -> x + 2', (err, result) => {
  if (err) throw err;
  console.log(result);
}, {finalize: false});
```

Notice that `compileCode` behaves exactly the same as `compile` except it takes
a string of code instead of a path to a file.

The last option you have after installing this module is to play with the REPL.

To launch it, head into the CnS package directory and run `$ npm install` to make
sure you have all of the dev dependencies. From there, run `$ gulp repl`. This
will start up a command line environment where you can experiment with CnS syntax.
