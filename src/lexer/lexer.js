
import fs from 'fs';
import Lexer from 'lex';

let col = 0;
let lextrack = [];

const indent = [0];

const lexer = new Lexer(char => {
  throw new Error(`Unexpected character at row ${row}, col ${col}: ${char}`);
});

lexer.showPosition = function () {
  return `       Occurred at column ${col + 1}:\n\n${lextrack.join('')}\n`;
};

function track(lexeme) {
  if (lextrack.length === 50) { lextrack.shift() }
  lextrack.push(lexeme === '\n' ? '\\n' : lexeme);
  return lexeme;
}

lexer.yylineno = 0;


// Tokenization Rules

// Indentation, rows, and columns

lexer.addRule(/\n([\t\s]*)?/, function (lexeme) {
  let indentation = lexeme.length;

  lexer.yylineno ++;
  col = 0;
  this.yytext = track(lexeme);

  if (indentation > indent[0]) {
    indent.unshift(indentation);
    track('INDENT');
    return "INDENT";
  }

  let tokens = [];

  while (indentation < indent[0]) {
    tokens.push("DEDENT");
    track('DEDENT');
    indent.shift();
  }

  if (tokens.length) return tokens;
});

lexer.addRule(/./, function () {
  this.reject = true;
  col++;
}, []);

// Block comments
lexer.addRule(/\#\#\#(.|\r|\n)*?\#\#\#/, function (lexeme) {
  this.yytext = track(lexeme);
  return;
})

// Inline comments
.addRule(/\#.*($|\r\n|\r|\n)/, function (lexeme) {
  this.yytext = track(lexeme);
  return;
})

// Skip whitespace
.addRule(/\s+/, function (lexeme) {
  this.yytext = track(lexeme);
  return;
})

// Keywords

.addRule(/fn/, function (lexeme) {
  this.yytext = track(lexeme);
  return "FN";
})

.addRule(/caseof/, function (lexeme) {
  this.yytext = track(lexeme);
  return "CASEOF";
})

.addRule(/def/, function (lexeme) {
  this.yytext = track(lexeme);
  return "DEF";
})

.addRule(/end/, function (lexeme) {
  this.yytext = track(lexeme);
  return "END";
})

.addRule(/match/, function (lexeme) {
  this.yytext = track(lexeme);
  return "MATCH";
})

.addRule(/args/, function (lexeme) {
  this.yytext = track(lexeme);
  return "ARGS";
})

.addRule(/if|unless/, function (lexeme) {
  this.yytext = track(lexeme);
  return "QUALOPERATOR";
})

.addRule(/incase/, function (lexeme) {
  this.yytext = track(lexeme);
  return "INCASE";
})

.addRule(/throws/, function (lexeme) {
  this.yytext = track(lexeme);
  return "THROWS";
})

.addRule(/else/, function (lexeme) {
  this.yytext = track(lexeme);
  return "ELSE";
})

.addRule(/no/, function (lexeme) {
  this.yytext = track(lexeme);
  return "NO";
})

.addRule(/cond/, function (lexeme) {
  this.yytext = track(lexeme);
  return "COND";
})

.addRule(/for/, function (lexeme) {
  this.yytext = track(lexeme);
  return "FOR";
})

.addRule(/in/, function (lexeme) {
  this.yytext = track(lexeme);
  return "IN";
})

.addRule(/when/, function (lexeme) {
  this.yytext = track(lexeme);
  return "WHEN";
})

.addRule(/try/, function (lexeme) {
  this.yytext = track(lexeme);
  return "TRY";
})

.addRule(/catch/, function (lexeme) {
  this.yytext = track(lexeme);
  return "CATCH";
})

.addRule(/import/, function (lexeme) {
  this.yytext = track(lexeme);
  return "IMPORT";
})

.addRule(/export/, function (lexeme) {
  this.yytext = track(lexeme);
  return "EXPORT";
})

.addRule(/from/, function (lexeme) {
  this.yytext = track(lexeme);
  return "FROM";
})

.addRule(/fn/, function (lexeme) {
  this.yytext = track(lexeme);
  return "FN";
})

.addRule(/fn/, function (lexeme) {
  this.yytext = track(lexeme);
  return "FN";
})

