# Cream & Sugar Conditions

Whereas in JavaScript, your standard `if` statement doesn't actually return a value, every type of conditional expression in CnS does.

There are a few ways to handle conditions, and we'll talk about each one here.

> FYI: In the coming examples we'll be using the infix operators `is` and `isnt`. In CnS, these operators translate to `===` and `!==` respectively.

## Multi-Clause Conditions

The multi-clause condition is the most similar to JavaScript's `if`. It begins with the keyword `cond` and terminates with the keyword `end`. Between these keywords, you'll create your conditional clauses. Each one is comprised of a test condition, followed by an arrow, followed by a block of what to do if the condition was truthy. If that block needs to span multiple lines, you will close that block with the keyword `end`. Here are a couple of examples:

```ruby
myVar = 4

cond
  myVar is 2 -> doSomething()
  myVar isnt 2 -> doSomethingElse()
end

cond
  myVar is 4 ->
    doSomething()
    doSomethingElse()
  end
  true -> doThirdThing()
end
```

In the first `cond` example, the first condition does not evaluate truthily and so `doSomething()` is never executed. Instead, the second condition does evaluate truthily and so `doSomethingElse()` is executed. Since this is the only statement in the block, the block returns the value of that statement and, consequently, the `cond` expression itself returns the result of that block.

In the second `cond` example, the first condition evaluates truthily and its block is executed. This time, the block contains multiple statements so it has to be terminated with the keyword `end`. The block returns the result of the last statement executed and, consequently, the `cond` expression returns the result of whichever block was executed.

Because `cond` statements return values, they can be assigned to variables. For example:

```ruby
myVar = cond
  4 is 4 -> 'hello'
  4 isnt 4 -> 'goodbye'
end

myVar is 'hello'
#=> true
```

Notice that there is no `else` statement as part of a `cond` block. This is because Cream & Sugar is big on getting things to match up. You can use `true` as the condition of your final clause if you want to simulate an `else` case (as you saw in a previous example) but, really, it's better to be specific about what you're looking for. In the most recent example, the two conditions we used were `4 is 4` and `4 isnt 4`. This is good for the psychology of code readability and helps us quickly understand exactly what it is we are really looking for.

If a `cond` expression is executed and none of the conditions are matched, you'll get an error. This helps to ensure that you're truly covering all your bases rather than having potentially accidental data simply flow through an `else` case.

## Case Switching

Similar to the `cond` expression is the `caseof` expression. Like `cond`, it returns a value. Unlike `cond`, it makes use of JavaScript's `switch` statement under the hood. As such, it does have the equivalent of an "else" case in the form of a `default` clause. However, unlike JavaScript's `switch`, there are no case fall-throughs. Here is an example:

```ruby
greeting = 'hello'

caseof greeting:
  'hello' -> doSomething()
  'how are you?' -> doSomethingElse()
  default -> doThirdThing()
end
```

As you can see in this example, `caseof` is extremely similar to `cond`. It is comprised of the keyword `caseof`, followed by some value to examine, followed by a colon, your various clauses, and finally the keyword `end`. In each clause, we are testing the equality of our condition against our comparative value. If we find a match, that block is executed. If not, the `default` block is executed. If you don't include a `default` clause and no matches are found, you'll get an error.

Just like the `cond` expression (and in fact everywhere in CnS), if one of your blocks needs to take up multiple lines, just close it out with the keyword `end`.

## Qualifiers

Qualifiers are a quick way to perform either a function call or an operation under a certain condition without requiring the verbosity of a `cond` or `caseof` expression. It is only within the syntax of a qualifier expression that you will use the keywords `if` and `else`. Here are a few examples:

```coffeescript
eat(food) if food isnt gone

eat(food) if food isnt gone else starve()

starve() unless food isnt gone

starve() unless food isnt gone else eat(food)

fs.writeFileSync('./myFile', 'my text', fn(err, result) ->
  throw(err) if err
  doSomethingWith(result)
end)
```

Notice that qualifiers can either be positive or negative. By using `if`, we'll execute the previous statement only on the condition that the following qualifier evaluates truthily. By using `unless`, we'll execute the previous statement only when the qualify does not evaluate truthily.

In either case, you can optionally include an `else` case that will be executed if the initial statement is not.

Like all conditional expressions in CnS, qualifiers return values. If you include an `else` case, the qualifier expression will always return the result of whichever statement is executed. If you don't include an `else` case, the expression will return the result of the original statement if it is executed or `undefined` if it is not. Unlike `cond`, it will not throw an error.
