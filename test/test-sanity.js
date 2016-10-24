import assert from 'assert';
import { shrink } from './utils';
import { compileCode } from  '../src/compiler/compiler';
import fs from 'fs';
import path from 'path';

describe('Sanity Check', () => {

  it('should pass a basic sanity check', () => {
    const toCompile = fs.readFileSync(path.resolve(__dirname, '../test/sanitycheck.cream')).toString();
    assert.ok(compileCode(toCompile));
  });

});
