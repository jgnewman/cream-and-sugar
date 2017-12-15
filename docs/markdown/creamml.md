---
layout: reference
title: CreamML
subhead: JSX, But As a Real Part of the Language
---

{{#markdown}}
{{{{raw}}}}

> If you do not already know what JSX is, you should visit the [React JS in-depth explanation](https://facebook.github.io/react/docs/jsx-in-depth.html) first. If React is not your cup of tea, you can skip ahead to the section entitled "CreamML Without React".

```
# JSX designed for JavaScript
<div id={id} className="foo">
  <span>Hello, world!</span>
</div>

function createJSX(id) {
  return (
    <div id={id} className="foo">
      <span>Hello, world!</span>
    </div>
  );
}
```

As you should already be aware, JSX is basically HTML that you can write into JavaScript. It was invented for use with React.js and looks like the provided example, including a function that creates some.

When compiled, each of the nodes in our JSX is converted into a call to `React.createElement`. With Cream & Sugar, you can do the same thing with only a few minor differences. Because these differences exist, C&S' XML-like syntax is called "CreamML" rather than JSX. This next example illustrates how to write the same function with C&S.

<br/>
<br/>

```
createJSX id =>
  <div id={id} className="foo">
    <span>"Hello, world!"</span>
  </div>
```

What's pretty cool is, C&S is smart and will detect if React exists within your available code. If so, it will convert each CreamML node into a call to `React.createElement`. If not, it will convert each CreamML node into a call to `CNS_.createElement` which will still produce a series of nested DOM nodes.

> Protip: `CNS_` is a reserved word in C&S. If you try to use it, the
compiler will complain. It's reserved for built-in functions that are included
in the compiled code, only if they are needed.

As previously stated, there are a few minor differences between pure JSX and CreamML. To learn more about that, read on.

## CreamML Without React

```
container = dom '#my-container'

update 'innerHTML', <div>'Hello'</div>, container
#=> <div id="my-container">
#     <div>Hello</div>
#   </div>
```

C&S' ability to use handle JSX-like syntax is pretty handy because, if you aren't using React, you can still make use of this syntax to dynamically build DOM nodes

> Another protip: `dom` is a built-in function that makes selecting DOM nodes
easy. Cream and Sugar contains many such built-in functions.

One thing to keep in mind, of course, is that C&S is a functional language and,
as such, it (usually) doesn't modify currently existing values. Instead it creates new
ones. So in the previous example, the `#my-container` div was only "updated"
in the sense that a clone of that node was created and had its `innerHTML`
populated.

There are a couple of other _minor_ differences between C&S' version of JSX
and the pure React version as well.

### Quote all text

```
# JSX
<div>This is some floating text.</div>

# CreamML
<div>"This is some floating text."</div>
```

In C&S, you will need to surround any floating text with quotes. Because
CreamML syntax is integrated into the language and is not handled as a
separate processing step, the compiler will see any floating text as a bunch of
variable names, try to convert them into nested function calls, and get very
confused.

```
# Bad output from non-quoted text
React.createElement('div', {}, [
  This(is(some(floating(text.))))
])

#=> Error!
```

Another way to explain this is that the language grammar doesn't change
if you're inside a CreamML node. Therefore, you need to quote text to prevent the compiler from doing what is shown in the example. A string, after all, is still a string, even if you're using html-like syntax.

```
<div>`Hello, my name is ${name}`</div>
```

Of course, you can still easily drop dynamic values into text, thus making it a little safer to use curly braces in your text. You can also avoid using curly braces at all in a lot of places.

```
# JSX
<div>
  Two plus two is
  (function () {
    return <strong>{2 + 2}</strong>;
  }())
</div>

# CreamML
<div>
  'Two plus two is'
  apply fn => <strong>2 + 2</strong>
</div>
```

It also becomes _extremely_ easy to execute functions right in the middle
of the html body.

> Notice the use of the `apply` function in this example. It's a function that takes
another function as an argument and executes it. Optionally, you can pass in
a list of args in the form of an array as a second argument to `apply`.

### Using parens instead of curlies

In JSX, you use curly braces every time you want to reference a value or perform a calculation. While you can often do the same thing with CreamML, the curlies sometimes make it dangerous to work with certain data types.

```
<div
  className="foo"
  attr={fn => {foo: bar}}>
# Error! ––––––––––––––^^
# Unexpected "}}"
```

The provided example shows the potential for an error caused by placing an object near the termination of these curly braces, incorrectly causing the compiler to detect a tuple-closing double curly.

<br/>
<br/>

```
<div
  className="foo"
  attr={ fn => {foo: bar} }>

<div
  className="foo"
  attr=(fn => {foo: bar})>
```

The previous example can be prevented via smart use of spaces or by using parens instead of curly braces to surround dynamic values. Parens are actually more in line with "the C&S way" but curlies are allowed in CreamML because many users are familiar with curlies in the context of JSX.

{{{{/raw}}}}
{{/markdown}}
