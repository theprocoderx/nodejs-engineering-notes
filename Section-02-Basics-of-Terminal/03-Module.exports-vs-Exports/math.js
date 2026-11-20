function sum(...nums) {
  return nums.reduce((acc, curr) => acc + curr);
}

function product(...nums) {
  return nums.reduce((acc, curr) => acc * curr);
}

exports = { sum, product };

console.log(module);

// exports = {
//   name: 'sanjay',
//   pin: 212203,
// };

// module.exports.sum = sum;
// module.exports.product = product;
// let exports = module.exports;

// let send = module.exports;

// send.sum = sum;
// send.product = product;

// exports.sum = sum;
// exports.product = product;

// console.log(module.exports === exports);

// console.log(module.exports);

// module.exports = [sum, product];
// module.exports = 'hii';
// console.log(module.exports);
