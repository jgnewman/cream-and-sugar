/*
 * Cream and Sugar grammar file.
 * Pass this to Jison to generate the Cream and Sugar parser file.
 */

%lex

%%

/* Comments */
"###"(.|\r|\n)*?"###"                return "NEWLINE";
// \#.*($|\r\n|\r|\n)                   return "COMMENT"
\#.*($|\r\n|\r|\n)                   return "NEWLINE";

\s*(\r\n|\r|\n)+                     return "NEWLINE";

\s+                                  /* skip other whitespace */

"fn"                                 return "FN";
"caseof"                             return "CASEOF";
"def"                                return "DEF";
"match"                              return "MATCH";
"end"                                return "END";
"args"                               return "ARGS";
"if"                                 return "QUALOPERATOR";
"unless"                             return "QUALOPERATOR";
"incase"                             return "INCASE";
"throws"                             return "THROWS";
"else"                               return "ELSE";
"no"                                 return "NO";
"cond"                               return "COND";
"for"                                return "FOR";
"in"                                 return "IN";
"when"                               return "WHEN";
"try"                                return "TRY";
"catch"                              return "CATCH";
"import"                             return "IMPORT";
"export"                             return "EXPORT";
"from"                               return "FROM";

\<\/[^\>]+\>                         return "CLOSER";
"<"                                  return "<";
">"                                  return ">";
"/>"                                 return "/>";
"</"                                 return "</";

and|or|isnt|is|lte|gte|lt|gt         return "LOGIC";
dv|rm                                return "LOGIC";

true|false|null|undefined            return "SPECIALVAL";

\~[a-zA-Z\_\$][a-zA-Z0-9\_\$]*       return "ATOM";
\@?[a-zA-Z\_\$][a-zA-Z0-9\_\$]*      return "IDENTIFIER";
(\-)?[0-9]+(\.[0-9]+)?(e\-?[0-9]+)?  return "NUMBER";
\/[^\/\s]+\/[gim]*                   return "REGEXP";
\"([^\"]|\\[\"])*\"                  return "STRING";       /* " fix syntax highlighting */
\'([^\']|\\[\'])*\'                  return "STRING";       /* ' fix syntax highlighting */
\`([^\`]|\\[\`])*\`                  return "STRING";       /* ` fix syntax highlighting */

"@"                                  return "IDENTIFIER";
","                                  return ",";
"->"                                 return "->";
":"                                  return ":";
"=>"                                 return "=>";
"="                                  return "=";
"."                                  return ".";
"/"                                  return "/";
"||"                                 return "||";

\+|\-|\*                             return "OPERATOR";

"("                                  return "(";
")"                                  return ")";
"["                                  return "[";
"]"                                  return "]";
"{"                                  return "{";
"}"                                  return "}";
"|"                                  return "|";


<<EOF>>                              return "EOF";

%%


/lex

%start Program
/* Define Start Production */
/* Define Grammar Productions */

%%

Program
  : ProgramBody EOF
    {
      $$ = new ProgramNode($1, createSourceLocation(null, @1, @2));
      return $$;
    }
  ;

ProgramBody
  : ProgramBody ProgramElement
    {
      $$ = $1.concat($2);
    }
  | /* Empty */
    {
      $$ = [];
    }
  ;

ProgramElement
  // : Comment
  : SourceElement
  | NewLine
  | "(" SourceElement ")" { $$ = new WrapNode($2, createSourceLocation(null, @1, @3)); }
  ;

SourceElement
  : Lookup
  | Str
  | Atom
  | Special
  | Num
  | Operation
  | Logic
  | Assignment
  | Cons
  | BackCons
  | Opposite
  | Arr
  | Obj
  | Comp
  | FunctionCall
  | Qualifier
  | Cond
  | Caseof
  | Fun
  | Polymorph
  | TryCatch
  | Import
  | Export
  | Html
  | Regexp
  ;

CommonElement
  : SourceElement
  | "(" SourceElement ")" { $$ = new WrapNode($2, createSourceLocation(null, @1, @3)); }
  ;

Importable
  : SourceElement
  | Tuple
  ;

