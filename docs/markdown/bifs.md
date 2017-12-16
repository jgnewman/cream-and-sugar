---
layout: reference
title: Built-In Functions
subhead: The Creamiest, Surgariest Part
---

{{#markdown}}
{{{{raw}}}}

C&S comes packaged with a few useful functions right off the bat. You don't need to import them or reference them on some kind of global C&S object. They are just available for you to use whenever you want.

Following is a list of all built-in functions as well as descriptions of how to use them and what you can expect them to return.


#### apply fun [, argsArray]

```
apply fn => 2 + 2 #=> 4

apply fn x => x + 2, [2] #=> 4
```

- `fun {Function}`: Any type of function.
- `argsArray {Array}`: Optional. An array of arguments to be passed to the function.

Invokes `fun` and returns the result. If `argsArray` is provided, passes those arguments to the function when invoked.


#### aritize fun, arity

```
iterate list => iterate list, []
iterate [], accum => accum
iterate [h|t], accum => iterate t, accum << h

# Only allow users to call `iterate`
# with 1 argument
export aritize iterate, 1
```

- `fun {Function}`: Any type of function.
- `arity {Number}`: The allowed arity to lock the function into.

Returns a new function that can only be called with the number of arguments provided as `arity`. If the function is called with any other number of arguments, an error will be thrown.


#### arrayToTuple arr

```
arrayToTuple [ 1, 2, 3 ] #=> {{ 1, 2, 3 }}
```

- `arr {Array}`: Any array.

Creates a new tuple from items in an array.

#### cache fun

```
foo = cache fn x => x

foo 4 #=> 4

foo 6 #=> 4
```

- `fun {Function}`: Any function.

The `cache` function takes a function as its argument and returns a new function that will cache its result after being executed once. Having been cached, you can call this function as many times as you want and it will immediately return the cached value without having to execute the original function again.

Cached functions may be "reset" by calling the `decache` bif.

#### classof [klass,] methods [, staticMethods]

```
# Create a class
Foo = classof { x: x }

# Extend a class
Foo = classof Bar, { x: x}

# Add some static methods
Foo = classof Bar, { x: x }, { y: y }
```

- `klass {Function}`: Any class function to extend.
- `methods {Object}`: Contains the new class' methods.
- `staticMethods {Object}`: Any static methods to be included.

The `classof` function is used to create and extend JavaScript classes. You will likely not use this function very often if you are programming in a functional way. However, it exists if you need it.

Note that this **should not** be used to extend React components because React classes are weird. If you would like to use React with CnS, you will need to download the `create-react-class` module.


#### create klass [, ...constructorArgs]

```
create Date
#=> Fri Sep 09 2016 17:00:43 GMT-0400 (EDT)

create Error, "This is error text."
#=> Error: This is error text(…)
```

- `klass {Function}`: A class constructor.
- `constructorArgs {Any}`: Any arguments to be passed to the class constructor.

Creates a new instance of `klass` by passing `constructorArgs` to the constructor. Returns the new class instance.

#### dangerouslyMutate key, value, collection

```
location.href #=> 'http://example.com'

dangerouslyMutate 'href', '/foo', location

location.href #=> 'http://example.com/foo'
```

- `key {String|Number|Atom}`: An object key or array index.
- `value {Any}`: Any type of data.
- `collection {Any Object-like type}`: Any kind of JavaScript collection.

Breaks the functionalism paradigm by mutating an existing object instead of creating a new one. This is necessary for certain JavaScript techniques such as updating `location.href`.


#### dataType data

```
dataType 'hello' #=> 'string'

dataType 3.4 #=> 'number'

dataType NaN #=> 'nan'

dataType null #=> 'null'

dataType [1, 2, 3] #=> 'array'

dataType /^foo$/ #=> 'regexp'

dataType <div></div> #=> 'htmlelement'

dataType (create Date) #=> 'date'

dataType undefined #=> 'undefined'

dataType OK #=> 'atom'

dataType (spawn fn => 'hello') #=> 'process'

dataType fn => 'hello' #=> 'function'

dataType {foo: 'bar'} #=> 'object'

dataType {{ x, y }} #=> 'tuple'
```

- `data {Any}`: Any data type.

Intelligently and reasonably assesses data types and returns a string identifying the type of `data`. Possible return values include:

- string
- number
- nan
- null
- array
- regexp
- htmlelement
- date
- undefined
- atom
- process
- function
- object
- tuple


#### debug message

```
debug 'Something was weird'
#=> undefined
```

- `message {String}`: A message to log to the console.

A shortcut for JavaScript's `console.debug(message)`. Attempts to default to `console.log` if `console.debug` does not exist. If the `console` object does not exists, fails silently.

#### decache fun

```
foo = cache fn x => x
foo 4 #=> 4
foo 6 #=> 4

decache foo
foo 6 #=>
```

- `fun {Function}`: Any function.

The `cache` function caches a function such that it stores its result having been executed one time. Calling `decache` on that same function will reset it such that it will cache itself again on the next execution.


#### die message

```
die 'This app is not working'
#=> undefined
```

- `message {String}`: An error message.

A shortcut for JavaScript's `throw new Error(message)`.


#### dom selector

```
dom '#my-div' #=> HTMLElement

dom 'div' #=> HTMLElement
```

- `selector {String}`: Identifies the criteria for selecting a DOM element.

Locates and returns a single DOM element identified by `selector`. If no element was found, returns `null`.


#### domArray selector

```
domArray '#my-div'
#=> [HTMLElement]

domArray 'div'
#=> [HTMLElement, HTMLElement, HTMLElement]
```

- `selector {String}`: Identifies the criteria for selecting DOM elements.

Locates and returns a real array of DOM elements identified by `selector`. If no element was found, returns an empty array.


#### eql a, b

```
eql 4, 4 #=> true

eql 4, "4" #=> false

eql [1, 2, 3], [1, 2, 3] #=> true

eql [1, 2, 3], [2, 3, 1] #=> false

eql [1, 2, {a: 'b'}], [1, 2, {a: 'b'}] #=> true
```

- `a {Any}`: Any type of data.
- `b {Any}`: Any type of data.

Determines whether `a` and `b` are deep equal by strict comparison and returns either `true` or `false`.

<br/>
<br/>


#### get key, collection

```
get 2, ['a', 'b', 'c', 'd'] #=> 'c'

get 'foo', {foo: 'bar', baz: 'quux'} #=> 'bar'

get FOO, {FOO: 'bar'} #=> 'bar'
```

- `key {String|Number|Atom}`: An object key or array index.
- `collection {Any Object-like type}`: Any kind of JavaScript collection.

Retrieves an element identified by `key` from `collection` and returns the element.



#### head list

```
head [1, 2, 3] #=> 1

head [1] #=> 1

head [] #=> undefined
```

- `list {Array|Tuple|String}`: An list type.

Returns the first item in a list or `undefined` if there are no items.


#### instanceof data, constructor

```
instanceof {}, Object #=> true

instanceof 4, Object #=> false
```

- `data {Any}`: Any type of data.
- `constructor {Function}`: A class constructor function.

Calls JavaScript's `instanceof` statement and returns the result, either `true` or `false`.


#### kill process

```
process = spawn fn => log "I'm alive!"

kill process
```

- `process {Process}`: A process created using the `spawn` function.

Terminates the process. Returns `undefined`.


#### lang key, value

```
lang 'use.react', false #=> undefined
```

- `key {String}`: Any string.
- `value {Any}`: Any value.

Sets thread-level configuration options for the language. For example, `lang 'use.react', false` will prevent trying to use React when compiling JSX-like syntax.

Note that these are runtime configuration options. They are not hoisted and may be used anywhere within your code. Each thread in your application will also have access to its own set of configuration options so setting an option within a child process will not affect code running in the host thread.

Returns `undefined`.

##### Current Config Options

`use.react` - {Boolean} Defaults to true. Determines whether C&S will try to use React.js when compiling JSX-like syntax.

This list is expected to be expanded.



#### last list

```
last [1, 2, 3] #=> 3

last [1] #=> 1

last [] #=> undefined
```

- `list {Array|Tuple|String}`: A list type.

Returns the last item in a list or `undefined` if there are no items.


#### lead list

```
lead [1, 2, 3] #=> [1, 2]

lead [1] #=> []

lead [] #=> []
```

- `list {Array|Tuple|String}`: A list type.

Returns a new array of all but the last item in `list`, or an empty array if there are no items or only 1 item.


#### log message

```
log 'This app is great!' #=> undefined
```

- `message {String}`: A message to log to the console.

A shortcut for JavaScript's `console.log(message)`. If the `console` object does not exists, fails silently.


#### noop

```
doNothing = noop
```

You often need a reference to a function that does nothing. That's what this is. A useful function that does nothing.

#### random array

```
random [1, 2, 3] #=> 2

random [1, 2, 3] #=> 1
```

- `array {Array}`: An array.

Selects a random item from `array` and returns the item.


#### range from, through

```
range 1, 10
#=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```

- `from {Number}`: Any whole number.
- `through {Number}`: Any whole number.

Creates an array containing a range of numbers from `from` through `through`.


#### receive fun

```
receive match
  {{ OK, msg }}  => doSomethingWith msg
  {{ ERR, msg }} => throw (create Error, msg)
```

- `fun {Function}`: Any type of function including a `fn`, a `def` block, or a `match` block.

Registers a handler for dealing with messages that come in from a separate process. Returns `undefined`.


#### remove key, collection

```
remove 'foo', {foo: 'bar', baz: 'quux'}
#=> {baz: 'quux'}

remove 1, ['a', 'b', 'c']
#=> ['a', 'c']
```

- `key {String|Number|Atom}`: An object key or array index.
- `collection {Any Object-like type}`: Any kind of JavaScript collection.

Creates a shallow clone of `collection` not including the item identified by `key`.


#### reply message

```
reply {{ OK, 'This is my message.' }}
```

- `message {Any Serializable Data|Atom}`: A message to send to an owner process.

Sends `message` from a child process to an owner process. Returns `undefined`.


#### send process, message

```
process = spawn fn =>
  receive fn msg =>
    console.log 'I got', msg

send process, 'hello'

#=> Logs: "I got hello"
```

- `process {Process}`: A process created using the `spawn` function.
- `message {Any Serializable Data|Atom}`: A message to send to a owner process.

Sends `message` to `process`. Returns `undefined`.



#### spawn fun

```
process = spawn fn => console.log "I'm alive!"
```

- `fun {Function}`: Any type of function, but normally an anonymous `fn`.

Creates a new operating system process out of `fun`.


#### tail list

```
tail [1, 2, 3] #=> [2, 3]

tail [1] #=> []

tail [] #=> []
```

`list {Array|Tuple|String}`: An list type.

Returns a new array of all but the first item in `list`, or an empty array if there are no items or only 1 item.



#### throw err

```
throw (create Error, 'This is an error message')
```

- `err {Error}`: Any instance of any kind of error object.

Throws an error.


#### tupleToArray tuple

```
tupleToArray {{ 1, 2, 3 }} #=> [1, 2, 3]
```

- `tuple {Tuple}`: Any tuple.

Creates a new array from items in a tuple.



#### tupleToObject tuple, fun

```
tupleToObject {{ fun1, fun2 }}, fn item =>
  item.name

#=> {'fun1': fun1, 'fun2': fun2}
```

- `tuple {Tuple}`: Any tuple.
- `fun {Function}`: Optional. An iterator function taking `item` and `index`.

Creates an object from a tuple where `fun` is used to determine how to construct
key names for each item in the tuple. If `fun` is not provided, indices will
be used as object keys.



#### update key, value, collection

```
obj = {foo: 'bar', baz: 'quux'}

update 'foo', 'Billy', obj
#=> {foo: 'Billy', baz: 'quux'}
```

- `key {String|Number|Atom}`: An object key or array index.
- `value {Any}`: Any type of data.
- `collection {Any Object-like type}`: Any kind of JavaScript collection.

Creates a shallow clone of `collection` wherein the value for `key` has been updated to `value`.


#### warn message

```
warn 'Something was weird' #=> undefined
```

- `message {String}`: A message to log to the console.

A shortcut for JavaScript's `console.warn(message)`. Attempts to default to `console.log` if `console.warn` does not exist. If the `console` object does not exists, fails silently.




{{{{/raw}}}}
{{/markdown}}
