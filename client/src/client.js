const writeEvent = (text) => {
	const parent = document.querySelector("#debug_events")
	const el = document.createElement("li")

	el.innerHTML = text
	parent.appendChild(el)
}

const writeHand = (hand) => {
	hand = JSON.parse(hand)
	const hand_el = document.querySelector("#your_hand")
	for(var card of hand) {
		console.log(card)
		let card_el = document.createElement("img")
		card_el.src = "/assets/cards/"+card+".png"
		hand_el.appendChild(card_el)
	}
}

const writeTable = (table) => {
	table = JSON.parse(table)
	const table_el = document.querySelector("#table")
	for(var card of table) {
		console.log(card)
		let card_el = document.createElement("img")
		card_el.src = "/assets/cards/"+card+".png"
		table_el.appendChild(card_el)
	}
}

writeEvent("Listening to Server")

const socket = io()
socket.on('message', writeEvent)
socket.on('hand', writeHand)
socket.on('table', writeTable)

document.querySelector("#knock_button").addEventListener('click',() => {
	socket.emit('message', 'knock-knock')
})

//writeHand('["June_1","September_10","May_5","December_1","February_5","December_20","May_1","August_1"]')