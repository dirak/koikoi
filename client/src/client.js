let game = {}
game.state = {
	hand: [],
	opp: [],
	discards: [],
	table: []
}

const writeEvent = (text) => {
	const parent = document.querySelector("#debug_events")
	const el = document.createElement("li")
	el.innerHTML = text
	parent.appendChild(el)
}

const board_source = document.getElementById("board-template").innerHTML;
const board_template = Handlebars.compile(board_source)

const drawBoard = () => {
	console.log(game.state)
	document.getElementById("entry").innerHTML = board_template(game.state)
}

drawBoard()
writeEvent("Listening to Server")

const socket = io()
socket.on('message', writeEvent)

socket.on('state', (state) => {
	game.state = JSON.parse(state)
	drawBoard()
})

document.querySelector("#knock_button").addEventListener('click',() => {
	socket.emit('message', 'knock-knock')
})
