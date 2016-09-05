import { compile, nodes } from '../utils';

/*
 * Replace comments with JavaScripty comments.
 */
compile(nodes.RegexpNode, function () {
  return this.text;
});
