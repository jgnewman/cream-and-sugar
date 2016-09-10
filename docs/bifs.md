# Cream & Sugar Built-In Functions

CnS comes packaged with a few useful functions right off the bat. You don't need to import them or reference them on some kind of global CnS object. They are just available for you to use whenever you want. Also, the code that powers these functions will only be included in your compiled output if you actually use the functions so there is no need to worry about unnecessary library code bulking up file size.

Following is a list of all built-in functions as well as descriptions of how to use them and what you can expect them to return.


### `create(klass [, ...constructorArgs])`

- `klass {Function}`: A class constructor.
- `constructorArgs {Any}`: Any arguments to be passed to the class constructor.

Creates a new instance of `klass` by passing `constructorArgs` to the constructor. Returns the new class instance.

```ruby
create(Date) #=> Fri Sep 09 2016 17:00:43 GMT-0400 (EDT)

create(Error, "This is error text.") #=> Error: This is error text(…)
```

### `do(fun [, argsArray])`

- `fun {Function}`: Any type of function.
- `argsArray {Aray}`: Optional. An array of arguments to be passed to the function.

Invokes `fun` and returns the result. If `argsArray` is provided, passes those arguments to the function when invoked.

```ruby
do fn -> 2 + 2 #=> 4

do(fn(x) -> x + 2 end, [2]) #=> 4
```

### `dom(selector)`

- `selector {String}`: Identifies the criteria for selecting a DOM element.

Locates and returns a single DOM element identified by `selector`. If no element was found, returns `null`.

```ruby
dom('#my-div') #=> <HTMLElement>

dom('div') #=> <HTMLElement>
```

### `domArray(selector)`

- `selector {String}`: Identifies the criteria for selecting DOM elements.

Locates and returns a real array of DOM elements identified by `selector`. If no element was found, returns an empty array.

```ruby
domArray('#my-div') #=> [<HTMLElement>]

dom('div') #=> [<HTMLElement>, <HTMLElement>, <HTMLElement>]
```

### `elem(key, collection)`

- `key {String|Number|Atom}`: An object key or array index.
- `collection {Any Object-like type}`: Any kind of JavaScript collection.

Retrieves an element identified by `key` from `collection` and returns the element.

```ruby
elem(2, ['a', 'b', 'c', 'd']) #=> 'c'

elem('foo', {foo: 'bar', baz: 'quux'}) #=> 'bar'

elem(~foo, {~foo: 'bar'}) #=> 'bar'
```

### `eql(a, b)`

- `a {Any}`: Any type of data.
- `b {Any}`: Any type of data.

Determines whether `a` and `b` are deep equal by strict comparison and returns either `true` or `false`.

```ruby
eql(4, 4) #=> true

eql(4, "4") #=> false

eql([1, 2, 3], [1, 2, 3]) #=> true

eql([1, 2, 3], [2, 3, 1]) #=> false

eql([1, 2, {foo: 'bar'}], [1, 2, {foo: 'bar'}]) #=> true
```

### `head(array)`

- `array {Array}`: An array.

Returns the first item in an array or `undefined` if there are no items.

```ruby
head([1, 2, 3]) #=> 1

head([1]) #=> 1

head([]) #=> undefined
```

### `instanceof(data, constructor)`

- `data {Any}`: Any type of data.
- `constructor {Function}`: A class constructor function.

Calls JavaScript's `instanceof` statement and returns the result, either `true` or `false`.

```ruby
instanceof({}, Object) #=> true

instanceof(4, Object) #=> false
```

### `kill(process)`

- `process {Process}`: A process created using the `spawn` function.

Terminates the process. Returns `undefined`.

```ruby
process = spawn(fn -> console.log("I'm alive!"))

kill(process)
```

### `last(array)`

- `array {Array}`: An array.

Returns the last item in an array or `undefined` if there are no items.

```ruby
last([1, 2, 3]) #=> 3

last([1]) #=> 1

last([]) #=> undefined
```

### `lead(array)`

- `array {Array}`: An array.

Returns a new array of all but the last item in `array`, or an empty array if there are no items or only 1 item.

```ruby
lead([1, 2, 3]) #=> [1, 2]

lead([1]) #=> []

lead([]) #=> []
```

### `random(array)`

- `array {Array}`: An array.

Selects a random item from `array` and returns the item.

```ruby
random([1, 2, 3]) #=> 2

random([1, 2, 3]) #=> 1
```

### `receive(fun)`

- `fun {Function}`: Any type of function including a `fn`, a `def` block, or a `match` block.

Registers a handler for dealing with messages that come in from a separate process. Returns `undefined`.

```ruby
receive match
  [~ok, msg] -> doSomethingWith(msg)
  [~err, msg] -> throw(create(Error, msg))
end
```

### `remove(key, collection)`

- `key {String|Number|Atom}`: An object key or array index.
- `collection {Any Object-like type}`: Any kind of JavaScript collection.

Creates a shallow clone of `collection` not including the item identified by `key`.

```ruby
remove('foo', {foo: 'bar', baz: 'quux'}) #=> {baz: 'quux'}

remove(1, ['a', 'b', 'c']) #=> ['a', 'c']
```

### `reply(message)`

- `message {Any Serializable Data|Atom}`: A message to send to an owner process.

Sends `message` from a child process to an owner process. Returns `undefined`.

```ruby
reply([~ok, 'This is my message.'])
```

### `send(process, message)`

- `process {Process}`: A process created using the `spawn` function.
- `message {Any Serializable Data|Atom}`: A message to send to a owner process.

Sends `message` to `process`. Returns `undefined`.

```ruby
process = spawn fn ->
  receive fn msg ->
    console.log('I got', msg)
  end
end

send(process, 'hello')

#=> Logs: "I got hello"
```

### `spawn(fun)`

- `fun {Function}`: Any type of function, but normally an anonymous `fn`.

Creates a new operating system process out of `fun`.

```ruby
process = spawn fn -> console.log("I'm alive!")
```

### `tail(array)`

`array {Array}`: An array.

Returns a new array of all but the first item in `array`, or an empty array if there are no items or only 1 item.

```ruby
tail([1, 2, 3]) #=> [2, 3]

tail([1]) #=> []

tail([]) #=> []
```

### `throw(err)`

- `err {Error}`: Any instance of any kind of error object.

Throws an error.

```ruby
throw(create(Error, 'This is an error message'))
```

### `type(data)`

- `data {Any}`: Any data type.

Intelligently and reasonably assesses data types and returns a string identifying the type of `data`.

```coffeescript
type('hello') #=> 'string'

type(3.4) #=> 'number'

type(NaN) #=> 'nan'

type(null) #=> 'null'

type([1, 2, 3]) #=> 'array'

type(/^foo$/) #=> 'regexp'

type(<div></div>) #=> 'htmlelement'

type(create(Date)) #=> 'date'

type(undefined) #=> 'undefined'

type(~ok) #=> 'atom'

type(spawn(fn -> 'hello')) #=> 'process'

type(fn -> 'hello') #=> 'function'

type({foo: 'bar'}) #=> 'object'
```

### `update(key, value, collection)`

- `key {String|Number|Atom}`: An object key or array index.
- `value {Any}`: Any type of data.
- `collection {Any Object-like type}`: Any kind of JavaScript collection.

Creates a shallow clone of `collection` wherein the value for `key` has been updated to `value`.

```ruby
update('foo', 'Billy', {foo: 'bar', baz: 'quux'}) #=> {foo: 'Billy', baz: 'quux'}

remove(1, 'd', ['a', 'b', 'c']) #=> ['a', 'd', 'c']
```



[<- Back to the overview](overview.md)
