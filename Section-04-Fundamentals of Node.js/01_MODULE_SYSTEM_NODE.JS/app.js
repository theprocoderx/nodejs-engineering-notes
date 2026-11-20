// Implicit Global Variable is created on the global object:scope => golobal. location => windows object section and
// in nodejs Implicit Global Variable is created on the Scope → Global, Location → global object
sanjay = 45
console.log(sanjay)

// In browsers, global var variables are also attached to window. So:
// Scope → Global Scope Location → window.num
// In Node.js, var does NOT become part of global.
var num = 45
console.log(num)

// This is explicitly attached to the Node.js global object.
// This will cause an error in browsers because global does not exist there.
// Output: ReferenceError: global is not defined
global.num2 = 67

console.log(num2)
