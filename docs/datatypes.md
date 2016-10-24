# Cream & Sugar Data Types

Keeping in mind that CnS is just a layer on top of JavaScript, all of its native data types are direct, one-to-one translations of JavaScript data types. And in fact, many of them look exactly the same as JavaScript's data types with only a few exceptions.

In this section, we'll talk about each data type that deviates from the JavaScript spec in terms of how it works, whether or not there are any efficiency considerations, and how it translates to JavaScript.

## Strings

CnS strings function almost exactly like strings in ES6. In other words, you can create a string using single quotes, double quotes, or back ticks. Each of these techniques generates the exact same kind of string. In addition, you can use back tick strings to include interpolation. For example:

```javascript
`here is a number: ${2 + 2}` //=> 'here is a number: 4'
"here is a number: ${2 + 2}" //=> 'here is a number: ${2 + 2}'
```

The only other difference between CnS strings and JS strings is that you can write all strings on multiple lines in CnS. As such, the following is **not valid** in JavaScript but is **totally cool** in Cream & Sugar:

```ruby
"
This string opens and closes on totally different lines.
"
```

## Atoms (Symbols)

Lots of languages have things they call atoms or symbols. Typically, the description of this data type is that it is constituted by some piece of data that represents nothing but itself. It's light-weight, is often used to identify other types of data, and is collected in a global repository of atoms/symbols, never to be garbage collected.

In ES6, JavaScript implemented its own version of symbols. True to form, they were implemented in the most verbose way possible. To create a named symbol, you have to do this in JavaScript:

```javascript
Symbol.for('foo');
```

From then on, every time you reference `Symbol.for('foo')`, you'll be referencing the same, unique piece of data. In CnS, you have these too, except we call them "atoms", and all of them are named. To create or reference the `Symbol.for('foo')` in CnS, you need only write the following:

```javascript
FOO
```

The rules for naming atoms are as follows:

- The name must contain at least 2 characters
- The first character must be a capital letter
- The name may only contain capital letters and underscores

Armed with this syntax, you can now much more easily stomach using atoms in all the ways JavaScript symbols allow. For example, you can use them as object keys:

```javascript
{
  FOO: "foo",
  BAR: "bar"
}

//=> { [Symbol.for('FOO')]: "foo", [Symbol.for('BAR')]: "bar" }
```

You can also use them in a sort of "Erlang-y" way to label data being passed back and forth between processes:

```javascript
{{ OK, "Message text here" }}

//=> CNS_.tuple([ Symbol.for('OK'), "Message text here" ])
```

## Arrays

Arrays translate one-to-one into JavaScript arrays. However, your options for working with arrays in CnS have been augmented. While you are not prevented from using native JavaScript methods to work with arrays, you are encouraged to avoid mutative methods and stick with methods that produce new data instead.

Along those lines, you have a new piece of syntax called "cons" that you can use to add a new item to the front of an array. It looks like this:

```ruby
# Create an array
arr = [2, 3, 4]

# Create a NEW array with an extra item "consed" on the front
1 >> arr

#=> [1, 2, 3, 4]
```

You also have the option of doing a "back cons" that will create a new array with an extra item appended to the back. It looks a lot like the "cons" form, just backward.

```ruby
# Create an array
arr = [1, 2, 3]

# Create a NEW array with an extra item added to the back
arr << 4

#=> [1, 2, 3, 4]
```

CnS also gives you a few extra native functions for working with arrays, including...

- `head` which retrieves the first item in a list,
- `tail` which creates a new list containing all items of an original list except the first one,
- `lead` which creates a new list containing all items of an original list except the last one,
- `last` which retrieves the last item in a list.
- `get`  which retrieves an item by position in a list.
- `update` which creates a new list where the value of one of the items has been updated.
- `remove` which creates a new list where one of the items has been removed.

Check out [Built-In Functions](bifs.md) for more info on these.

## Tuples

Perhaps most exciting is CnS' brand new list type, the tuple. A tuple is essentially a special kind of array with a special syntax.

```javascript
tuple = {{ foo, bar }}
```

Tuples are designed to imbue meaning to the placement of each item in the list. As such, tuples can not be empty and they can not be updated to change the amount of items they contain. You will most often use tuples when you want to label items. For example, an http library might want to return server responses in the form of tuples...

```javascript
{{ OK, 200, "This is the data" }}
```

In this case, the first item in the tuple is an atom telling us that the request succeeded. The second item is a status code. The third item is the response message. We might use this data as follows:

```ruby
mylib.post '/api/mydata', fn response =>
  caseof get 0, response
    OK  -> doSomethingWith (get 2, response)
    ERR -> doSomethingElseWith (get 2, response)
```

## Assessing Types

CnS abandons JavaScript's confusing `typeof` expression in favor of a built-in function called `type`. This function will provide more reasonable results such as "regexp" if handed a regular expression or "date" if handed a Date object. For more information on what to expect from the `type` function, check out [Built-In Functions](bifs.md).

[<- Back to the overview](overview.md)
