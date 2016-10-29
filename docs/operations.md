# Cream & Sugar Logic and Infix Operations

Most of what you'll do in CnS will take the form of a function call. However, like in most languages, There are some quick operations you can perform and comparisons you can make outside of function call syntax using infix operators (in other words, `a OPERATOR b` syntax).

Let's start with basic math:

- Addition is performed with the `+` operator: `a + b`
- Subtraction is performed with the `-` operator: `a - b`
- Multiplication is performed with the `*` operator: `a * b`
- Basic division is performed in two ways –
  - To get a rounded float, use the `/` operator: `3 / 2` (1.5)
  - To get the a remainder, use the `%` operator: `3 % 2` (1)

You will also use infix operators to perform comparisons:

- Equality is tested in two ways –
  - For strict equal comparison, use the `is` or `==` operators: `a is b`, `a == b`
  - For strict unequal comparison, use the `isnt` or `!=` operators: `a isnt b`, `a != b`

Note that CnS does not allow type coercive comparisons, equality checks are translated to JavaScript's `===` operator, while inequality checks are translated to `!==`.

- For a "<" comparison, use the `lt` operator: `a lt b`
- For a ">" comparison, use the `gt` operator: `a gt b`
- For a "<=" comparison, use the `lte` operator: `a lte b`
- For a ">=" comparison, use the `gte` operator: `a gte b`

CnS also includes friendly, readable operators for basic logic:

- The `and` operator returns true if both operands are truthy: `a and b`
- The `or` operator returns true if either operand is truthy: `a or b`

Note that `&&` and `||` are not logic operators in CnS.

Two other infix operators worthy of note are the cons and back cons operators.

- To add an item to the front of an array, use the `>>` operator: `1 >> [2, 3, 4]`
- To add an item to the back of an array, use the `<<` operator: `[1, 2, 3] << 4`

[<- Back to the overview](overview.md)
