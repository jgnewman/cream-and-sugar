
import fs from 'fs';
import Lexer from 'lex';

let row = 1;
let col = 1;

const indent = [0];

const lexer = new Lexer(char => {
  throw new Error(`Unexpected character at row ${row}, col ${col}: ${char}`);
});

// Track rows and columns

lexer.addRule(/(\r\n|\r|\n)/, function (lexeme) {
  row++;
  col = 1;
  this.yytext = lexeme;
  return "NEWLINE";
}, []);

lexer.addRule(/./, function () {
  this.reject = true;
  col++;
}, []);

// Tokenization Rules

// Indentation

lexer.addRule(/\n[\t\s]*/, function (lexeme) {
  let indentation = lexeme.length;

  if (indentation > indent[0]) {
    indent.unshift(indentation);
    return ["NEWLINE", "INDENT"];
  }

  let tokens = [];

  while (indentation < indent[0]) {
    tokens.push("NEWLINE");
    tokens.push("DEDENT");
    indent.shift();
  }

  if (tokens.length) return tokens;
});

// Block comments
lexer.addRule(/\#\#\#(.|\r|\n)*?\#\#\#/, function (lexeme) {
  return;
})

// Inline comments
.addRule(/\#.*($|\r\n|\r|\n)/, function (lexeme) {
  this.yytext = lexme;
  return "NEWLINE";
})

// Skip whitespace
.addRule(/\s+/, function (lexeme) {
  return;
})

// Keywords

.addRule(/fn/, function (lexeme) {
  this.yytext = lexeme;
  return "FN";
})

.addRule(/caseof/, function (lexeme) {
  this.yytext = lexeme;
  return "CASEOF";
})

.addRule(/def/, function (lexeme) {
  this.yytext = lexeme;
  return "DEF";
})

.addRule(/end/, function (lexeme) {
  this.yytext = lexeme;
  return "END";
})

.addRule(/match/, function (lexeme) {
  this.yytext = lexeme;
  return "MATCH";
})

.addRule(/args/, function (lexeme) {
  this.yytext = lexeme;
  return "ARGS";
})

.addRule(/if|unless/, function (lexeme) {
  this.yytext = lexeme;
  return "QUALOPERATOR";
})

.addRule(/incase/, function (lexeme) {
  this.yytext = lexeme;
  return "INCASE";
})

.addRule(/throws/, function (lexeme) {
  this.yytext = lexeme;
  return "THROWS";
})

.addRule(/else/, function (lexeme) {
  this.yytext = lexeme;
  return "ELSE";
})

.addRule(/no/, function (lexeme) {
  this.yytext = lexeme;
  return "NO";
})

.addRule(/cond/, function (lexeme) {
  this.yytext = lexeme;
  return "COND";
})

.addRule(/for/, function (lexeme) {
  this.yytext = lexeme;
  return "FOR";
})

.addRule(/in/, function (lexeme) {
  this.yytext = lexeme;
  return "IN";
})

.addRule(/when/, function (lexeme) {
  this.yytext = lexeme;
  return "WHEN";
})

.addRule(/try/, function (lexeme) {
  this.yytext = lexeme;
  return "TRY";
})

.addRule(/catch/, function (lexeme) {
  this.yytext = lexeme;
  return "CATCH";
})

.addRule(/import/, function (lexeme) {
  this.yytext = lexeme;
  return "IMPORT";
})

.addRule(/export/, function (lexeme) {
  this.yytext = lexeme;
  return "EXPORT";
})

.addRule(/from/, function (lexeme) {
  this.yytext = lexeme;
  return "FROM";
})

.addRule(/fn/, function (lexeme) {
  this.yytext = lexeme;
  return "FN";
})

.addRule(/fn/, function (lexeme) {
  this.yytext = lexeme;
  return "FN";
})

.addRule(/fn/, function (lexeme) {
  this.yytext = lexeme;
  return "FN";
})

.addRule(/and|or|isnt|is|lte|gte|lt|gt|dv|rm/, function (lexeme) {
  this.yytext = lexeme;
  return "LOGIC";
})

