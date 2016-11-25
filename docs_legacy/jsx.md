# Cream & Sugar JSX Support

> If you do not already know what JSX is, you should visit the [React JS in-depth explanation](https://facebook.github.io/react/docs/jsx-in-depth.html) first. If React is not your cup of tea, you can skip ahead to the section entitled "JSX Without React".

As you should already be aware, JSX is basically HTML that you can write into JavaScript. It was invented for use with React.js and looks a bit like this:

```javascript
<div id={id} className="foo">
  <span>Hello, world!</span>
</div>
```

And here's a function that creates some:

```javascript
function createJSX(id) {
  return (
    <div id={id} className="foo">
      <span>Hello, world!</span>
    </div>
  );
}
```

When compiled, each of the nodes in our JSX is converted into a call to `React.createElement`. Here's how you'd write that same function using Cream & Sugar:

```coffeescript
createJSX id =>
  <div id={id} className="foo">
    <span>"Hello, world!"</span>
  </div>
```

What's pretty cool is, CnS is smart and will detect if React exists within your available code. If so, it will convert each JSX node into a call to `React.createElement`. If not, it will convert each JSX node into a call to
`CNS_.createElement` which will still produce a series of nested DOM nodes.

> Protip: `CNS_` is a reserved word in CnS. If you try to use it, the
compiler will complain. It's reserved for built-in functions that are included
in the compiled code, only if they are needed.

There are a few minor differences between pure JSX and CnS' JSX, however. To learn more about that, read on.

## JSX Without React

CnS' ability to use handle JSX-like syntax is pretty handy because, if you aren't using React, you can still make use of this syntax to dynamically build DOM nodes. For example:

```coffeescript
container = dom '#my-container'
update 'innerHTML', <div>'Hello'</div>, container
#=> <div id="my-container"><div>Hello</div></div>
```

> Another protip: `dom` is a built-in function that makes selecting DOM nodes
easy. Cream and Sugar contains many such built-in functions. However the entire
library doesn't get automatically inserted into your compiled code – only the
ones you're using.

One thing to keep in mind, of course, is that CnS is a functional language and,
as such, it doesn't modify currently existing values. It can only create new
ones. So in the previous example, the `#my-container` div was only "updated"
in the sense that a clone of that node was created and had its `innerHTML`
populated.

There are a couple of other _minor_ differences between CnS' version of JSX
and the pure React version as well.

### Quote all text

In CnS, you will need to surround any floating text with quotes. Because
html-like syntax is integrated into the language and is not handled as a
separate processing step, the compiler will see any floating text as a bunch of
variable names, try to convert them into nested function calls, and get very
confused.

Another way to explain this is that the language grammar doesn't change
if you're inside an html node. So, whereas in traditional JSX you would write
this:

```javascript
<div>
  This is some floating text.
</div>
```

In CnS you would write this:

```javascript
<div>
  "This is some floating text."
</div>
```

In order to stop the compiler from trying to do this:

```javascript
React.createElement('div', {}, [
  This(is(some(floating(text.))))
])

//=> Error!
```

Because a string is still a string, even if you're using html-like code.

Of course, you can still easily drop dynamic values into text:

**JavaScript**
```javascript
<div>Hello, my name is {name}</div>
```

**Cream & Sugar**
```javascript
<div>`Hello, my name is ${name}`</div>
```

And that makes it a little safer to use curly braces in your text.

You can also avoid using curly braces at all in a lot of places:

**JavaScript**
```javascript
<div>
  Two plus two is
  { 2 + 2 }
</div>
```

**Cream & Sugar**
```javascript
<div>
  'Two plus two is'
  2 + 2
</div>
```

And it becomes _extremely_ easy to execute functions right in the middle
of the html body:

**JavaScript**
```javascript
<div>
  Two plus two is
  (function () {
    return <strong>{2 + 2}</strong>;
  }())
</div>
```

**Cream & Sugar**
```coffeescript
<div>
  'Two plus two is'
  apply fn => <strong>2 + 2</strong>
</div>
```

Notice that this is what `apply` is used for in CnS. It's a function that takes
another function as an argument and executes it. Optionally, you can pass in
a list of arguments in the form of an array as a second argument.

[<- Back to the overview](overview.md)
