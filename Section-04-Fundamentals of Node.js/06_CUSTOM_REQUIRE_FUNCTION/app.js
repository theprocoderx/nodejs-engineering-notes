('use strict');
const { a } = loadModule('./math.js');
const num = 5;
const vm = require('vm');
// vm.runInNewContext('console.log(num)', { num });
// vm.runInThisContext('var a = 5');
// eval('var a =5');

console.log(a);
function loadModule(path) {
  const fs = require('fs');
  const vm = require('vm');
  const fileContent = fs.readFileSync(path).toString();
  // console.log(fileContent);
  return (function (send) {
    // module code goes hera
    // eval(fileContent);
    vm.runInNewContext(fileContent, { send, loadModule });
    return send;
  })({});
}
