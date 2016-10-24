/*
 * Cream and Sugar grammar file.
 * Pass this to Jison to generate the Cream and Sugar parser file.
 */

%lex

%%

/* Comments */
"###"(.|\r|\n)*?"###"                /* skip other whitespace */
// \#.*($|\r\n|\r|\n)                return "COMMENT"
\#.*($|\r\n|\r|\n)                   return 'NEWLINE';

\[\s*                                return "[";
"]"                                  return "]";

\{\{\s*                              return "{{";
"}}"                                 return "}}";

\{\s*                                return "{";
"}"                                  return "}";

">>="                                return ">>=";
"<<"                                 return "<<";
">>"                                 return ">>";

\<\/[^\>]+\>                         return "CLOSER";
\<\/\s*                              return "</";
\<\s*                                return "<";
"/>"                                 return "/>";
">"                                  return ">";

(\r\n|\r|\n)+[ \t]+(\r\n|\r|\n)      %{
                                       this.unput(yytext.replace(/^(\r\n|\r|\n)+[ \t]+/, ''));
                                     %}

(\r\n|\r|\n)+[ \t]*                  %{
                                       // Track a global indent count on the parser.
                                       parser.indentCount = parser.indentCount || [0];
                                       parser.forceDedent = parser.forceDedent || 0;

                                       if (parser.forceDedent) {
                                         parser.forceDedent -= 1;
                                         this.unput(yytext);
                                         return 'DEDENT';
                                       }

                                       var indentation = yytext.replace(/^(\r\n|\r|\n)+/, '').length;

                                       // Return an indent when the white space is greater than
                                       // our current indent count. We also unshift a new indent
                                       // count on to the indent stack.
                                       if (indentation > parser.indentCount[0]) {
                                         parser.indentCount.unshift(indentation);
                                         return 'INDENT';
                                       }

                                       // If and for as long as indentation is less than our
                                       // current indent count, add a dedent to our dedent
                                       // stack and shift an indent count off of the
                                       // indent stack.
                                       var dedents = [];

                                       while (indentation < parser.indentCount[0]) {
                                         parser.indentCount.shift();
                                         dedents.push('DEDENT');
                                       }

                                       if (dedents.length) {
                                         parser.forceDedent = dedents.length - 1;
                                         this.unput(yytext);
                                         return 'DEDENT';
                                       }

                                       // If there is no indentation, return a
                                       // newline.
                                       return 'NEWLINE';
                                     %}

\s+                                  /* skip other whitespace */

"fn"                                 return "FN";
"caseof"                             return "CASEOF";
"def"                                return "DEF";
"match"                              return "MATCH";
"end"                                return "END";
"args"                               return "ARGS";
"if"                                 return "IF";
"incase"                             return "INCASE";
"throws"                             return "THROWS";
"else"                               return "ELSE";
"do"                                 return "DO";
"cond"                               return "COND";
"for"                                return "FOR";
"in"                                 return "IN";
"then"                               return "THEN";
"when"                               return "WHEN";
"where"                              return "WHERE";
"try"                                return "TRY";
"catch"                              return "CATCH";
"import"                             return "IMPORT";
"export"                             return "EXPORT";
"from"                               return "FROM";
"onlyif"                             return "ONLYIF";

and|or|lte|gte|lt|gt|dv|rm           return "LOGIC";
isnt|is|\=\=|\!\=                    return "LOGIC";

true|false|null|undefined            return "SPECIALVAL";

(\@)?[a-zA-Z\_\$][a-zA-Z0-9\_\$]*((\s*\.\s*)?[a-zA-Z0-9\_\$]+)*   %{
                                                                    if (/^[A-Z][A-Z_]+$/.test(yytext)) {
                                                                      return 'ATOM';
                                                                    } else {
                                                                      return 'IDENTIFIER';
                                                                    }
                                                                  %}

(\-)?[0-9]+(\.[0-9]+)?(e\-?[0-9]+)?  return "NUMBER";
\/[^\/\s]+\/[gim]*                   return "REGEXP";
\"([^\"]|\\[\"])*\"                  return "STRING";       /* " fix syntax highlighting */
\'([^\']|\\[\'])*\'                  return "STRING";       /* ' fix syntax highlighting */
\`([^\`]|\\[\`])*\`                  return "STRING";       /* ` fix syntax highlighting */

"@"                                  return "IDENTIFIER";
","                                  return ",";
"->"                                 return "->";
"::"                                 return "::";
":"                                  return ":";
"=>"                                 return "=>";
"="                                  return "=";
"."                                  return ".";
"/"                                  return "/";
"||"                                 return "||";

\+|\-|\*                             return "OPERATOR";

"("                                  return "(";
")"                                  return ")";
"|"                                  return "|";
"!"                                  return "!";


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
  : SourceElement
  | NewLine
  | Export
  ;

SourceElement
  : Wrap
  | Str
  | Regexp
  | Atom
  | Special
  | Num
  | Lookup
  | Opposite
  | Cons
  | BackCons
  | Operation
  | Logic
  | Arr
  | Tuple
  | Obj
  | Html
  | Comp
  | Qualifier
  | Pipe
  | Import
  | Assignment
  | FunctionCall
  | Cond
  | Caseof
  | TryCatch
  | Fun
  | Polymorph
  ;

Wrap
  : "(" SourceElement ")"
    {
      $$ = new WrapNode($2, createSourceLocation(null, @1, @3));
    }
  | "(" SourceElement NewLines ")"
    {
      $$ = new WrapNode($2, createSourceLocation(null, @1, @4));
    }
  ;

NewLine
  : NEWLINE
    {
      $$ = new NewLineNode($1, createSourceLocation(null, @1, @1));
    }
  ;

Str
  : STRING
    {
      $$ = new StringNode($1, createSourceLocation(null, @1, @1));
    }
  ;

Regexp
  : REGEXP
    {
      $$ = new RegexpNode($1, createSourceLocation(null, @1, @1));
    }
  ;

Atom
  : ATOM
    {
      $$ = new AtomNode($1, createSourceLocation(null, @1, @1));
    }
  ;

Identifier
  : IDENTIFIER
    {
      $$ = new IdentifierNode($1, createSourceLocation(null, @1, @1));
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
  : Lookup "." SourceElement
    {
      $$ = new LookupNode($1, $3, createSourceLocation(null, @1, @3));
    }
  | SourceElement "." SourceElement
    {
      $$ = new LookupNode($1, $3, createSourceLocation(null, @1, @3));
    }
  | Identifier
    {
      $$ = $1;
    }
  ;

Opposite
  : "!" SourceElement
    {
      $$ = new OppositeNode($2, createSourceLocation(null, @1, @2));
    }
  ;

Cons
  : SourceElement ">>" SourceElement
    {
      $$ = new ConsNode($1, $3, createSourceLocation(null, @1, @3));
    }
  ;

BackCons
  : SourceElement "<<" SourceElement
    {
      $$ = new BackConsNode($3, $1, createSourceLocation(null, @1, @3));
    }
  ;

Operation
  : SourceElement OPERATOR SourceElement
    {
      $$ = new OperationNode($2, $1, $3, createSourceLocation(null, @1, @3));
    }
  ;

Logic
  : SourceElement LOGIC SourceElement
    {
      $$ = new LogicNode($2, $1, $3, createSourceLocation(null, @1, @3));
    }
  ;

ListSeparator
  : "," NewLine INDENT
  | "," NewLine
  | "," INDENT
  | ","
  ;

ListItems
  : ListItems ListSeparator SourceElement
    {
      $$ = $1.concat($3);
    }
  | ListItems NewLine
    {
      $$ = $1;
    }
  | ListItems DEDENT
    {
      $$ = $1;
    }
  | SourceElement
    {
      $$ = [$1];
    }
  | /* empty */
    {
      $$ = [];
    }
  ;

Arr
  : "[" ListItems "]"
    {
      $$ = new ArrNode($2, createSourceLocation(null, @1, @3));
    }
  ;

Tuple
  : "{{" ListItems "}}"
    {
      $$ = new TupleNode($2, createSourceLocation(null, @1, @3));
    }
  ;

KVPair
  : SourceElement ":" SourceElement
    {
      $$ = {
        left: $1,
        right: $3
      };
    }
  ;

KVPairs
  : KVPairs ListSeparator KVPair
    {
      $$ = $1.concat($3);
    }
  | KVPairs NewLine
    {
      $$ = $1;
    }
  | KVPairs DEDENT
    {
      $$ = $1;
    }
  | KVPair
    {
      $$ = [$1];
    }
  | /* empty */
    {
      $$ = [];
    }
  ;

Obj
  : "{" KVPairs "}"
    {
      $$ = new ObjNode($2, createSourceLocation(null, @1, @3));
    }
  ;

Attribute
  : Identifier "=" Str
    {
      $$ = [$1, $3];
    }
  | Identifier "=" "{" SourceElement "}"
    {
      $$ = [$1, new TupleNode([$4], createSourceLocation(null, @3, @5))];
    }
  ;

AttrSeparator
  : NewLine INDENT
  | NewLine
  | INDENT
  | /* empty */ {}
  ;

Attributes
  : Attributes AttrSeparator Attribute
    {
      $$ = $1.concat([$3]);
    }
  | Attributes NewLine
    {
      $$ = $1;
    }
  | Attributes DEDENT
    {
      $$ = $1;
    }
  | Attribute
    {
      $$ = [$1];
    }
  | /* empty */
    {
      $$ = [];
    }
  ;

HtmlItems
  : HtmlItems SourceElement
    {
      $$ = $1.concat($2);
    }
  | HtmlItems NewLine
    {
      $$ = $1;
    }
  | HtmlItems DEDENT
    {
      $$ = $1;
    }
  | INDENT
    {
      $$ = [];
    }
  | SourceElement
    {
      $$ = [$1];
    }
  | /* empty */
    {
      $$ = [];
    }
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
  | "<" Identifier ">" HtmlItems CLOSER
    {
      $$ = new HtmlNode(false, $2, [], $4, $5, createSourceLocation(null, @1, @5));
    }
  | "<" Identifier Attributes ">" CLOSER
    {
      $$ = new HtmlNode(false, $2, $3, [], $5, createSourceLocation(null, @1, @5));
    }
  | "<" Identifier Attributes ">" HtmlItems CLOSER
    {
      $$ = new HtmlNode(false, $2, $3, $5, $6, createSourceLocation(null, @1, @6));
    }
  ;

Comp
  : FOR ListItems IN SourceElement DO SourceElement
    {
      $$ = new CompNode($6, $2, $4, null, createSourceLocation(null, @1, @6));
    }
  | FOR ListItems IN SourceElement DO SourceElement ONLYIF SourceElement
    {
      $$ = new CompNode($6, $2, $4, $8, createSourceLocation(null, @1, @8));
    }
  ;

Qualifier
  : IF SourceElement THEN SourceElement
    {
      $$ = new QualifierNode($4, $2, null, "if", createSourceLocation(null, @1, @4));
    }
  | IF SourceElement THEN SourceElement ELSE SourceElement
    {
      $$ = new QualifierNode($4, $2, $6, "if", createSourceLocation(null, @1, @6));
    }
  ;

Pipe
  : Pipe ">>=" SourceElement
    {
      $1.chain = [$3].concat($1.chain);
      $$ = $1;
    }
  | SourceElement ">>=" SourceElement
    {
      $$ = new PipeNode($1, [$3], createSourceLocation(null, @1, @3));
    }
  ;

Export
  : EXPORT SourceElement
    {
      $$ = new ExportNode($2, false, createSourceLocation(null, @1, @2));
    }
  ;

Destr
  : Lookup
    {
      $$ = new DestructureNode($1, 'Lookup', createSourceLocation(null, @1, @1));
    }
  | Str
    {
      $$ = new DestructureNode($1, 'String', createSourceLocation(null, @1, @1));
    }
  | Arr
    {
      $$ = new DestructureNode($1, 'Array', createSourceLocation(null, @1, @1));
    }
  | Obj
    {
      $$ = new DestructureNode($1, 'Object', createSourceLocation(null, @1, @1));
    }
  | "{" ListItems "}"
    {
      $$ = new DestructureNode($2, 'Keys', createSourceLocation(null, @1, @1));
    }
  | Tuple
    {
      $$ = new DestructureNode($1, 'Tuple', createSourceLocation(null, @1, @1));
    }
  | "[" Identifier "|" Identifier "]"
    {
      $$ = new DestructureNode([$2, $4], 'HeadTail', createSourceLocation(null, @1, @5));
    }
  | "[" Identifier "||" Identifier "]"
    {
      $$ = new DestructureNode([$2, $4], 'LeadLast', createSourceLocation(null, @1, @5));
    }
  ;

Import
  : IMPORT Destr
    {
      $$ = new ImportNode($2, null, createSourceLocation(null, @1, @2));
    }
  | IMPORT Destr FROM SourceElement
    {
      $$ = new ImportNode($2, $4, createSourceLocation(null, @1, @4));
    }
  ;

NewLines
  : NewLines NewLine
  | NewLine
  | /* empty */ {}
  ;

Assignable
  : SourceElement
    {
      $$ = $1;
    }
  | NewLines INDENT SourceElement DEDENT
    {
      $$ = $3;
    }
  ;

Assignment
  : SourceElement "=" Assignable
    {
      $$ = new AssignmentNode($1, $3, createSourceLocation(null, @1, @3));
    }
  | "{" ListItems "}" "=" Assignable
    {
      $$ = new AssignmentNode({
        type: 'Keys',
        items: $2
      }, $5, createSourceLocation(null, @1, @5));
    }
  | "[" Identifier "|" Identifier "]" "=" Assignable
    {
      $$ = new AssignmentNode({
        type: 'HeadTail',
        items: [$2, $4]
      }, $7, createSourceLocation(null, @1, @7));
    }
  | "[" Identifier "||" Identifier "]" "=" Assignable
    {
      $$ = new AssignmentNode({
        type: 'LeadLast',
        items: [$2, $4]
      }, $7, createSourceLocation(null, @1, @7));
    }
  ;

ArgSeparator
  : "," NewLine
  | ","
  ;

Args
  : Args ArgSeparator SourceElement
    {
      $$ = $1.concat($3);
    }
  | Args NewLine
    {
      $$ = $1;
    }
  | SourceElement
    {
      $$ = [$1];
    }
  ;

LineArgs
  : LineArgs "," SourceElement
    {
      $$ = $1.concat($3);
    }
  | SourceElement
    {
      $$ = [$1];
    }
  ;

FunctionCall
  : Lookup "(" ListItems ")"
    {
      $$ = new FunctionCallNode($1, {items:$3}, createSourceLocation(null, @1, @4));
    }
  | Lookup LineArgs
    {
      $$ = new FunctionCallNode($1, {items:$2}, createSourceLocation(null, @1, @2));
    }
  ;

Block
  : Block NewLine SourceElement
    {
      $$ = $1.concat($3);
    }
  | Block NewLine
    {
      $$ = $1;
    }
  | NewLine
    {
      $$ = [];
    }
  | SourceElement
    {
      $$ = [$1];
    }
  ;

Condition
  : SourceElement "->" SourceElement
    {
      $$ = { test: $1, body: [$3] };
    }
  | SourceElement NewLines INDENT Block DEDENT
    {
      $$ = { test: $1, body: $4 };
    }
  ;

Conditions
  : Conditions Condition
    {
      $$ = $1.concat($2);
    }
  | Conditions NewLine
    {
      $$ = $1;
    }
  | Condition
    {
      $$ = [$1];
    }
  ;

Cond
  : WHEN INDENT Conditions DEDENT
    {
      $$ = new CondNode($3, createSourceLocation(null, @1, @4));
    }
  ;

Caseof
  : CASEOF SourceElement INDENT Conditions DEDENT
    {
      $$ = new CaseofNode($2, $4, createSourceLocation(null, @1, @5));
    }
  ;

Catch
  : NewLines CATCH
    {
      $$ = $2;
    }
  ;

TryCatch
  : TRY INDENT Block DEDENT Catch Identifier INDENT Block DEDENT
    {
      $$ = new TryCatchNode($3, $6, $8, createSourceLocation(null, @1, @9));
    }
  | INCASE SourceElement THROWS Identifier DO SourceElement
    {
      $$ = new TryCatchNode([$2], $4, [$6], createSourceLocation(null, @1, @6));
    }
  ;

Rocket
  : "=>"
    {
      $$ = false;
    }
  | "::" "=>"
    {
      $$ = true;
    }
  ;

FnBody
  : SourceElement
    {
      $$ = [$1];
    }
  | INDENT Block DEDENT
    {
      $$ = $2;
    }
  ;

Params
  : "(" ListItems ")"
    {
      $$ = $2;
    }
  | LineArgs
    {
      $$ = $1;
    }
  | INDENT Args DEDENT
    {
      $$ = $2;
    }
  ;

Fun
  : FunctionCall Rocket FnBody
    {
      $$ = new FunNode($1, $3, $2, null, createSourceLocation(null, @1, @3));
    }
  | FunctionCall WHERE SourceElement Rocket FnBody
    {
      $$ = new FunNode($1, $5, $4, $3, createSourceLocation(null, @1, @5));
    }
  | FN Params Rocket FnBody
    {
      $$ = new FunNode($2, $4, $3, null, createSourceLocation(null, @1, @4));
    }
  | FN Rocket FnBody
    {
      $$ = new FunNode([], $3, $2, null, createSourceLocation(null, @1, @3));
    }
  ;

MatchFn
  : Params Rocket FnBody
    {
      $$ = new FunNode($1, $3, $2, null, createSourceLocation(null, @1, @3));
    }
  | Params WHERE SourceElement Rocket FnBody
    {
      $$ = new FunNode($1, $5, $4, $3, createSourceLocation(null, @1, @5));
    }
  ;

MatchFns
  : MatchFns NewLines MatchFn
    {
      $$ = $1.concat($3);
    }
  | MatchFn
    {
      $$ = [$1];
    }
  | NewLine
    {
      $$ = [];
    }
  ;

Polymorph
  : MATCH INDENT MatchFns DEDENT
    {
      $$ = new PolymorphNode($3, false, createSourceLocation(null, @1, @4));
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
  this.src = text;
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
  this.src = "{{" + body.map(function (item) { return item.src; }).join(', ') + "}}";
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

function PipeNode(initVal, chain, loc) {
  this.type = 'Pipe';
  this.initVal = initVal;
  this.chain = chain;
  this.loc = loc;
  this.shared = shared;
}

function WrapNode(item, loc) {
  this.type = 'Wrap';
  this.item = item;
  this.loc = loc;
  this.shared = shared;
}

function DestructureNode(item, destrType, loc) {
  this.type = 'Destructure';
  this.destrType = destrType;
  this.toDestructure = item;
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
n.PipeNode = PipeNode;
n.WrapNode = WrapNode;
n.DestructureNode = DestructureNode;
