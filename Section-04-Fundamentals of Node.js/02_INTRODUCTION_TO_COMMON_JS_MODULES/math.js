function sum(...nums) {
  return nums.reduce((acc, curr) => acc + curr)
}
function product(...nums) {
  return nums.reduce((acc, curr) => acc * curr)
}

exports.sum = sum
exports.product = product
// module.exports.sum = sum
// module.exports.product = product

// module.exports = 'hii'

// module.exports = [sum, product]

// console.log(module.exports)

// module.exports = { sum, product }

// console.log(module.exports)
