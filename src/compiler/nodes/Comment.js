import { compile, nodes } from '../utils';

/*
 * Replace comments with JavaScripty comments.
 */
compile(nodes.CommentNode, function () {
  return `// ${this.text}`;
});
