import { compile, nodes } from '../utils';

/*
 * Translate exports 1-1.
 */
compile(nodes.ExportNode, function () {
  // Native Export
  // return `export ${this.isDefault ? 'default ' : ''}${this.toExport.compile(true)}`;

  // Traditional Export
  // Experimenting with this to see if it helps us import modules in separate threads.
  // You can only export a tuple. No `as`.
  // You can not do a `default` export.
  this.shared.lib.add('exp');
  this.shared.lib.add('aritize');
  return `${this.toExport.map(item => {
      const compiled = item.name.compile(true);
      const aritize = 'CNS_SYSTEM.aritize(' + compiled + ', ' + item.arity.compile(true) + ')';
      return 'CNS_SYSTEM.exp("' + compiled + '", ' + aritize + ')';
  }).join(';\n')}`;
});
