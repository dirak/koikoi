const http = require('http')
const express = require('express')

const app = express()
const server = http.createServer(app)
const port = 8888

server.on('error', (err) => {
	console.error('Server error:', err)
})

server.listen(port, () => {
	console.log("Server listening on port:", port)
})