Import
  : IMPORT Importable FROM Str
    {
      $$ = new ImportNode($2, $4, createSourceLocation(null, @1, @4));
    }
  | IMPORT Importable FROM Identifier
    {
      $$ = new ImportNode($2, $4, createSourceLocation(null, @1, @4));
    }
  | IMPORT Identifier FROM Identifier
    {
      $$ = new ImportNode($2, $4, createSourceLocation(null, @1, @4));
    }
  | IMPORT Identifier FROM Str
    {
      $$ = new ImportNode($2, $4, createSourceLocation(null, @1, @4));
    }
  | IMPORT Str
    {
      $$ = new ImportNode($2, null, createSourceLocation(null, @1, @2));
    }
  | IMPORT Identifier
    {
      $$ = new ImportNode($2, null, createSourceLocation(null, @1, @2));
    }
  ;

ExportItem
  : Identifier "/" Num { $$ = { name: $1, arity: $3 }; }
  | Identifier         { $$ = { name: $1, arity: '*'}; }
  ;

ExportItems
  : ExportItems "," ExportItem          { $$ = $1.concat($3); }
  | ExportItem                          { $$ = [$1]; }
  | ExportItem "," NewLines ExportItems { $$ = [$1].concat($4) }
  | ExportItems NewLines                { $$ = $1; }
  | NewLines ExportItems                { $$ = $2; }
  ;

Export
  : EXPORT "{" ExportItems "}"
    {
      $$ = new ExportNode($3, false, createSourceLocation(null, @1, @4));
    }
  ;

// Export
//   : EXPORT Tuple
//     {
//       $$ = new ExportNode($2, false, createSourceLocation(null, @1, @2));
//     }
//   ;

// Comment
//   : COMMENT
//     {
//       $$ = new CommentNode($1, createSourceLocation(null, @1, @1));
//     }
//   ;

Regexp
  : REGEXP
    {
      $$ = new RegexpNode($1, createSourceLocation(null, @1, @1));
    }
  ;

NewLine
  : NEWLINE
    {
      $$ = new NewLineNode($1, createSourceLocation(null, @1, @1));
    }
  ;

Identifier
  : IDENTIFIER
    {
      $$ = new IdentifierNode($1, createSourceLocation(null, @1, @1));
    }
  ;

Str
  : STRING
    {
      $$ = new StringNode($1, createSourceLocation(null, @1, @1));
    }
  ;

Atom
  : ATOM
    {
      $$ = new AtomNode($1.slice(1), createSourceLocation(null, @1, @1));
    }
  ;

Special
  : SPECIALVAL
    {
      $$ = new SpecialNode($1, createSourceLocation(null, @1, @1));
    }
  ;

Num
  : NUMBER
    {
      $$ = new NumberNode($1, createSourceLocation(null, @1, @1));
    }
  ;

Lookup
  : Lookup "." Identifier
    {
      $$ = new LookupNode($1, $3, createSourceLocation(null, @1, @3));
    }
  | CommonElement "." Identifier
    {
      $$ = new LookupNode($1, $3, createSourceLocation(null, @1, @3));
    }
  | SourceElement "." Identifier
    {
      $$ = new LookupNode($1, $3, createSourceLocation(null, @1, @3));
    }
  | Identifier
    {
      $$ = $1;
    }
  ;

Operation
  : CommonElement OPERATOR CommonElement
    {
      $$ = new OperationNode($2, $1, $3, createSourceLocation(null, @1, @3));
    }
  | SourceElement OPERATOR SourceElement
    {
      $$ = new OperationNode($2, $1, $3, createSourceLocation(null, @1, @3));
    }
  | SourceElement OPERATOR CommonElement
    {
      $$ = new OperationNode($2, $1, $3, createSourceLocation(null, @1, @3));
    }
  | CommonElement OPERATOR SourceElement
    {
      $$ = new OperationNode($2, $1, $3, createSourceLocation(null, @1, @3));
    }
  ;

Logic
  : CommonElement LOGIC CommonElement
    {
      $$ = new LogicNode($2, $1, $3, createSourceLocation(null, @1, @3));
    }
  | SourceElement LOGIC SourceElement
    {
      $$ = new LogicNode($2, $1, $3, createSourceLocation(null, @1, @3));
    }
  | SourceElement LOGIC CommonElement
    {
      $$ = new LogicNode($2, $1, $3, createSourceLocation(null, @1, @3));
    }
  | CommonElement LOGIC SourceElement
    {
      $$ = new LogicNode($2, $1, $3, createSourceLocation(null, @1, @3));
    }
  ;

