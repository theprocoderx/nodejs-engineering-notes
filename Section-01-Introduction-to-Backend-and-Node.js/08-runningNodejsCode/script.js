const fs = require('fs')

const text = fs.readFileSync('C:\\Users\\user\\Desktop\\text.txt')
console.log(text.toString())

console.log(global)
console.log(globalThis)
console.log('End')
