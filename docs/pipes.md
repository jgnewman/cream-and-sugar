# Cream & Sugar Scope Piping

Cream & Sugar provides an interesting and somewhat unique little tool that we call scope piping. If you are familiar with the concept of monads in languages like Haskell, it's similar but also easier to grasp. But insead of trying to describe it, let's start by looking at an example. Imagine you had a number that you wanted to perform a couple of operations on in JavaScript. You could write that like this:

```javascript
function add2(x) {
  return x + 2;
}

function mlt2(x) {
  return x * 2;
}

const result = mlt2(add2(4));
//=> 12
```

In CnS, you can accomplish a similar task with different syntax. Consider the following:

```coffeescript
add2() => @ + 2

mlt2() => @ + 2

result = 4 >>= add2 >>= mlt2
#=> 12
```

In this example, we begin with the value 4. We then pipe it to the `add2` function as its scope. The result of that is then piped to the `mlt2` function as its scope.


[<- Back to the overview](overview.md)
