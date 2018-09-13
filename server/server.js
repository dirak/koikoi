const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const port = 8888
const clientpath = `${__dirname}/../client`
const app = express()

app.use(express.static(clientpath))//tell our app where the files to serve exist
console.log("Serving files from:", clientpath)

const server = http.createServer(app)//create the server, this will help us handle http requests

const io = socketio(server)//communication with the client

io.on('connection', (socket) => {
	console.log("Received connection")
	socket.emit('message', '[SERVER]:You have been connected')

	socket.on('message', (text) => {
		socket.broadcast.emit('message', text)//send to everyone BUT the original client
	})
})

server.on('error', (err) => {
	console.error('Server error:', err)
})

server.listen(port, () => {
	console.log("Server listening on port:", port)
})