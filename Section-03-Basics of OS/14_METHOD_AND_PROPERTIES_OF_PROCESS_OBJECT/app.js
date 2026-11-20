const fs = require('fs')
const path = require('path')
process.chdir('./tmp')
const dependencyPath = process.cwd() // get the current working directory

console.log(dependencyPath)

fs.readdir('.', (err, files) => {
  if (err) {
    console.error('Error reading directory:', err)
    return
  }

  console.log('Files in current directory:')

  files.forEach((file) => {
    console.log(file)
  })
})
