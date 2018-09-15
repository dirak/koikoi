let state = {
	hand: [],
	opp: [],
	discards: [],
	table: [],
	selected: null,
	draw: null,
	possible: []
}

let messages = []

const writeEvent = (text) => {
	messages.push(text)
}

const board_source = document.getElementById("board-template").innerHTML;
const board_template = Handlebars.compile(board_source)

const drawBoard = () => {
	document.getElementById("entry").innerHTML = board_template(state)
	handleHighlights()
}

const handleHighlights = () => {
	//i want all of this to be part of the template eventually
	if(state.draw) {
		for(let possible of state.possible) {
			document.getElementById(possible).className += " possible"
		}
	}
	else if(state.selected) {
		state.possible = []
		if(state.selected !== null) document.getElementById(state.selected).className += " selected"
		for(let table_card of state.table) {
			if(checkMatch(table_card, state.selected)) {
				state.possible.push(table_card)
				document.getElementById(table_card).className += " possible"
			}
		}
		if(state.possible.length == 0) {
			state.possible.push("Empty")
			document.getElementById("Empty").className += " possible"
		}
	}
	
}

drawBoard()
writeEvent("Listening to Server")

const socket = io()
socket.on('message', writeEvent)

socket.on('state', (game_state) => {
	state = JSON.parse(game_state)
	state.table.push("Empty")
	state.messages = messages
	drawBoard()
})

document.querySelector("#knock_button").addEventListener('click',() => {
	socket.emit('message', 'knock-knock')
})

let selectHand = (card) => {
	if(!state.turn || state.draw != null) return
	state.selected = card
	drawBoard()
}

let selectTable = (card) => {
	if(!state.turn) return
	if(state.possible.includes(card)) {
		//it was one of the selections, let's send it off to the server and see
		console.log("sending selection")
		if(state.draw !== null) socket.emit('select_card', JSON.stringify([state.draw, card]))
		else socket.emit('select_card', JSON.stringify([state.selected, card]))
	}
}

let checkMatch = (a, b) => {
	//check two cards, a and b, for a match.
	//we just need to check if the suits are the same
	//since it is months, we can check the first 3 letters for matching
	//can't use 2, because ju/ly, ju/ne.
	return a.slice(0,3) == b.slice(0,3)
}