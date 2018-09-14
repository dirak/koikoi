"use strict"

const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const koi = require('./koi')

const port = 8888
const clientpath = `${__dirname}/../client/`
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
	let player = players.length
	if(players.length == 0) {
		players.push(socket)
		socket.emit("message", "Waiting for another player ...")
	} else if(players.length == 1) {
		players.push(socket)
		players.map((socket) => socket.emit("message", "Two players connected. Game starting"))	
		startNewGame()
		updateState()
	}

	socket.on('message', (text) => {
		socket.broadcast.emit('message', text)//send to everyone BUT the original client
	})

	socket.on('select_card', (packet) => {
		console.log("Received a card selection")
		new_game.turn(player, JSON.parse(packet))
		updateState()
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
}

let updateState = () => {
	for(let [i, player] of players.entries()) {
		//the opponent will always be the value that we aren't
		//so if we are 1, then they are 0.
		//if we are 0, they are 1
		//the shorthand for this is i+1 mod 2:
		//i = 0, 1 mod 2 = 1
		//i = 1, 2 mod 2 = 0
		let opponent = (i+1)%2
		let hidden_hand = []
		hidden_hand.length = new_game.state.hands[opponent].length
		hidden_hand.fill("blank")
		let clean_state = {
			hand: new_game.state.hands[i],
			discards: new_game.state.discards,
			table: new_game.state.table,
			opp: hidden_hand
		}
		player.emit("state", JSON.stringify(clean_state))
	}
}