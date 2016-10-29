# Cream & Sugar Scope Piping

Cream & Sugar provides an interesting and somewhat unique little tool that we call curry piping. If you are familiar with the concept of monads in languages like Haskell, there are some similarities, however **curry pipes are not monads**. But insead of trying to describe a curry pipe, let's start by looking at an example. Imagine you had a number that you wanted to perform a couple of operations on in JavaScript. You could write that like this:

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

In CnS, you can accomplish a similar task with curry piping syntax. Consider the following:

```coffeescript
add2 x => x + 2

mlt2 x => x * 2

result = 4 >>= add2 >>= mlt2
#=> 12
```

In this example, we begin with the value 4. We then use the `>>=` operator to pipe it to the `add2` function, where it will be passed in as an argument. The result of that is then piped to the `mlt2` function and passed in as an argument.

The reason we call this "curry" piping is because you can use it to implicitly curry functions. Take the following example:

```coffeescript
add x, y => x + y

mlt x, y => x * y

result = 4 >>= (add 2) >>= (mlt 2)
#=> 12
```

In this example, it appears as though we are calling both `add 2` and `mlt 2` which, at face value, seem as though they should produce errors because each of these functions is intended to take 2 arguments. However, using them in connection with the `>>=` operator allows us to implicitly curry them. What actually happens upon execution here is that 4 gets passed in to `add` as the last argument. The result of that operation then gets passed into `mlt` as the last argument. The effect would be expressed like this in JavaScript: `mlt(2, add(2, 4))`.

If you find this confusing, just remember, all we're doing is taking the first thing and piping it to the next thing as an argument. We can chain as many of these as we need to.


[<- Back to the overview](overview.md)
