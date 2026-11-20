// const [sum, product] = 'Magan' //because string is also itrable its a example
// const [sum, product] = require('./math') // array is also itrable
// const math = require('./math')
const { sum, product } = require('./math')

// console.log(sum, product) // its string iteration output log
// console.log(math)
console.log(sum(1, 2, 3, 4))
console.log(product(1, 2, 3, 4))
