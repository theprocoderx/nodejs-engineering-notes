const http = require('http')

const server = http.createServer((req, res) => {
  console.log(req)
  res.end('Hello from nodejs server. Hii every one')
})
server.listen(3300)