Tuple
  : "{" ListItems "}"
    {
      $$ = new TupleNode($2, createSourceLocation(null, @1, @3));
    }
  | "{" ListSet "}"
    {
      $$ = new TupleNode($2, createSourceLocation(null, @1, @3));
    }
  | "{" ListSet NewLines "}"
    {
      $$ = new TupleNode($2, createSourceLocation(null, @1, @4));
    }
  ;

// BEGIN HTML STUFF

Attributes
  : AttrItems          { $$ = $1; }
  | NewLines AttrItems { $$ = $2; }
  | AttrItems NewLines { $$ = $1; }
  ;

AttrItems
  : Attribute AttrItems          { $$ = [$1].concat($2); }
  | Attribute NewLines AttrItems { $$ = [$1].concat($3); }
  | Attribute                    { $$ = [$1]; }
  | /* empty */                  { $$ = []; }
  ;

Attribute
  : Identifier "=" Str   { $$ = [$1, $3] }
  | Identifier "=" Tuple { $$ = [$1, $3] }
  ;

HtmlSet
  : HtmlItems          { $$ = $1; }
  | NewLines HtmlItems { $$ = $2; }
  | HtmlItems NewLines { $$ = $1; }
  ;

HtmlItems
  : CommonElement HtmlItems          { $$ = [$1].concat($2); }
  | CommonElement NewLines HtmlItems { $$ = [$1].concat($3); }
  | CommonElement                    { $$ = [$1]; }
  | CommonElement NewLines           { $$ = [$1]; }
  | /* empty */                      { $$ = []; }
  ;

Html
  : "<" Identifier "/>"
    {
      $$ = new HtmlNode(true, $2, [], null, null, createSourceLocation(null, @1, @3));
    }
  | "<" Identifier Attributes "/>"
    {
      $$ = new HtmlNode(true, $2, $3, null, null, createSourceLocation(null, @1, @4));
    }
  | "<" Identifier ">" CLOSER
    {
      $$ = new HtmlNode(false, $2, [], [], $4, createSourceLocation(null, @1, @4));
    }
  | "<" Identifier ">" HtmlSet CLOSER
    {
      $$ = new HtmlNode(false, $2, [], $4, $5, createSourceLocation(null, @1, @5));
    }
  | "<" Identifier Attributes ">" CLOSER
    {
      $$ = new HtmlNode(false, $2, $3, [], $5, createSourceLocation(null, @1, @5));
    }
  | "<" Identifier Attributes ">" HtmlSet CLOSER
    {
      $$ = new HtmlNode(false, $2, $3, $5, $6, createSourceLocation(null, @1, @6));
    }
  ;

// END HTML STUFF

Assignment
  : Identifier "=" CommonElement
    {
      $$ = new AssignmentNode($1, $3, createSourceLocation(null, @1, @3));
    }
  | Tuple "=" CommonElement
    {
      $$ = new AssignmentNode($1, $3, createSourceLocation(null, @1, @3));
    }
  | Cons "=" CommonElement
    {
      $$ = new AssignmentNode($1, $3, createSourceLocation(null, @1, @3));
    }
  | BackCons "=" CommonElement
    {
      $$ = new AssignmentNode($1, $3, createSourceLocation(null, @1, @3));
    }
  ;

Cons
  : "[" CommonElement "|" CommonElement "]"
    {
      $$ = new ConsNode($2, $4, createSourceLocation(null, @1, @5));
    }
  ;

BackCons
  : "[" CommonElement "||" CommonElement "]"
    {
      $$ = new BackConsNode($4, $2, createSourceLocation(null, @1, @5));
    }
  ;

Opposite
  : NO CommonElement
    {
      $$ = new OppositeNode($2, createSourceLocation(null, @1, @2));
    }
  ;

NewLines
  : NewLine NewLines { /* empty */ }
  | NewLine          { /* empty */ }
  | /* empty */      { /* empty */ }
  ;

ListSet
  : ListItems          { $$ = $1; }
  | NewLines ListItems { $$ = $2; }
  | ListItems NewLines { $$ = $1; }
  ;

