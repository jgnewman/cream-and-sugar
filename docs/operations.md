# Cream & Sugar Logic and Infix Operations

Most of what you'll do in CnS will take the form of a function call. However, like in most languages, There are some quick operations you can perform and comparisons you can make outside of function call syntax using infix operators (in other words, `a OPERATOR b` syntax).

Let's start with basic math:

- Addition is performed with the `+` operator: `a + b`
- Subtraction is performed with the `-` operator: `a - b`
- Multiplication is performed with the `*` operator: `a * b`
- Basic division is performed in two ways –
  - To get a rounded float, use the `dv` operator: `3 dv 2` (1.5)
  - To get the a remainder, use the `rm` operator: `3 rm 2` (1)

You will also use infix operators to perform comparisons:

- Equality is tested in two ways –
  - For strict equal comparison, use the `is` operator: `a is b`
  - For strict unequal comparison, use the `isnt` operator: `a isnt b`

Note that CnS does not allow type coercive comparisons (in other words, no `!=` or `==`).

- For a "<" comparison, use the `lt` operator: `a lt b`
- For a ">" comparison, use the `gt` operator: `a gt b`
- For a "<=" comparison, use the `lte` operator: `a lte b`
- For a ">=" comparison, use the `gte` operator: `a gte b`

CnS also includes friendly, readable operators for basic logic:

- The `and` operator returns true if both operands are truthy: `a and b`
- The `or` operator returns true if either operand is truthy: `a or b`

[<- Back to the overview](overview.md)
