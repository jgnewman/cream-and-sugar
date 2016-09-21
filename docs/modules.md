# Cream & Sugar Modules

Cream & Sugar takes inspiration from module syntax introduced in ES2015 and simplifies it a bit while adding an extra feature to supplement pattern match functions.

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

Note that CnS modules always export functions as part of a group and never as a single, default value. If you use this single value syntax, it means that you are not importing a CnS module.

To import functions from a module that exports many of them (such as any CnS module), do this:

```javascript
import {x, y} from '/path/to/filename'
```

When it comes to exports, ES2015 and CnS begin to differ. Whereas native JavaScript gives you a plethora of export options, CnS provides just one. It looks like this:

```javascript
export { funA/2, funB/1, funC/0 }
```

In CnS, you will always export your functions as a group. Exports are also where you will lock down the allowed arities that may be used with your functions. For example, if you have defined a function called `funA` and you export it as `funA/2`, then when a user imports your function, they will only be allowed to call it with 2 arguments. If they try to call it with any other number of arguments, they'll get an error. Here's a great example of where that would be useful:

```ruby
def
  map(list, fun) -> map(list, fun, [])
  map([], fun, acc) -> acc
  map([h|t], fun, acc) -> map(t, fun, [acc || fun(h, acc.length)])
end

export { map/2 }

```

In this example, we created a function called `map` that essentially mimics JavaScript's `Array.map` method. It assumes the user will call it with two arguments (an array and a function) and, when that happens, it will recur with a third argument – an array that accumulates all of the values as iterations occur.

In this case, we don't want users of our module to be able to pass in 3 arguments to this function as they could pretty easily mess things up. So when we export it, we export it as `map/2`. This way, if a user tries to call it with a third argument, they'll get an error. However, this does not inhibit the function's own ability to recurse with 3 arguments.

It is often useful to export functions with a locked down arity. However, in some cases you may want to leave your function open to being called with dynamic arity. In that case, simply don't included the slash and the number when you name the function in the export. For example:

```javascript
export { map }
```

Leaving arity open can be important when working with certain libraries, for example React.js. If you export a react class, you'll need to leave the arity open so that you don't end up with a console error:

```ruby
App = React.createClass {
  render: fn ->
    <div>"Hello"</div>
  end
}

export { App }
```

[<- Back to the overview](overview.md)
