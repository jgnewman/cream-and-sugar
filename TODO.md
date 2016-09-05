- add more pattern match techniques
  - guards on pattern matches
  - to consider: [a, b, c], {a, b}, [a, b, {c, d}]
- what about threads and message passing?







// Quickly spin up a web worker from a function
function makeWorker(fn) {
  var body = fn.toString().replace(/^[^\{]+\{/, '').replace(/\}\s*$/, '');
  if (typeof Worker !== 'undefined') {
    return new Worker(new Blob([body], {type: 'text/javascript'}));
  } else {
    var cp = require('child_process');
    return cp.fork(null, [], {execPath: 'node',execArgv: ['-e', body]});
  }
}

// Create classes dynamically
function createClass(extensions, prototype) {
  if (arguments.length === 1) { prototype = extensions; extensions = []; }
  function Class(...args) {
    return prototype.constructor ? prototype.constructor.call(this, ...args) : undefined;
  }
  const ext = extensions.map(e => e.prototype).concat(prototype);
  Class.prototype = Object.assign({}, ...ext);
  return Class;
}

// Frack, the iframe runs in the same thread
function buildFrame(code) {
  var iframe = document.createElement('iframe');
  iframe.setAttribute('height', '100px');
  iframe.setAttribute('width', '100%');
  document.body.appendChild(iframe);
  iframe.src =
    'javascript:void((function(){var script = document.createElement(\'script\');' +
    'script.innerHTML = "(function() {' +
    'document.open();document.domain=\'' + document.domain +
    '\';document.close();})();";' +
    'document.write("<head>" + script.outerHTML + "</head><body></body>");})())';
  iframe.contentWindow.document.write(`
    <script>
      (function () {
        function wasteTime() {
          var arr = Array(10000000).fill(new Date());
          return arr.map(function (each) {
            return each.setMonth(6);
          });
        }
        wasteTime();
        console.log('finished');
        ${code || ''}
      }).call(window.parent.parent);
    </script>
  `);
}
