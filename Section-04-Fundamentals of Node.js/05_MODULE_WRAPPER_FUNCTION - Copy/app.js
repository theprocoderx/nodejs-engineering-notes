// 'use strict';

const vm = require('vm');

const num = 20;
// vm.runInThisContext('console.log(num)');
// it gives Uncaught ReferenceError evalmachine

// vm.runInNewContext('console.log(num)', { num });
// eval('var f = 20');

const { a, sum } = loadModule('./math.js');

console.log(a);
console.log(sum);
console.log(sum(1, 2, 3, 8, 6));
function loadModule(path) {
  const fs = require('fs');
  const vm = require('vm');
  const fileContent = fs.readFileSync(path).toString();
  // console.log(fileContent);
  return (function (send) {
    // module code goes hera
    // eval(fileContent);
    vm.runInNewContext(fileContent, { send, loadModule, console });

    return send;
  })({});
}
