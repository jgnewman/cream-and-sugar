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
add2() -> @ + 2

mlt2() -> @ + 2

result = 4 :: add2 :: mlt2
#=> 12
```

In this example, we begin with the value 4. We then pipe it to the `add2` function as its scope. The result of that is then piped to the `mlt2` function as its scope.

This concept is especially useful when you need to use CnS with other libraries because you can create transformers that run on the imported data of standard CnS modules written in functional style. In the following example, we'll write a module containing a few functions and then use scope piping to turn our module into a React.js class.

In **AppContainer.cream** we write the functions that should be used to be converted into a React class and export them:

```coffeescript
componentDidMount() -> console.log('I mounted!')

render() -> <div>'Hello, world!'</div>

export { componentDidMount, render }
```

In **reactify.cream** we write a piping function that will create a React class out of its scope values and export it.

```coffeescript
import React from 'react'

reactify() -> React.createClass(@)

export { reactify }
```

In **main.cream** we'll import our piping function and then pipe the imported `AppContainer` to it, thus quickly transforming an object full of functions into a React class.

```coffeescript
import React from 'react'
import ReactDOM from 'react-dom'
import { reactify } from './reactify'
import AppContainer from './AppContainer' :: reactify

ReactDOM.render(<AppContainer />, dom('#app-container'))
```

[<- Back to the overview](overview.md)
