let game = {}
game.state = {
	hand: [],
	opp: [],
	discards: [],
	table: [],
	selected: null,
	possible: []
}

let messages = []

const writeEvent = (text) => {
	messages.push(text)
}

const board_source = document.getElementById("board-template").innerHTML;
const board_template = Handlebars.compile(board_source)

const drawBoard = () => {
	document.getElementById("entry").innerHTML = board_template(game.state)
	handleHighlights()
}

const handleHighlights = () => {
	if(game.state.selected) {
		game.state.possible = []
		document.getElementById(game.state.selected).className += " selected"
		for(let table_card of game.state.table) {
			if(checkMatch(table_card, game.state.selected)) {
				game.state.possible.push(table_card)
				document.getElementById(table_card).className += " possible"
			}
		}
		if(game.state.possible.length == 0) {
			game.state.possible.push("Empty")
			document.getElementById("Empty").className += " possible"
		}
	}
	
}

drawBoard()
writeEvent("Listening to Server")

const socket = io()
socket.on('message', writeEvent)

socket.on('state', (state) => {
	game.state = JSON.parse(state)
	game.state.table.push("Empty")
	game.state.messages = messages
	drawBoard()
})

document.querySelector("#knock_button").addEventListener('click',() => {
	socket.emit('message', 'knock-knock')
})

let selectHand = (card) => {
	game.state.selected = card
	drawBoard()
}

let selectTable = (card) => {
	console.log(card)
	if(game.state.possible.includes(card)) {
		//it was one of the selections, let's send it off to the server and see
		console.log("sending selection")
		socket.emit('select_card', JSON.stringify([game.state.selected, card]))
	}
}

let checkMatch = (a, b) => {
	//check two cards, a and b, for a match.
	//we just need to check if the suits are the same
	//since it is months, we can check the first 3 letters for matching
	//can't use 2, because ju/ly, ju/ne.
	return a.slice(0,3) == b.slice(0,3)
}