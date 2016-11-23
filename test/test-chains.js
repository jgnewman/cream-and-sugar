import assert from 'assert';
import { nlToSpace } from './utils';
import { compileCode } from  '../src/compiler/compiler';

describe('Chains', () => {

  it('should compile a method chain', () => {
    const toCompile = 'chain\n'
                    + '  jQuery "#id"\n'
                    + '  addClass "foo"\n\n';
    const expected = 'jQuery("#id").addClass("foo");';
    assert.equal(compileCode(toCompile).trim(), expected);
  });

});