ListItems
  : CommonElement "," ListItems          { $$ = [$1].concat($3); }
  | CommonElement "," NewLines ListItems { $$ = [$1].concat($4); }
  | CommonElement                        { $$ = [$1]; }
  | /* empty */                          { $$ = []; }
  ;

List
  : ListItems
    {
      $$ = new ListNode($1, false, createSourceLocation(null, @1, @1));
    }
  | "(" ListItems ")"
    {
      $$ = new ListNode($2, true, createSourceLocation(null, @1, @3));
    }
  | "(" ListSet ")"
    {
      $$ = new ListNode($2, true, createSourceLocation(null, @1, @3));
    }
  | "(" ListSet NewLines ")"
    {
      $$ = new ListNode($2, true, createSourceLocation(null, @1, @4));
    }
  ;

Arr
  : "[" ListSet "]"
    {
      $$ = new ArrNode($2, createSourceLocation(null, @1, @3));
    }
  | "[" ListSet NewLines "]"
    {
      $$ = new ArrNode($2, createSourceLocation(null, @1, @4));
    }
  ;

KeyVal
  : Identifier ":" CommonElement { $$ = {left: $1, right: $3}; }
  | Str ":" CommonElement { $$ = {left: $1, right: $3}; }
  | Num ":" CommonElement { $$ = {left: $1, right: $3}; }
  | Atom ":" CommonElement { $$ = {left: $1, right: $3}; }
  ;

ObjPair
  : KeyVal     { $$ = $1; }
  | KeyVal "," { $$ = $1; }
  ;

ObjPairs
  : ObjPair ObjPairs          { $$ = [$1].concat($2); }
  | ObjPair NewLines ObjPairs { $$ = [$1].concat($3); }
  | ObjPair                   { $$ = [$1]; }
  | ObjPair NewLines          { $$ = [$1]; }
  ;

ObjSet
  : ObjPairs          { $$ = $1; }
  | NewLines ObjPairs { $$ = $2; }
  | ObjPairs NewLines { $$ = $1; }
  ;

Obj
  : "{" "}"
    {
      $$ = new ObjNode([], createSourceLocation(null, @1, @2));
    }
  | "{" ObjSet "}"
    {
      $$ = new ObjNode($2, createSourceLocation(null, @1, @3));
    }
  ;

FunctionCall
  : Lookup "(" SourceElement ")"
    {
      $$ = new FunctionCallNode($1, {items:[$3]}, createSourceLocation(null, @1, @4));
    }
  | Lookup "(" ")"
    {
      $$ = new FunctionCallNode($1, {items:[]}, createSourceLocation(null, @1, @3));
    }
  | Lookup List
    {
      $$ = new FunctionCallNode($1, $2, createSourceLocation(null, @1, @2));
    }
  ;

Comp
  : FunctionCall FOR List IN CommonElement
    {
      $$ = new CompNode($1, $3, $5, null, createSourceLocation(null, @1, @5));
    }
  | Operation FOR List IN CommonElement
    {
      $$ = new CompNode($1, $3, $5, null, createSourceLocation(null, @1, @5));
    }
  | FunctionCall FOR List IN CommonElement WHEN CommonElement
    {
      $$ = new CompNode($1, $3, $5, $7, createSourceLocation(null, @1, @7));
    }
  | Operation FOR List IN CommonElement WHEN CommonElement
    {
      $$ = new CompNode($1, $3, $5, $7, createSourceLocation(null, @1, @7));
    }
  ;

Qualifier
  : FunctionCall QUALOPERATOR CommonElement
    {
      $$ = new QualifierNode($1, $3, null, $2, createSourceLocation(null, @1, @3));
    }
  | Operation QUALOPERATOR CommonElement
    {
      $$ = new QualifierNode($1, $3, null, $2, createSourceLocation(null, @1, @3));
    }
  | FunctionCall QUALOPERATOR CommonElement ELSE CommonElement
    {
      $$ = new QualifierNode($1, $3, $5, $2, createSourceLocation(null, @1, @5));
    }
  | Operation QUALOPERATOR CommonElement ELSE CommonElement
    {
      $$ = new QualifierNode($1, $3, $5, $2, createSourceLocation(null, @1, @5));
    }
  ;

