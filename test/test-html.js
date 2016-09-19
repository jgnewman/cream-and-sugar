import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Html', () => {

  it('should compile a basic, self-closing html node', () => {
    assert.equal('CNS_SYSTEM.createElement("br", {}, [])', compileCode('<br/>'));
  });

  it('should compile a self-closing html node with a string attribute', () => {
    assert.equal('CNS_SYSTEM.createElement("br", {id: "foo"}, [])', compileCode('<br id="foo"/>'));
  });

  it('should compile a self-closing html node with a code attribute', () => {
    assert.equal('CNS_SYSTEM.createElement("br", {id: 2 + 2}, [])', compileCode('<br id={2 + 2}/>'));
  });

  it('should compile an empty html node with attributes', () => {
    const toCompile = `<div className="foo bar"></div>`;
    const expected = `CNS_SYSTEM.createElement("div", {className: "foo bar"}, [])`;
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile an empty html node with attributes on new lines', () => {
    const toCompile = `<div
      className="foo bar"
      dataBaz={quux}></div>`;
    const expected = `CNS_SYSTEM.createElement("div", {className: "foo bar", dataBaz: quux}, [])`;
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

  it('should compile an html node with children', () => {
    const toCompile = `<div
      className="foo bar"
      dataBaz={ quux }>
      <ul>
        <li className="foo"></li>
        <li className={ bar(baz) }></li>
      </ul>
    </div>`;
    const expected = nlToSpace(`CNS_SYSTEM.createElement("div", {className: "foo bar", dataBaz: quux}, [
      CNS_SYSTEM.createElement("ul", {}, [
        CNS_SYSTEM.createElement("li", {className: "foo"}, []),
        CNS_SYSTEM.createElement("li", {className: bar(baz)}, [])
      ])
    ])`);
    assert.equal(expected, nlToSpace(compileCode(toCompile)));
  });

});
