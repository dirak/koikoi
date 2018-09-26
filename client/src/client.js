

let config = {
	type: Phaser.AUTO,
	width: GAME_WIDTH,
	height: GAME_HEIGHT,
	parent: 'canvas',
	scene: [MenuScene, GameScene]
}

let game = new Phaser.Game(config)

let state = {
	hand: [],
	opp: [],
	player_discard: [],
	opponent_discard: [],
	table: [],
	selected: null,
	draw: null,
	possible: [],
	update: false
}

let messages = []

const writeEvent = (text) => {
	messages.push(text)
}

writeEvent("Listening to Server")

const socket = io()

socket.on('room_joined', (room) => {
	console.log("Joined the room: ", room)
	history.pushState(null, null, `#${room}`)
})

socket.on('message', writeEvent)

socket.on('state', (game_state) => {
	state = JSON.parse(game_state)
	state.messages = messages
	state.update = true
})

let selectHand = (card) => {
	if(!state.turn || state.draw != null) return
	state.selected = card
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

//helper function for drawing discard piles
let splitDiscard = (discard, point) => {
	return discard.filter((card) => card.split('_')[1] == point)
}

let splitTable = (table) => {
	let chunk = Math.ceil(table.length / 2)
	return [table.slice(0, chunk), table.slice(chunk)]
}

let findPossibilities = () => {
	state.possible = []
	for(let card of state.table) {
		if(checkMatch(state.selected, card)) {
			state.possible.push(card)
		}
	}
	if(state.possible.length == 0) state.possible.push("Empty")
	console.log(state.possible)
}