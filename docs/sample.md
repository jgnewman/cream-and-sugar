# An Example Cream & Sugar React App

One of the most important things you'll want to know concerning any JavaScript "meta-dialect" is how well it integrates with existing frameworks. Clearly there are aspects of CnS that seem perfectly suited to working with React (namely, the JSX-like syntax), however, React is a notably object-oriented framework while CnS is a functional langauge. How do these two work together?

As it turns out, we can write all of our React classes in modular, functional style and allow React to handle any class-y, object-y stuff for us. Let's walk through an example. Here is a full, working React app:

```ruby
import React from 'react'
import ReactDOM from 'react-dom'


# Iterate over a list of functions to generate a React class.
reactify fnList             => reactify fnList, {}
reactify [], accum          => React.createClass accum
reactify [ hd | tl ], accum => reactify tl, (update hd.name, hd, accum)


# A function for calculating factorials
factorial 0 => 1
factorial n => n * factorial n - 1


# A function for rendering the view
render _ =>
  { calc } = @props
  <h1>
    `Hello, friends. The factorial of ${calc} is `
    factorial calc
  </h1>


# Create a React class from our functions
Title = reactify [factorial, render]


# Render the react class in the dom
ReactDOM.render <Title calc={5} />, (dom '#app')

```

This example creates a React class called `Title` and renders it into the dom. The view that gets rendered displays a string that says `Hello, friends. The factorial of 5 is 120`. Here's how it works:

First and foremost we import `React` and `ReactDOM` as usual.

Next we create a function that converts a _list_ of functions into an _object_ of functions and then calls `React.createClass` with that object. Why do it this way? Because, Cream & Sugar is deliberately bad at letting you make objects full of functions. After all, if you're programming functionally, you're supposed to be defining functions in modules, not building classes. Here's what it looks like to put a couple of functions into an object in CnS:

```ruby
obj = {

  foo: (fn x =>
    x + 2
  ),

  bar: (fn y =>
    x - 2
  )

}
```

Notice how you have to use parentheses to capture the dedent. Though you can do this, it's a bit gross. And it's even less conducive to pattern matching. Instead, let's make it easy on ourselves and write a functional module.

Following this philosophy, the next thing we do is create the two functions that will comprise our React class, namely `factorial` and `render`. Note that because we are going to be attaching these functions to a React class, we can use things like `props` within them without any worry.

Next we actually create the `Title` class by calling `reactify` and passing it a list of the functions we want to use. This gives us a nice ability to _actually_ separate public and private functions available to the class. In some other case, we might create a class that uses many functions, only some of which get exported as part of the class.

Finally we'll render the class into the dom. We instantiate the `Title` class using JSX-like syntax and select our dom node using CnS' built-in `dom` function.

And that's all there is to it. Totally painless.

[<- Back to the overview](overview.md)
