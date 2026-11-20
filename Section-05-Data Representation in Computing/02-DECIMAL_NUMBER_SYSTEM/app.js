const digitList = [2, 4, 6, 5];
const digitList1 = [7, 3, 2];

// const num = 2 * 1 + 4 * 10 + 6 * 100 + 5 * 1000;
// const num2 = 7 * 1 + 3 * 10 + 2 * 100;

// const num3 = 7 * Math.pow(10, 0) + 3 * Math.pow(10, 1) + 2 * Math.pow(10, 2);

// console.log(num3)
// console.log(num);
// console.log(num2);

function digitsToNumbers(digits) {
  return digits.reduce(
    (acc, curr, index) => acc + curr * Math.pow(10, index),
    0
  );
}
console.log(digitsToNumbers(digitList));
console.log(digitsToNumbers(digitList1));
