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
let rooms = {}

let new_game = {}


io.on('connection', (socket) => {
	//now we just bind new room or join room
	socket.on('join_room', (room) => {
		console.log(`Received connection on room ${room}`) 
		if(room == null || room == "") room = Math.random().toString(36).slice(2, 9)
		if(!(room in rooms)) rooms[room] = []
		socket.join(room)
		socket.emit("room_joined", room)
		
		socket.on('message', (text) => {
			io.to(room).emit('message', text)//send to everyone BUT the original client
		})
		
		let player = rooms[room].length
		if(player == 0) {
			rooms[room].push(socket)
			socket.emit("message", "Waiting for another player ...")
		} else if(player == 1) {
			rooms[room].push(socket)
			io.to(room).emit('message', 'Two players connected. Game starting')
			startNewGame(room)
			updateState(room)
		}

		socket.on('select_card', (packet) => {
			console.log("Received a card selection")
			let valid_turn = new_game[room].turn(player, JSON.parse(packet))
			if(valid_turn) {
				let yakus = new_game[room].checkForYakus(player)
				if(Object.keys(yakus).length > 0) {
					//we should probably put this in the actual game state
					//no reason to alter state outside of koi.js
					new_game[room].state.yakus[player] = yakus
					new_game[room].state.last_koi = player
					new_game[room].state.handle_koi = true
				}
			}
			console.log("valid turn:", valid_turn)
			updateState(room)
		})
	})
})

server.on('error', (err) => {
	console.error('Server error:', err)
})

server.listen(port, () => {
	console.log("Server listening on port:", port)
})

let startNewGame = (room) => {
	let game = koi(rooms[room])
	game.deal()
	new_game[room] = game
}

let updateState = (room) => {
	let game = new_game[room]
	for(let [i, player] of rooms[room].entries()) {
		//the opponent will always be the value that we aren't
		//so if we are 1, then they are 0.
		//if we are 0, they are 1
		//the shorthand for this is i+1 mod 2:
		//i = 0, 1 mod 2 = 1
		//i = 1, 2 mod 2 = 0
		let opponent = (i+1)%rooms[room].length
		let hidden_hand = []
		hidden_hand.length = game.state.hands[opponent].length
		hidden_hand.fill("Blank")
		let clean_state = {
			hand: game.state.hands[i],
			player_discard: game.state.discards[i],
			opponent_discard: game.state.discards[opponent],
			table: game.state.table,
			draw: game.state.draw,
			selected: null,//clear our selection. not sure if necessary
			possible: game.state.possible,
			opp: hidden_hand,
			turn: game.checkTurn(i),
			last_koi: game.state.last_koi,
			yakus: game.state.yakus,
			handle_koi: game.state.handle_koi,
			player: i
		}
		player.emit("state", JSON.stringify(clean_state))
	}
}