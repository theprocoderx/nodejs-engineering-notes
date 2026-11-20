function sum(...nums) {
  return nums.reduce((acc, curr) => acc + curr);
}

// for (i = 0; i <= 10; i++) {
//   console.log(i);
// }

console.log('Hi running sum.js');
module.exports = sum;
