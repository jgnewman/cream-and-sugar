# Cream & Sugar Built-In Functions

CnS comes packaged with a few useful functions right off the bat. You don't need to import them or reference them on some kind of global CnS object. They are just available for you to use whenever you want.

Following is a list of all built-in functions as well as descriptions of how to use them and what you can expect them to return.


### `apply fun [, argsArray]`

- `fun {Function}`: Any type of function.
- `argsArray {Array}`: Optional. An array of arguments to be passed to the function.

Invokes `fun` and returns the result. If `argsArray` is provided, passes those arguments to the function when invoked.

```coffeescript
apply fn => 2 + 2 #=> 4

apply fn x => x + 2, [2] #=> 4
```

### `aritize fun, arity`

- `fun {Function}`: Any type of function.
- `arity {Number}`: The allowed arity to lock the function into.

Returns a new function that can only be called with the number of arguments provided as `arity`. If the function is called with any other number of arguments, an error will be thrown.

```coffeescript
iterate list => iterate list, []
iterate [], accum => accum
iterate [h|t], accum => iterate t, accum << h

# Only allow users to call `iterate` with 1 argument
export aritize iterate, 1
```

### `arrayToTuple arr`

- `arr {Array}`: Any array.

Creates a new tuple from items in an array.

```coffeescript
arrayToTuple [ 1, 2, 3 ] #=> {{ 1, 2, 3 }}
```

### `create klass [, ...constructorArgs]`

- `klass {Function}`: A class constructor.
- `constructorArgs {Any}`: Any arguments to be passed to the class constructor.

Creates a new instance of `klass` by passing `constructorArgs` to the constructor. Returns the new class instance.

```coffeescript
create Date  #=> Fri Sep 09 2016 17:00:43 GMT-0400 (EDT)

create Error, "This is error text." #=> Error: This is error text(…)
```

### `dataType data`

- `data {Any}`: Any data type.

Intelligently and reasonably assesses data types and returns a string identifying the type of `data`.

```coffeescript
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


### `debug message`

- `message {String}`: A message to log to the console.

A shortcut for JavaScript's `console.debug(message)`. Attempts to default to `console.log` if `console.debug` does not exist. If the `console` object does not exists, fails silently.

```coffeescript
debug 'Something was weird' #=> undefined
```


### `die message`

- `message {String}`: An error message.

A shortcut for JavaScript's `throw new Error(message)`.

```coffeescript
die 'This app is not working' #=> undefined
```


### `dom selector`

- `selector {String}`: Identifies the criteria for selecting a DOM element.

Locates and returns a single DOM element identified by `selector`. If no element was found, returns `null`.

```coffeescript
dom '#my-div' #=> <HTMLElement>

dom 'div' #=> <HTMLElement>
```

### `domArray selector`

- `selector {String}`: Identifies the criteria for selecting DOM elements.

Locates and returns a real array of DOM elements identified by `selector`. If no element was found, returns an empty array.

```coffeescript
domArray '#my-div' #=> [<HTMLElement>]

dom 'div' #=> [<HTMLElement>, <HTMLElement>, <HTMLElement>]
```

### `eql a, b`

- `a {Any}`: Any type of data.
- `b {Any}`: Any type of data.

Determines whether `a` and `b` are deep equal by strict comparison and returns either `true` or `false`.

```coffeescript
eql 4, 4 #=> true

eql 4, "4" #=> false

eql [1, 2, 3], [1, 2, 3] #=> true

eql [1, 2, 3], [2, 3, 1] #=> false

eql [1, 2, {foo: 'bar'}], [1, 2, {foo: 'bar'}] #=> true
```

### `get key, collection`

- `key {String|Number|Atom}`: An object key or array index.
- `collection {Any Object-like type}`: Any kind of JavaScript collection.

Retrieves an element identified by `key` from `collection` and returns the element.

```coffeescript
get 2, ['a', 'b', 'c', 'd'] #=> 'c'

get 'foo', {foo: 'bar', baz: 'quux'} #=> 'bar'

get FOO, {FOO: 'bar'} #=> 'bar'
```


### `head list`

- `list {Array|Tuple|String}`: An list type.

Returns the first item in a list or `undefined` if there are no items.

```ruby
head [1, 2, 3] #=> 1

head [1] #=> 1

head [] #=> undefined
```

### `instanceof data, constructor`

- `data {Any}`: Any type of data.
- `constructor {Function}`: A class constructor function.

Calls JavaScript's `instanceof` statement and returns the result, either `true` or `false`.

```ruby
instanceof {}, Object #=> true

instanceof 4, Object #=> false
```

### `kill process`

- `process {Process}`: A process created using the `spawn` function.

Terminates the process. Returns `undefined`.

```coffeescript
process = spawn fn => console.log "I'm alive!"