.addRule(/true|false|null|undefined/, function (lexeme) {
  this.yytext = lexeme;
  return "SPECIALVAL";
})

// HTML

.addRule(/\<\/[^\>]+\>/, function (lexeme) {
  this.yytext = lexeme;
  return "CLOSER";
})

.addRule(/\</, function (lexeme) {
  this.yytext = lexeme;
  return "<";
})

.addRule(/\>/, function (lexeme) {
  this.yytext = lexeme;
  return ">";
})

.addRule(/\/\>/, function (lexeme) {
  this.yytext = lexeme;
  return "/>";
})

.addRule(/\<\//, function (lexeme) {
  this.yytext = lexeme;
  return "</";
})

// Special Patterns

.addRule(/\~[a-zA-Z\_\$][a-zA-Z0-9\_\$]*/, function (lexeme) {
  this.yytext = lexeme;
  return "ATOM";
})

.addRule(/\@?[a-zA-Z\_\$][a-zA-Z0-9\_\$]*/, function (lexeme) {
  this.yytext = lexeme;
  return "IDENTIFIER";
})

.addRule(/(\-)?[0-9]+(\.[0-9]+)?(e\-?[0-9]+)?/, function (lexeme) {
  this.yytext = lexeme;
  return "NUMBER";
})

.addRule(/\/[^\/\s]+\/[gim]*/, function (lexeme) {
  this.yytext = lexeme;
  return "REGEXP";
})

.addRule(/\"([^\"]|\\[\"])*\"/, function (lexeme) {
  this.yytext = lexeme;
  return "STRING";
})

.addRule(/\'([^\']|\\[\'])*\'/, function (lexeme) {
  this.yytext = lexeme;
  return "STRING";
})

.addRule(/\`([^\`]|\\[\`])*\`/, function (lexeme) {
  this.yytext = lexeme;
  return "STRING";
})

// Symbols


.addRule(/\@/, function (lexeme) {
  this.yytext = lexeme;
  return "IDENTIFIER";
})

.addRule(/\,/, function (lexeme) {
  this.yytext = lexeme;
  return ",";
})

.addRule(/\-\>/, function (lexeme) {
  this.yytext = lexeme;
  return "->";
})

.addRule(/\:\:/, function (lexeme) {
  this.yytext = lexeme;
  return "::";
})

.addRule(/\:/, function (lexeme) {
  this.yytext = lexeme;
  return ":";
})

.addRule(/\=\>/, function (lexeme) {
  this.yytext = lexeme;
  return "=>";
})

.addRule(/\=/, function (lexeme) {
  this.yytext = lexeme;
  return "=";
})

.addRule(/\./, function (lexeme) {
  this.yytext = lexeme;
  return ".";
})

.addRule(/\//, function (lexeme) {
  this.yytext = lexeme;
  return "/";
})

.addRule(/\|\|/, function (lexeme) {
  this.yytext = lexeme;
  return "||";
})

.addRule(/\+|\-|\*/, function (lexeme) {
  this.yytext = lexeme;
  return "OPERATOR";
})

.addRule(/\(/, function (lexeme) {
  this.yytext = lexeme;
  return "(";
})

.addRule(/\)/, function (lexeme) {
  this.yytext = lexeme;
  return ")";
})

.addRule(/\[/, function (lexeme) {
  this.yytext = lexeme;
  return "[";
})

.addRule(/\]/, function (lexeme) {
  this.yytext = lexeme;
  return "]";
})

.addRule(/\{/, function (lexeme) {
  this.yytext = lexeme;
  return "{";
})

.addRule(/\}/, function (lexeme) {
  this.yytext = lexeme;
  return "}";
})

.addRule(/\|/, function (lexeme) {
  this.yytext = lexeme;
  return "|";
})

.addRule(/$/, function (lexeme) {
  this.yytext = lexeme;
  return "EOF";
});

export function lex() {
  const code = fs.readFileSync('./test/lexcheck.cns').toString();

  lexer.setInput(code + '\n');
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
  console.log(lexer.lex());
};

export function getLexer() {
  return lexer;
};