Conditional
  : CommonElement "->" CommonElement     { $$ = {test: $1, body: [$3]}; }
  | CommonElement "->" CommonElement END { $$ = {test: $1, body: [$3]}; }
  | CommonElement "->" ProgramBody END   { $$ = {test: $1, body: $3}; }
  ;

Conditionals
  : Conditional Conditionals          { $$ = [$1].concat($2); }
  | Conditional NewLines Conditionals { $$ = [$1].concat($3); }
  | Conditional                       { $$ = [$1]; }
  | Conditional NewLines              { $$ = [$1]; }
  ;

ConditionalSet
  : Conditionals          { $$ = $1; }
  | NewLines Conditionals { $$ = $2; }
  | Conditionals NewLines { $$ = $1; }
  ;

Cond
  : COND ConditionalSet END
    {
      $$ = new CondNode($2, createSourceLocation(null, @1, @3));
    }
  ;

Caseof
  : CASEOF CommonElement ":" ConditionalSet END
    {
      $$ = new CaseofNode($2, $4, createSourceLocation(null, @1, @5));
    }
  ;

Arrow
  : "->"
  | "=>"
  ;

FnBody
  : CommonElement     { $$ = [$1]; }
  | CommonElement END { $$ = [$1]; }
  | ProgramBody END   { $$ = $1; }
  ;

Fun
  : FunctionCall Arrow FnBody
    {
      $$ = new FunNode($1, $3, $2 !==  '->', null, createSourceLocation(null, @1, @3));
    }
  | FN List Arrow FnBody
    {
      $$ = new FunNode($2, $4, $3 !==  '->', null, createSourceLocation(null, @1, @4));
    }
  ;

Match
  : List Arrow FnBody
    {
      $$ = new FunNode($1, $3, $2 !==  '->', null, createSourceLocation(null, @1, @3));
    }
  | List WHEN CommonElement Arrow FnBody
    {
      $$ = new FunNode($1, $5, $4 !==  '->', $3, createSourceLocation(null, @1, @5));
    }
  ;

Matches
  : Match Matches          { $$ = [$1].concat($2); }
  | Match NewLines Matches { $$ = [$1].concat($3); }
  | Match                  { $$ = [$1]; }
  | Match NewLines         { $$ = [$1]; }
  ;

MatchSet
  : Matches          { $$ = $1; }
  | NewLines Matches { $$ = $2; }
  | Matches NewLines { $$ = $1; }
  ;

PolyFn
  :  FunctionCall Arrow FnBody
    {
      $$ = new FunNode($1, $3, $2 !==  '->', null, createSourceLocation(null, @1, @3));
    }
  | FunctionCall WHEN CommonElement Arrow FnBody
    {
      $$ = new FunNode($1, $5, $4 !==  '->', $3, createSourceLocation(null, @1, @5));
    }
  | FN List Arrow FnBody
    {
      $$ = new FunNode($2, $4, $3 !==  '->', null, createSourceLocation(null, @1, @4));
    }
  ;

PolyFns
  : PolyFn PolyFns          { $$ = [$1].concat($2); }
  | PolyFn NewLines PolyFns { $$ = [$1].concat($3); }
  | PolyFn                  { $$ = [$1]; }
  | PolyFn NewLines         { $$ = [$1]; }
  ;

FunctionSet
  : PolyFns          { $$ = $1; }
  | NewLines PolyFns { $$ = $2; }
  | PolyFns NewLines { $$ = $1; }
  ;

Polymorph
  : DEF FunctionSet END
    {
      $$ = new PolymorphNode($2, true, createSourceLocation(null, @1, @3));
    }
  | MATCH MatchSet END
    {
      $$ = new PolymorphNode($2, false, createSourceLocation(null, @1, @3));
    }
  ;

BlockBody
  : CommonElement { $$ = [$1]; }
  | ProgramBody   { $$ = $1; }
  ;

TryCatch
  : TRY BlockBody CATCH Identifier ":" BlockBody END
    {
      $$ = new TryCatchNode($2, $4, $6, createSourceLocation(null, @1, @7));
    }
  | FunctionCall INCASE CommonElement THROWS Identifier
    {
      $$ = new TryCatchNode([$3], $5, [$1], createSourceLocation(null, @1, @5));
    }
  | Operation INCASE CommonElement THROWS Identifier
    {
      $$ = new TryCatchNode([$3], $5, [$1], createSourceLocation(null, @1, @5));
    }
  ;

