import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Html', () => {

  it('should compile a basic, self-closing html node', () => {
    assert.equal(compileCode('<br/>').trim(), 'CNS_.createElement("br", {}, []);');
  });

  it('should compile a self-closing html node with a string attribute', () => {
    assert.equal(compileCode('<br id="foo"/>').trim(), 'CNS_.createElement("br", {id: "foo"}, []);');
  });

  it('should compile a self-closing html node with a code attribute', () => {
    assert.equal(compileCode('<br id={2 + 2}/>').trim(), 'CNS_.createElement("br", {id: 2 + 2}, []);');
  });

  it('should allow for parentheses instead of brackets', () => {
    assert.equal(compileCode('<br id=(2 + 2)/>').trim(), 'CNS_.createElement("br", {id: 2 + 2}, []);');
  });

  it('should compile an empty html node with attributes', () => {
    const toCompile = `<div className="foo bar"></div>`;
    const expected = `CNS_.createElement("div", {className: "foo bar"}, []);`;
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile an empty html node with attributes on new lines', () => {
    const toCompile = `<div\n  className="foo bar"\n  dataBaz={quux}\n></div>`;
    const expected = `CNS_.createElement("div", {className: "foo bar", dataBaz: quux}, []);`;
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

  it('should compile an html node with children', () => {
    const toCompile = '<div\n'
                    + '  className="foo bar"\n'
                    + '  dataBaz={ quux }\n'
                    + '>\n'
                    + '  <ul>\n'
                    + '    <li className="foo"></li>\n'
                    + '    <li className={ bar baz }></li>\n'
                    + '  </ul>\n'
                    + '</div>';
    const expected = nlToSpace(`CNS_.createElement("div", {className: "foo bar", dataBaz: quux}, [
      CNS_.createElement("ul", {}, [
        CNS_.createElement("li", {className: "foo"}, []),
        CNS_.createElement("li", {className: bar(baz)}, [])
      ])
    ]);`);
    assert.equal(nlToSpace(compileCode(toCompile)), expected);
  });

});