.addRule(/fn/, function (lexeme) {
  this.yytext = track(lexeme);
  return "FN";
})

.addRule(/and|or|isnt|is|lte|gte|lt|gt|dv|rm/, function (lexeme) {
  this.yytext = track(lexeme);
  return "LOGIC";
})

.addRule(/true|false|null|undefined/, function (lexeme) {
  this.yytext = track(lexeme);
  return "SPECIALVAL";
})

// HTML

.addRule(/\<\/[^\>]+\>/, function (lexeme) {
  this.yytext = track(lexeme);
  return "CLOSER";
})

.addRule(/\</, function (lexeme) {
  this.yytext = track(lexeme);
  return "<";
})

.addRule(/\>/, function (lexeme) {
  this.yytext = track(lexeme);
  return ">";
})

.addRule(/\/\>/, function (lexeme) {
  this.yytext = track(lexeme);
  return "/>";
})

.addRule(/\<\//, function (lexeme) {
  this.yytext = track(lexeme);
  return "</";
})

// Special Patterns

.addRule(/\~[a-zA-Z\_\$][a-zA-Z0-9\_\$]*/, function (lexeme) {
  this.yytext = track(lexeme);
  return "ATOM";
})

.addRule(/\@?[a-zA-Z\_\$][a-zA-Z0-9\_\$]*/, function (lexeme) {
  this.yytext = track(lexeme);
  return "IDENTIFIER";
})

.addRule(/(\-)?[0-9]+(\.[0-9]+)?(e\-?[0-9]+)?/, function (lexeme) {
  this.yytext = track(lexeme);
  return "NUMBER";
})

.addRule(/\/[^\/\s]+\/[gim]*/, function (lexeme) {
  this.yytext = track(lexeme);
  return "REGEXP";
})

.addRule(/\"([^\"]|\\[\"])*\"/, function (lexeme) {
  this.yytext = track(lexeme);
  return "STRING";
})

.addRule(/\'([^\']|\\[\'])*\'/, function (lexeme) {
  this.yytext = track(lexeme);
  return "STRING";
})

.addRule(/\`([^\`]|\\[\`])*\`/, function (lexeme) {
  this.yytext = track(lexeme);
  return "STRING";
})

// Symbols


.addRule(/\@/, function (lexeme) {
  this.yytext = track(lexeme);
  return "IDENTIFIER";
})

.addRule(/\,/, function (lexeme) {
  this.yytext = track(lexeme);
  return ",";
})

.addRule(/\-\>/, function (lexeme) {
  this.yytext = track(lexeme);
  return "->";
})

.addRule(/\:\:/, function (lexeme) {
  this.yytext = track(lexeme);
  return "::";
})

.addRule(/\:/, function (lexeme) {
  this.yytext = track(lexeme);
  return ":";
})

.addRule(/\=\>/, function (lexeme) {
  this.yytext = track(lexeme);
  return "=>";
})

.addRule(/\=/, function (lexeme) {
  this.yytext = track(lexeme);
  return "=";
})

.addRule(/\./, function (lexeme) {
  this.yytext = track(lexeme);
  return ".";
})

.addRule(/\//, function (lexeme) {
  this.yytext = track(lexeme);
  return "/";
})

.addRule(/\|\|/, function (lexeme) {
  this.yytext = track(lexeme);
  return "||";
})

.addRule(/\+|\-|\*/, function (lexeme) {
  this.yytext = track(lexeme);
  return "OPERATOR";
})

.addRule(/\(/, function (lexeme) {
  this.yytext = track(lexeme);
  return "(";
})

.addRule(/\)/, function (lexeme) {
  this.yytext = track(lexeme);
  return ")";
})

.addRule(/\[/, function (lexeme) {
  this.yytext = track(lexeme);
  return "[";
})

.addRule(/\]/, function (lexeme) {
  this.yytext = track(lexeme);
  return "]";
})

.addRule(/\{/, function (lexeme) {
  this.yytext = track(lexeme);
  return "{";
})

.addRule(/\}/, function (lexeme) {
  this.yytext = track(lexeme);
  return "}";
})

.addRule(/\|/, function (lexeme) {
  this.yytext = track(lexeme);
  return "|";
})

.addRule(/$/, function (lexeme) {
  this.yytext = track(lexeme);
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