/* Create Node constructors for each type of statement */

%%

var shared = {};

function createSourceLocation(source, firstToken, lastToken) {
    return new SourceLocation(
        source,
        new Position(
            firstToken.first_line,
            firstToken.first_column
        ),
        new Position(
            lastToken.last_line,
            lastToken.last_column
        )
    );
}

function Position(line, column) {
  this.line   = line;
  this.column = column;
}

function SourceLocation(source, start, end) {
  this.source = source;
  this.start  = start;
  this.end    = end;
}

function ProgramNode(body, loc) {
  this.type = "Program";
  this.length = body.length;
  this.body = body;
  this.loc  = loc;
  this.shared = shared;
}

function NewLineNode(src, loc) {
  this.src = src;
  this.type = "NewLine";
  this.loc = loc;
  this.shared = shared;
}

function CommentNode(text, loc) {
  this.src = text;
  this.type = 'Comment';
  this.text = text.replace(/^\#\s*/, '');
  this.loc = loc;
  this.shared = shared;
}

function RegexpNode(text, loc) {
  this.src = text;
  this.text = text;
  this.type = 'Regexp';
  this.loc = loc;
  this.shared = shared;
}

function IdentifierNode(text, loc) {
  this.src = text;
  this.type = 'Identifier';
  this.text = text;
  this.loc = loc;
  this.shared = shared;
}

function StringNode(text, loc) {
  this.src = text;
  this.type = 'String';
  this.text = text;
  this.loc = loc;
  this.shared = shared;
}

function AtomNode(text, loc) {
  this.src = '~' + text;
  this.type = 'Atom';
  this.text = text;
  this.loc = loc;
  this.shared = shared;
}

function SpecialNode(text, loc) {
  this.src = text;
  this.type = 'Special';
  this.text = text;
  this.loc = loc;
  this.shared = shared;
}

function NumberNode(num, loc) {
  this.src = num;
  this.type = 'Number';
  this.number = num;
  this.loc = loc;
  this.shared = shared;
}

function LookupNode(left, right, loc) {
  this.type = 'Lookup';
  this.left = left;
  this.right = right;
  this.loc = loc;
  this.shared = shared;
}

function TupleNode(body, loc) {
  this.src = "{" + body.map(function (item) { return item.src; }).join(', ') + "}";
  this.type = 'Tuple';
  this.length = body.length;
  this.items = body;
  this.loc = loc;
  this.shared = shared;
}

function OperationNode(operator, left, right, loc) {
  this.type = 'Operation';
  this.operator = operator;
  this.left = left;
  this.right = right;
  this.loc = loc;
  this.shared = shared;
}

function LogicNode(operator, left, right, loc) {
  this.type = 'Logic';
  this.operator = operator;
  this.left = left;
  this.right = right;
  this.loc = loc;
  this.shared = shared;
}

function AssignmentNode(left, right, loc) {
  this.type = 'Assignment';
  this.left = left;
  this.right = right;
  this.loc = loc;
  this.shared = shared;
}

function ConsNode(toAdd, base, loc) {
  this.src = '[' + toAdd.src + '|' + base.src + ']';
  this.type = 'Cons';
  this.toAdd = toAdd;
  this.base = base;
  this.loc = loc;
  this.shared = shared;
}

function BackConsNode(toAdd, base, loc) {
  this.src = '[' + base.src + '||' + toAdd.src + ']';
  this.type = 'BackCons';
  this.toAdd = toAdd;
  this.base = base;
  this.loc = loc;
  this.shared = shared;
}

function OppositeNode(value, loc) {
  this.type = 'Opposite';
  this.value = value;
  this.loc = loc;
  this.shared = shared;
}

function ListNode(items, isWrapped, loc) {
  this.src = '(' + items.map(function (item) { return item.src }).join(', ') + ')';
  this.type = 'List';
  this.length = items.length;
  this.isWrapped = isWrapped;
  this.items = items;
  this.loc = loc;
  this.shared = shared;
}

function ArrNode(items, loc) {
  this.src = "[" + items.map(function (item) { return item.src; }).join(', ') + "]";
  this.type = 'Arr';
  this.length = items.length;
  this.items = items;
  this.loc = loc;
  this.shared = shared;
}

function ObjNode(pairs, loc) {
  this.type = 'Obj';
  this.length = pairs.length;
  this.pairs = pairs;
  this.loc = loc;
  this.shared = shared;
}

function CompNode(action, params, list, caveat, loc) {
  this.type = 'Comp';
  this.action = action;
  this.params = params;
  this.list = list;
  this.caveat = caveat;
  this.loc = loc;
  this.shared = shared;
}

function FunctionCallNode(fn, args, loc) {
  this.type = 'FunctionCall';
  this.fn = fn;
  this.args = args;
  this.loc = loc;
  this.shared = shared;
}

function QualifierNode(action, condition, elseCase, keyword, loc) {
  this.type = 'Qualifier';
  this.action = action;
  this.keyword = keyword.toLowerCase();
  this.condition = condition;
  this.elseCase = elseCase;
  this.loc = loc;
  this.shared = shared;
}

function CondNode(conditions, loc) {
  this.type = 'Cond';
  this.length = conditions.length;
  this.conditions = conditions;
  this.loc = loc;
  this.shared = shared;
}

function CaseofNode(comparator, conditions, loc) {
  this.type = 'Caseof';
  this.length = conditions.length;
  this.comparator = comparator;
  this.conditions = conditions;
  this.loc = loc;
  this.shared = shared;
}

function FunNode(preArrow, body, bind, guard, loc) {
  this.type = 'Fun';
  this.length = body.length;
  this.bind = bind;
  this.preArrow = preArrow;
  this.guard = guard;
  this.body = body;
  this.loc = loc;
  this.shared = shared;
}

function PolymorphNode(fns, isNamed, loc) {
  this.type = 'Polymorph';
  this.length = fns.length;
  this.isNamed = isNamed;
  this.fns = fns;
  this.loc = loc;
  this.shared = shared;
}

function TryCatchNode(attempt, errName, fallback, loc) {
  this.type = 'TryCatch';
  this.attempt = attempt;
  this.errName = errName;
  this.fallback = fallback;
  this.loc = loc;
  this.shared = shared;
}

function ImportNode(toImport, file, loc) {
  this.type = 'Import';
  this.toImport = toImport;
  this.file = file;
  this.loc = loc;
  this.shared = shared;
}

function ExportNode(toExport, isDefault, loc) {
  this.type = 'Export';
  this.toExport = toExport;
  this.isDefault = isDefault;
  this.loc = loc;
  this.shared = shared;
}

function HtmlNode(selfClosing, openTag, attrs, body, closeTag, loc) {
  this.type = 'Html';
  this.selfClosing = selfClosing;
  this.openTag = openTag;
  this.closeTag = closeTag;
  this.attrs = attrs;
  this.body = body;
  this.loc = loc;
  this.shared = shared;
}

function WrapNode(item, loc) {
  this.type = 'Wrap';
  this.item = item;
  this.loc = loc;
  this.shared = shared;
}

/* Expose the Node Constructors */
var n = parser.nodes = {};

n.shared = shared;
n.ProgramNode = ProgramNode;
n.NewLineNode = NewLineNode;
n.CommentNode = CommentNode;
n.RegexpNode = RegexpNode;
n.StringNode = StringNode;
n.AtomNode = AtomNode;
n.SpecialNode = SpecialNode;
n.IdentifierNode = IdentifierNode;
n.NumberNode = NumberNode;
n.LookupNode = LookupNode;
n.TupleNode = TupleNode;
n.OperationNode = OperationNode;
n.LogicNode = LogicNode;
n.AssignmentNode = AssignmentNode;
n.ConsNode = ConsNode;
n.BackConsNode = BackConsNode;
n.OppositeNode = OppositeNode;
n.ListNode = ListNode;
n.ArrNode = ArrNode;
n.ObjNode = ObjNode;
n.CompNode = CompNode;
n.FunctionCallNode = FunctionCallNode;
n.QualifierNode = QualifierNode;
n.CondNode = CondNode;
n.CaseofNode = CaseofNode;
n.FunNode = FunNode;
n.PolymorphNode = PolymorphNode;
n.TryCatchNode = TryCatchNode;
n.ImportNode = ImportNode;
n.ExportNode = ExportNode;
n.HtmlNode = HtmlNode;
n.WrapNode = WrapNode;
