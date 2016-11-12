var CNS_ = require("cns-lib");

//**END LIBRARY**//
const React = require('react');
const ReactDOM = require('react-dom');



function reactify () {
    const args = CNS_.args(arguments);
    if (args.length === 1 && CNS_.match(args, [["Identifier","fnList"]])) {
      const fnList = args[0];
      return reactify(fnList, {});
    } else if (args.length === 2 && CNS_.match(args, [["Arr",[]],["Identifier","accum"]])) {
      const accum = args[1];
      return React.createClass(accum);
    } else if (args.length === 2 && CNS_.match(args, [["HeadTail",["hd","tl"]],["Identifier","accum"]])) {
      const hd = args[0][0];
const tl = args[0].slice(1);
const accum = args[1];
      return reactify(tl, CNS_.update(hd.name, hd, accum));
    } else {
      throw new Error('No match found for functional pattern match statement.');
    }
  };


function factorial () {
    const args = CNS_.args(arguments);
    if (args.length === 1 && CNS_.match(args, [["Number","0"]])) {
      
      return 1;
    } else if (args.length === 1 && CNS_.match(args, [["Identifier","n"]])) {
      const n = args[0];
      return n * factorial(n - 1);
    } else {
      throw new Error('No match found for functional pattern match statement.');
    }
  };

function render () {
  var ref0_ = this.props;
const calc = ref0_.calc;
return CNS_.createElement("h1", {}, [
`Hello, friends. The factorial of ${calc} is ${factorial(calc)}`
]);
};
const Title = reactify([factorial, render]);
ReactDOM.render(CNS_.createElement(Title, {calc: 5}, []), CNS_.dom('#app'));
const process = CNS_.spawn(function () {
  return CNS_.receive(function () {
    const args = CNS_.args(arguments);
    if (args.length === 1 && CNS_.match(args, [["Identifier","msg"]])) {
      const msg = args[0];
      return CNS_.reply(`I got ${msg}`);
    } else {
      throw new Error('No match found for match statement.');
    }
  });
});
CNS_.receive(function () {
    const args = CNS_.args(arguments);
    if (args.length === 1 && CNS_.match(args, [["Identifier","msg"]])) {
      const msg = args[0];
      return console.log(msg);
    } else {
      throw new Error('No match found for match statement.');
    }
  });
CNS_.send(process, 'THIS IS AN OFFICIAL MESSAGE');
