# Cream & Sugar Errors

Cream & Sugar handles errors in a friendly and familiar way, using a try/catch expression. The main difference between this expression and JavaScript's try/catch (other than syntax) is that the CnS try/catch returns either a value from the `try` block if it was successful or a value from the `catch` block if it was not. For example:

```ruby
value1 = try
  2 + 2
catch err:
  3 + 3
end

value1
#=> 4

value2 = try
  JSON.parse('{.}')
catch err:
  err
end

value2
#=> Error
```

The try/catch expression consists of the keyword `try`, followed by a block of code, the keyword `catch`, another block of code, and then the keyword `end`.

CnS also provides a try/catch shorthand that works much like a conditional qualifier, in case you don't need to execute large blocks of code.

```ruby
console.log(err) incase JSON.parse('{.}') throws err
```

[<- Back to the overview](overview.md)
