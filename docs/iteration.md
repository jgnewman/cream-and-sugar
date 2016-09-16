# Cream & Sugar Iterations

Cream & Sugar does not include a traditionally classical expression for iteration. In other words, there is no `while` loop, no `for` loop, and no `do` loop. There are, however, many ways to iterate over a collection of items. The most important of these is recursion.

## Recursion

In CnS, you will often want to perform an action once for each item in a list. Let's take a look at a simple way to do that using recursion. The following is a completely useless function that takes an array and calls itself once for each item in the array:

```ruby
def
  recur [] -> undefined
  recur [_|t] -> recur t
end
```

Using this technique, you can loop forever, stop when you hit a particular value, keep looping as long as some condition is true, or whatever. All of the power of traditional iterative expressions is packed into recursion with pattern matching by default. It also encourages you to keep your functions smaller and more atomic.

That said, there are other ways to perform certain types of iterations in CnS. We'll cover those now.

## JavaScript Methods

CnS has not been so mean as to remove your ability to use the JavaScript methods you know and love. So, for example, instead of using the `recur` function we defined above, you could use `Array.forEach`:

```ruby
[1, 2, 3].forEach(fn -> end)
```

## Array Comprehensions

CnS also provides convenient array comprehensions. Comprehensions are a syntactical shortcut for building an array from another array. These are provided much the same way that comprehensions in CoffeeScript are provided. Consider the following:

```coffeescript
num + 1 for num in [1, 2, 3]
#=> [2, 3, 4]
```

The above code essentially equates to `[1, 2, 3].map(num => num + 1)` in JavaScript. A basic comprehension is composed of either a function call or an operation followed by the keyword `for`, followed by the names of your variables signifying item and index, followed by the keyword `in`, followed by a value signifying an array.

You also have the option of adding qualifiers to the end of your comprehensions. For example...

```coffeescript
num * 1 for num, index in [1, 2, 3] when index rm 2 is 0
#=> [1, 3]
```

This example collects all of the items in an array that have an even numbered index. Qualifiers are placed at the end of a comprehension and begin with the keyword `when`. They will cause that any iteration that does not meet the condition of the qualifier will be skipped.



[<- Back to the overview](overview.md)
