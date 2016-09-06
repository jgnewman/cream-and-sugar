# Cream and Sugar

**Cream and Sugar (CnS) is a functional programming language that compiles to
JavaScript.** It's meant to be simple, light, and pretty, as well as a
quickly digestible introduction into functional programming.

#### Plus it natively supports JSX, which is cool.

So without further ado, let's look at a basic example. The following is a
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
    fun(head(list), inc)
    each(tail(list), fun, inc)
  end
end

# 9 lines, 197 chars
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
(called `head`) and the new counter, then recurse with 3 arguments again.
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
    fun (head list), inc
    each (tail list), fun, inc
  end
end

# 9 lines, 193 chars
```

This piece should be pretty self explanatory. Pick a style and stick with it.

Step 2: Destructuring

```ruby
def
  each list, fun -> each list, fun, 1
  each [], fun, counter -> counter - 1
  each [hd|tl], fun, counter ->
    fun hd, counter
    each tl, fun, counter + 1
  end
end

# 8 lines, 172 chars
```

Here, we've actually simplified in two ways: first, by destructuring in order
to remove two unneeded function calls and, second, by changing the way we're
handling the counter in order to remove the need for an assignment line.

Let's look at destructuring first. In pattern three, we're no longer using a
parameter called `list`. Instead, we've used a destructuring technique to
determine that the argument that comes in should be an array and will be
separated out into two variables: `hd`, which indicates the first item in the
array and `tl` which captures the remaining array items.

As for the counter, rather than starting the counter at 0, we're now starting it
at 1. This way we don't have to use assignment to capture an incremented value.
Instead, when we finally hit pattern 2, we'll just subtract 1 from the final
result.

This, of course, means we can also call the function like this:

```ruby
each [1, 2, 3], fn item, index -> item + index
#=> 3
```

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

You may notice of course that defining a function in this way requires that you
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

## I get it, I get it. What about JSX?

Right, JSX. As you know, JSX is basically HTML that you can write into JavaScript.
It was invented for use with React.js and looks a bit like this:

```javascript
function makeJSX(id) {
  return (
    <div id={id} className="foo">
      <span>Hello, world!</span>
    </div>
  );
}
```

When compiled, each of the nodes in our JSX is converted into a call to
`React.createElement`. Here's how you'd write that same code using Cream and
Sugar:

```ruby
makeJSX id ->
  <div id={id} className="foo">
    <span>"Hello, world!"</span>
  </div>
end
```

What's pretty cool is, CnS is smart and will detect if React exists within your
available code. If so, it will convert each JSX node into a call to
`React.createElement`. If not, it will convert each JSX node into a call to
`SYSTEM.createElement` which will still produce a series of nested DOM nodes.

> Protip: `SYSTEM` is a reserved word in CnS. If you try to use it, the
compiler will complain. It's reserved for built-in functions that are included
in the compiled code, only if they are needed.

This is pretty handy because if you aren't using React, you can still make use
of the JSX syntax to dynamically build DOM nodes. For example:

```ruby
container = dom '#my-container'
update container, 'innerHTML', <div>'Hello'</div>
#=> <div id="my-container"><div>Hello</div></div>
```

> Another protip: `dom` is a built-in function that makes selecting DOM nodes
easy. Cream and Sugar contains many such built-in functions. However the entire
library doesn't get automatically inserted into your compiled code – only the
ones you're using.

One thing to keep in mind, of course, is that CnS is a functional language and,
as such, it doesn't modify currently existing values. It can only create new
ones. So in the previous example, the `#my-container` div was only "updated"
in the sense that a clone of that node was created and had it's `innerHTML`
populated.

There are a couple of other _minor_ differences between CnS' version of JSX
and the JavaScript version as well.

### No need for parentheses

In standard JSX, if your HTML breaks onto another line, you have to surround
the whole thing with a set of parentheses. In the CnS version (let's just call
it cnsx), you don't need to do that.

### Quote all text

As a tradeoff, you will need to surround any floating text with quotes. Because
cnsx is integrated into the language and is not handled as a separate processing
step, the compiler will see any floating text as a bunch of variable names
and get very confused.

So, whereas in traditional JSX you would write this:

```javascript
(<div>
  This is some floating text.
</div>)
```

In CnS you would write this:

```javascript
<div>
  `This is some floating text.`
</div>
```

Another way to explain this is that the language grammar doesn't change
if you're inside an html node. And this happens to provide a few additional
benefits as well.

You can still drop values into text:

**JavaScript**
```javascript
<div>Hello, my name is {name}</div>
```

**Cream and Sugar**
```javascript
<div>`Hello, my name is ${name}`</div>
```

And that makes it a little safer to use curly braces in your text.

You can also avoid using curly braces at all in a lot of places:

**JavaScript**
```javascript
(<div>
  Two plus two is
  {
    2 + 2
  }
</div>)
```

**Cream and Sugar**
```javascript
<div>
  'Two plus two is'
  2 + 2
</div>
```

And it becomes _extremely_ easy to execute functions right in the middle
of the html body:

**JavaScript**
```javascript
(<div>
  Two plus two is
  (function () {
    const out = 2 + 2;
    return <strong>{out}</strong>;
  }())
</div>)
```

**Cream and Sugar**
```javascript
<div>
  'Two plus two is'
  do fn -> <strong>2 + 2</strong>
</div>
```

Notice that this is what `do` is used for in CnS. It's a function that takes
another function as an argument and executes it. Optionally, you can pass in
a list of arguments in the form of an array as a second argument.
