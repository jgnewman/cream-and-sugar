# Cream & Sugar Modules

Cream & Sugar takes inspiration from module syntax introduced in ES2015 and adds an extra feature to supplement pattern match functions.

At a high level, any CnS file can import other modules and export functions of its own. The compiled code uses `require` syntax so that it can work with as many types of transpiled/compiled code in as many environments as possible. With that in mind, you are not limited to importing only CnS modules. CnS simply sits on top of JavaScript so you are free to import as many JavaScript modules as you like.

To import a module that does not actually export any particular values, do this:

```javascript
import '/path/to/filename'
```

This will cause the module to be executed if it hasn't been already.

To import a module that exports only a single, default value, do this:

```javascript
import x from '/path/to/filename'
```

This will create a value called `x` that references whatever it is that your module exported.

To import functions from a module that exports many of them in the form of an object, do this:

```javascript
import {x, y} from '/path/to/filename'
```

This will find values in the export associated with the keys `x` and `y`, and turn those into variables
in the module importing them.

The other way you can import values from an exported obejct is like this:

```javascript
import {keyname1: x, keyname2: y} from '/path/to/filename'
```

This will assign the value at `keyname1` to the variable name `x` and the value at `keyname2`, to the variable name `y`.

When you export, you can export any type of value you want. As such, you can use destructuring of any object type in your imports. Here are a couple more options:

```coffeescript
# Imports the first 2 items of an exported tuple.
import {{ x, y }} from '/path/to/filename'

# Imports the first two items from an exported array.
import [ x, y ] from '/path/to/filename'

# Assigns the first function in an array to `hd`
# and all the rest of them to `tl`.
import [ hd | tl ] from '/path/to/filename'
```


When it comes to exports, ES2015 and CnS begin to differ. Whereas JavaScript allows using the `export` keyword multiple times per module, exporting items in CnS is akin to assigning a value to `module.exports` every time you invoke the `export` function. As such, you'll want to make sure you only call it once.

Here is an example of what is likely the most common export technice:

```javascript
export {
  fn1: fn1,
  fn2: fn2,
  fn3: fn3
}
```

Exports are also a good place to lock down the allowed arities that may be used with your functions. For example, if you have defined a function called `funA` and you export it as `aritize funA, 2`, then when a user imports your function, they will only be allowed to call it with 2 arguments. If they try to call it with any other number of arguments, they'll get an error. Here's a great example of where that would be useful:

```coffeescript
map list, fun => map list, fun, []
map [], fun, acc => acc
map [h|t], fun, acc => map t, fun, acc << (fun h, acc.length)

export {
  map: aritize map, 2
}

```

In this example, we created a function called `map` that essentially mimics JavaScript's `Array.map` method. It assumes the user will call it with two arguments (an array and a function) and, when that happens, it will recur with a third argument – an array that accumulates all of the values as iterations occur.

In this case, we don't want users of our module to be able to pass in 3 arguments to this function as they could pretty easily mess things up. So when we export it, we call the `aritize` function and lock it down to an arity of 2. This way, if a user tries to call it with a third argument, they'll get an error. However, this does not inhibit the function's own ability to recurse with 3 arguments.

Of course, you don't always want to lock down everything you export in this way. Leaving arity open can be important when working with certain libraries, for example React.js. If you export a react class, you'll need to leave the arity open so that you don't end up with a console error:

```coffeescript
App = React.createClass {

  render: fn =>
    <div>"Hello"</div>

}

export App
```

Remember that you can export any type of data from a CnS module including atoms and tuples.

[<- Back to the overview](overview.md)
