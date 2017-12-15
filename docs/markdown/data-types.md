---
layout: reference
title: Data Types
subhead: With Just A Couple Upgrades
---

{{#markdown}}
{{{{raw}}}}

Keeping in mind that C&S is just a layer on top of JavaScript, all of its native data types are direct, one-to-one translations of JavaScript data types. And in fact, many of them look exactly the same as JavaScript's data types with only a few exceptions.

In this section, we'll talk about each data type that deviates from the JavaScript spec in terms of how it works, whether or not there are any efficiency considerations, and how it translates to JavaScript.

## Strings

```
`here is a number: ${2 + 2}`
#=> 'here is a number: 4'

"here is a number: ${2 + 2}"
#=> 'here is a number: ${2 + 2}'
```

C&S strings function almost exactly like strings in ES6. In other words, you can create a string using single quotes, double quotes, or back ticks. Each of these techniques generates the exact same kind of string. In addition, you can use back tick strings to include interpolation.

```
"
This string opens and closes on different lines.
"
```

The only other difference between C&S strings and JS strings is that you can write all strings on multiple lines in C&S. As such, the included example is **not valid** in JavaScript but is **totally cool** in Cream & Sugar.

## Atoms (Symbols)

Lots of languages have things they call atoms or symbols. Typically, this type is constituted by some piece of data that represents nothing but itself. It's light-weight, is often used to identify other types of data, and is collected in a global repository of atoms/symbols, never to be garbage collected.

```
# JavaScript symbol
Symbol.for('foo');
```

In ES6, JavaScript implemented its own version of symbols. True to form, they were implemented in the most verbose way possible. To create a named symbol, you have to call a method on the `Symbol` object.

From then on, every time you reference `Symbol.for('foo')`, you'll be referencing the same, unique piece of data. In C&S, you have these too, except we call them "atoms", and all of them are named. To create or reference the `Symbol.for('foo')` in C&S, you need only write a word in all caps.

```
# C&S atom
FOO
```

The rules for naming atoms are as follows:

- The name must contain at least 2 characters
- The first character must be a capital letter
- The name may only contain capital letters and underscores

```
{ FOO: "foo", BAR: "bar" }
#=> {
#     [Symbol.for('FOO')]: "foo",
#     [Symbol.for('BAR')]: "bar"
#   }

{{ OK, "Message text here" }}
#=> CNS_.tuple(
#     [ Symbol.for('OK'),
#     "Message text here" ]
#   )
```

Armed with this syntax, you can now much more easily stomach using atoms in all the ways JavaScript symbols allow. For example, you can use them as object keys.

You can also use them in a sort of "Erlang-y" way to label data being passed back and forth between processes. If you aren't familiar with Erlang, that's fine. Read on to the section on tuples to get a better understanding of what's going on in that last example.


## Arrays

Arrays translate one-to-one into JavaScript arrays. However, your options for working with arrays in C&S have been augmented. While you are not prevented from using native JavaScript methods to work with arrays, you are encouraged to avoid mutative methods and stick with methods that produce new data instead.

```
# Create an array
arr = [2, 3, 4]

# Create a NEW array with an extra item
# "consed" on the front
arr2 = 1 >> arr

#=> [1, 2, 3, 4]

# Create a NEW array with an extra item
# added to the back
arr3 = arr2 << 5

#=> [1, 2, 3, 4, 5]
```

Along those lines, you have a new piece of syntax called "cons" that you can use to add a new item to the front of an array, as shown in the example.

You also have the option of doing a "back cons" that will create a new array with an extra item appended to the back. It looks a lot like the "cons" form, just backward.

C&S also gives you a few extra native functions for working with arrays, including...

- `head` which retrieves the first item in a list,
- `tail` which creates a new list containing all items of an original list except the first one,
- `lead` which creates a new list containing all items of an original list except the last one,
- `last` which retrieves the last item in a list.
- `get`  which retrieves an item by position in a list.
- `update` which creates a new list where the value of one of the items has been updated.
- `remove` which creates a new list where one of the items has been removed.

Check out [Built-In Functions](/reference/bifs/) for more info on these.

## Objects

C&S objects are identical to JavaScript objects. However, working with them can be a little different. For example, because C&S is a functional language, you don't have a good way to modify and existing object. There are, of course, built-in functions such as `update` and `remove` that create new objects with modified property sets. You even have a built-in function called `dangerouslyMutate` that allows you to mutate an existing object _if you really have to_, such as when setting `location.href`.

```
{foo: bar} <- {baz: quux}
#=> {foo: bar, baz: quux}
```

But once you've gotten into the mindset that you can work with new copies of objects rather than mutating old ones, you'll quickly discover how nice it is to have a short syntax for merging objects together. Enter C&S' concept of the "object cons". (We realize we're playing fast and loose with the term "cons" here). Object cons syntax is characterized by 2 object values with the `<-` operator between them. This syntax will create a new object containing all the keys of both values. Properties of the object to the right of the operator will override properties on the object to the left.

```
a <- b
# is equivalent to...
Object.assign({}, a, b);
```

Using object cons syntax is essentially the same as using `Object.assign`, but with fallback support for environments that don't contain Object.assign.

## Tuples

```
tuple = {{ foo, bar }}
```

Perhaps most exciting is C&S' brand new list type, the tuple. A tuple is essentially a special kind of array with a special syntax.

```
{{ OK, 200, "This is the data" }}
```

Tuples are designed to imbue meaning to the placement of each item in the list. As such, tuples can not be empty and they can not be updated to change the amount of items they contain. You will most often use tuples when you want to label items. For example, an http library might want to return server responses in the form of tuples...

```
# response is {{ OK, 200, 'message text' }}
mylib.post '/api/mydata', fn response =>

  caseof get 0, response

    OK  -> doSomethingWith (get 2, response)
    ERR -> doSomethingElseWith (get 2, response)
```

In this case, the first item in the tuple is an atom telling us that the request succeeded. The second item is a status code. The third item is the response message. We might use this data as shown. As previously stated, the positions of these items carry meaning. We expect the first item to always be a success indicator and the second item to always be a status code. If you were allowed to modify the length of tuples, it would destroy the ability to imbue this meaning and remove the tuple's usefulness altogether.

## Collection Notation

```
{foo: 'bar', baz: 'quux'}
```

In most cases, you'll want to notate collections like arrays, objects, and tuples the same way you would in JavaScript. That is, you'll include the collection's opening token (such as `{`), separate your collection items with commas, and then finish with the closing token (such as `}`).

```
{
  foo: (some 'function call'),
  bar: 'quux'
}

{
  foo: some 'function call'
  bar: 'quux'
}
```

When you separate your collection items onto independent lines, however, you have the option of removing the commas. As such, the two examples shown here produce identical output. As you can see, omitting the commas also allows you to remove other extraneous decorators. In the first example, we have to surround our function call with parentheses so that the compiler doesn't interpret the comma as being part of the argument list. In the second example, because there is no comma, there is no need to put parentheses around the function call.

## Assessing Types

C&S abandons JavaScript's confusing `typeof` expression in favor of a built-in function called `dataType`. This function will provide more reasonable results such as "regexp" if handed a regular expression or "date" if handed a Date object. For more information on what to expect from the `dataType` function, check out [Built-In Functions](/reference/bifs/).


{{{{/raw}}}}
{{/markdown}}
