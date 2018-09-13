const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const koi = require('./koi')

const port = 8888
const clientpath = `${__dirname}/../client`
const app = express()

app.use(express.static(clientpath))//tell our app where the files to serve exist
console.log("Serving files from:", clientpath)

const server = http.createServer(app)//create the server, this will help us handle http requests

const io = socketio(server)//communication with the client

//in the future we want to split these up into rooms so we can have multiple games going
let players = []
let new_game = null

io.on('connection', (socket) => {
	console.log("Received connection")

	if(players.length == 0) {
		players.push(socket)
		socket.emit("message", "Waiting for another player ...")
	} else if(players.length == 1) {
		players.push(socket)
		players.map((socket) => socket.emit("message", "Two players connected. Game starting"))	
		startNewGame()
	}

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

let startNewGame = () => {
	new_game = koi(players)
	new_game.deal()
	players[0].emit("hand", JSON.stringify(new_game.state.hands[0]))
	players[1].emit("hand", JSON.stringify(new_game.state.hands[1]))
}