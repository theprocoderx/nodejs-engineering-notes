function sum(...nums) {
  return nums.reduce((acc, curr) => acc + curr);
}

function product(...nums) {
  return nums.reduce((acc, curr) => acc * curr);
}

// module.exports.sum = sum;
// module.exports.product = product;
exports.sum = sum;
exports.product = product;

// console.log(module.exports);

// module.exports = { sum, product };
// module.exports = [sum, product];
// module.exports = 'hii';
// console.log(module.exports);
