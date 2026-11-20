function sum(...nums) {
  return nums.reduce((acc, curr) => acc + curr)
}
function product(...nums) {
  return nums.reduce((acc, curr) => acc * curr)
}
module.exports = { sum, product }
console.log(module.exports)
// let send = module.exports
// exports.sum = sum
// exports.product = product

// module.exports.sum = sum
// module.exports.product = product
// console.log(module.exports === exports)
// module.exports = 'hii'

// module.exports = [sum, product]

// console.log(module.exports)

// console.log(module.exports)