kill process
```

### `lang key, value`

- `key {String}`: Any string.
- `value {Any}`: Any value.

Sets thread-level configuration options for the language. For example, `lang 'use.react', false` will prevent trying to use React when compiling JSX-like syntax.

Note that these are runtime configuration options. They are not hoisted and may be used anywhere within your code. Each thread in your application will also have access to its own set of configuration options so setting an option within a child process will not affect code running in the host thread.

Returns `undefined`.

#### Current Config Options

`use.react` - {Boolean} Defaults to true. Determines whether C&S will try to use React.js when compiling JSX-like syntax.

This list is expected to be expanded.

```ruby
lang 'use.react', false #=> undefined
```


### `last list`

- `list {Array|Tuple|String}`: A list type.

Returns the last item in a list or `undefined` if there are no items.

```ruby
last [1, 2, 3] #=> 3

last [1] #=> 1

last [] #=> undefined
```

### `lead list`

- `list {Array|Tuple|String}`: A list type.

Returns a new array of all but the last item in `list`, or an empty array if there are no items or only 1 item.

```ruby
lead [1, 2, 3] #=> [1, 2]

lead [1] #=> []

lead [] #=> []
```

### `log message`

- `message {String}`: A message to log to the console.

A shortcut for JavaScript's `console.log(message)`. If the `console` object does not exists, fails silently.

```coffeescript
log 'This app is great!' #=> undefined
```


### `random array`

- `array {Array}`: An array.

Selects a random item from `array` and returns the item.

```ruby
random [1, 2, 3] #=> 2

random [1, 2, 3] #=> 1
```

### `range from, through`

- `from {Number}`: Any whole number.
- `through {Number}`: Any whole number.

Creates an array containing a range of numbers from `from` through `through`.

```coffeescript
range 1, 10 #=> [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
```


### `receive fun`

- `fun {Function}`: Any type of function including a `fn`, a `def` block, or a `match` block.

Registers a handler for dealing with messages that come in from a separate process. Returns `undefined`.

```ruby
receive match
  {{ OK, msg }}  => doSomethingWith msg
  {{ ERR, msg }} => throw (create Error, msg)
```

### `remove key, collection`

- `key {String|Number|Atom}`: An object key or array index.
- `collection {Any Object-like type}`: Any kind of JavaScript collection.

Creates a shallow clone of `collection` not including the item identified by `key`.

```coffeescript
remove 'foo', {foo: 'bar', baz: 'quux'} #=> {baz: 'quux'}

remove 1, ['a', 'b', 'c'] #=> ['a', 'c']
```

### `reply message`

- `message {Any Serializable Data|Atom}`: A message to send to an owner process.

Sends `message` from a child process to an owner process. Returns `undefined`.

```coffeescript
reply {{ OK, 'This is my message.' }}
```

### `send process, message`

- `process {Process}`: A process created using the `spawn` function.
- `message {Any Serializable Data|Atom}`: A message to send to a owner process.

Sends `message` to `process`. Returns `undefined`.

```coffeescript
process = spawn fn =>
  receive fn msg =>
    console.log 'I got', msg

send process, 'hello'

#=> Logs: "I got hello"
```

### `spawn fun`

- `fun {Function}`: Any type of function, but normally an anonymous `fn`.

Creates a new operating system process out of `fun`.

```coffeescript
process = spawn fn => console.log "I'm alive!"
```

### `tail list`

`list {Array|Tuple|String}`: An list type.

Returns a new array of all but the first item in `list`, or an empty array if there are no items or only 1 item.

```coffeescript
tail [1, 2, 3] #=> [2, 3]

tail [1] #=> []

tail [] #=> []
```

### `throw err`

- `err {Error}`: Any instance of any kind of error object.

Throws an error.

```coffeescript
throw (create Error, 'This is an error message')
```

### `tupleToArray tuple`

- `tuple {Tuple}`: Any tuple.

Creates a new array from items in a tuple.

```coffeescript
tupleToArray {{ 1, 2, 3 }} #=> [1, 2, 3]
```

### `tupleToObject tuple, fun`

- `tuple {Tuple}`: Any tuple.
- `fun {Function}`: Optional. An iterator function taking `item` and `index`.

Creates an object from a tuple where `fun` is used to determine how to construct
key names for each item in the tuple. If `fun` is not provided, indices will
be used as object keys.

```coffeescript
tupleToObject {{ function1, function2 }}, fn item => item.name
#=> {'function1': function1, 'function2': function2}
```


### `update key, value, collection`

- `key {String|Number|Atom}`: An object key or array index.
- `value {Any}`: Any type of data.
- `collection {Any Object-like type}`: Any kind of JavaScript collection.

Creates a shallow clone of `collection` wherein the value for `key` has been updated to `value`.

```coffeescript
update 'foo', 'Billy', {foo: 'bar', baz: 'quux'} #=> {foo: 'Billy', baz: 'quux'}

remove 1, 'd', ['a', 'b', 'c'] #=> ['a', 'd', 'c']
```

### `warn message`

- `message {String}`: A message to log to the console.

A shortcut for JavaScript's `console.warn(message)`. Attempts to default to `console.log` if `console.warn` does not exist. If the `console` object does not exists, fails silently.

```coffeescript
warn 'Something was weird' #=> undefined
```



[<- Back to the overview](overview.md)
