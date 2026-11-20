const fs = require('fs')
//  Write in file

// const text = fs.writeFileSync(
//   'C:\\Users\\user\\Desktop\\text.txt',
//   'Your content hear, hi!!!'
// // )

// Reade a file

// const textWrite = fs.readFileSync('C:\\Users\\user\\Desktop\\text.txt')
// console.log(textWrite.toString())
// console.log(text)

// Rename a file
// const renameFile = fs.renameSync(
//   'C:\\Users\\user\\Desktop\\text.txt',
//   'C:\\Users\\user\\Desktop\\newFile.txt'
// )
// Delete a file
// fs.unlinkSync('C:\\Users\\user\\Desktop\\newFile.txt')
const { exec } = require('child_process')
  // exec('start chrome')
  // exec('start chrome https://google.com')
  .exec('"C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe"')
