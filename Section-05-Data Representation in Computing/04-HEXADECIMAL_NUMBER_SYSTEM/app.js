const digitList = [2, 4, 6, 5];
const digitList1 = [7, 3, 2];
const digitList3 = [0, 1, 0, 1, 1, 0];

const octalNum1 = 0o12;
const octalNum2 = 237;
const octalNum3 = 0o4523;

const hexNum1 = 0x843;
const hexNum2 = 0x45a;

const binNum1 = 0b1011

// console.log(octalNum3);
// const num = 2 * 1 + 4 * 10 + 6 * 100 + 5 * 1000;
// const num2 = 7 * 1 + 3 * 10 + 2 * 100;

// const num3 = 7 * Math.pow(10, 0) + 3 * Math.pow(10, 1) + 2 * Math.pow(10, 2);

// console.log(num3)
// console.log(num);
// console.log(num2);

function digitsToNumber(digits, radix = 10) {
  return digits.reduce((acc, curr, index) => {
    let digit;

    // Handle hexadecimal digit symbols and string digits
    if (radix === 16 && typeof curr === 'string') {
      const normalized = curr.toUpperCase();

      if (!/^[0-9A-F]$/.test(normalized)) {
        throw new Error(`Invalid hexadecimal digit: ${curr}`);
      }

      digit =
        normalized >= 'A' ? normalized.charCodeAt(0) - 55 : Number(normalized);
    } else {
      digit = Number(curr);
    }

    // Validate digit for the selected base
    if (!Number.isInteger(digit) || digit < 0 || digit >= radix) {
      throw new Error(`Invalid digit ${curr} for base ${radix}`);
    }

    // Positional-value calculation
    return acc + digit * radix ** index;
  }, 0);
}

console.log(digitsToNumber(digitList, 8));
console.log(digitsToNumber(digitList3, 2));
