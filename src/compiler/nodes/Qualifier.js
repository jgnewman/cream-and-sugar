import { compile, nodes } from '../utils';

/*
 * Turn qualifiers into function calls so that
 * they can always return a value.
 */
compile(nodes.QualifierNode, function () {
  const conditionBase = this.condition.compile(true);
  // Make the contition negative if the keyword was "unless"
  const condition = this.keyword === 'if' ? conditionBase : `!(${conditionBase})` ;
  const elseCase = !this.elseCase ? '' : `, function () {
    return ${this.elseCase.compile(true)};
  }.bind(this)`;
  this.shared.lib.add('qualify');
  return `CNS_SYSTEM.qualify(${condition}, function () {
    return ${this.action.compile(true)};
  }.bind(this)${elseCase})`.replace(/\s+/g, ' ');
});
