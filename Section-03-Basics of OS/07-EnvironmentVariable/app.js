const fs = require('fs')
const fileData = fs.readFileSync('./.env').toString()
console.log(fileData.split('\n'))

fileData.split(/\r?\n/).forEach((variable) => {
  const [key, value] = variable.split('=')
  console.log(key, value)
  process.env[key] = value
})

setInterval(() => {
  const a = process.env
  console.log('hii')
}, 1000)

// const environmentVariables = process.env

// setInterval(() => {
//   console.log(environmentVariables)
// }, 1000)

// converting environment varible by using nodejs
// const { exec } = require('child_process')
// exec(`powershell -Command "setx VARIABLE_NAME 'Magan Singh2' /M"`)
