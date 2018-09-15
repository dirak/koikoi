//some constants for drawing stuff
const CARD_WIDTH = 45
const CARD_HEIGHT = 67
const CARD_PADDING = 5
const GAME_WIDTH = 800
const GAME_HEIGHT = 580
//calculated values
const HAND_X = (GAME_WIDTH / 2) - ( 14 * (CARD_WIDTH + CARD_PADDING) / 2 )
const HAND_TOP_Y = CARD_HEIGHT
const HAND_BOTTOM_Y = GAME_HEIGHT - CARD_HEIGHT
const DECK_X = CARD_WIDTH + CARD_PADDING
const DECK_Y = (GAME_HEIGHT / 2)
const TABLE_X = (GAME_WIDTH / 2) - (8 * (CARD_WIDTH + CARD_PADDING) / 2)
const TABLE_Y = (GAME_HEIGHT / 2) - CARD_HEIGHT/2
const DISCARD_1_X = (GAME_WIDTH / 2) + ( 4 * (CARD_WIDTH + CARD_PADDING) / 2 )
const DISCARD_5_X = DISCARD_1_X + CARD_WIDTH + CARD_PADDING * 6
const DISCARD_10_X = DISCARD_1_X
const DISCARD_20_X = DISCARD_10_X + CARD_WIDTH + CARD_PADDING * 6
const DISCARD_TOP_Y = HAND_BOTTOM_Y - CARD_HEIGHT - CARD_PADDING
const DISCARD_BOTTOM_Y = HAND_BOTTOM_Y
let config = {
	type: Phaser.AUTO,
	width: GAME_WIDTH,
	height: GAME_HEIGHT,
	parent: 'canvas',
	resolution:1.5,
	scene: {
		preload: preload,
		create: create,
		update: update
	}
}

let game = new Phaser.Game(config)

function preload() {
	this.load.multiatlas('cards', 'assets/spritesheet.json','assets')
	this.load.image('background', 'assets/background.jpg')
}

function create() {
	draw.call(this)
	bindCards.call(this)
}

function update() {
	if(state.update) {
		state.update = false
		draw.call(this)
		bindCards.call(this)
		if(state.draw) {
			this.table
				.getChildren()
				.forEach((card) => { if(card.frame.name == state.draw) card.tint = 0xffffb2 })
			this.table
				.getChildren()
				.filter((card) => state.possible.includes(card.frame.name))
				.forEach((card) => card.tint = 0xFF9999)
		}
	}
}

function bindCards() {
	//bind player hand
	Phaser.Actions.Call(this.hand.getChildren(), (card) => {
		card.setInteractive()
		card.on('pointerdown', () => {
			//clear old stuff
			this.hand.getChildren().forEach((card) => card.tint = 0xffffff)
			this.table.getChildren().forEach((card) => card.tint = 0xffffff)
			//set new stuff
			selectHand(card.frame.name)
			if(state.selected != null) {
				card.tint = 0xffffb2
				findPossibilities()
				this.table
					.getChildren()
					.filter((card) => state.possible.includes(card.frame.name))
					.forEach((card) => card.tint = 0xFF9999)
			}
		}, this)
	}, this)
	//
	//bind table
	Phaser.Actions.Call(this.table.getChildren(), (card) => {
		card.setInteractive()
		card.on('pointerdown', () => {
			selectTable(card.frame.name)
		})
	})
}

function draw() {
	console.log(this)
	//draw background
	this.add.image(0, 0, 'background').setOrigin(0)
	//
	//create opponents hand
	this.opp_hand = this.add.group({
		key: 'cards',
		frame: state.opp,
		setXY: {
			x: HAND_X,
			y: HAND_TOP_Y,
			stepX: (CARD_WIDTH + CARD_PADDING),
			stepY: 0
		}
	})
	//
	//create players hand
	this.hand = this.add.group({
		key: 'cards',
		frame: state.hand,
		setXY: {
			x: HAND_X,
			y: HAND_BOTTOM_Y,
			stepX: (CARD_WIDTH + CARD_PADDING),
			stepY: 0
		}
	})
	//
	//create table
	let split_table = splitTable(state.table)
	console.log(split_table)
	this.table = this.add.group([{
		key: 'cards',
		frame: split_table[0],
		setXY: {
			x: TABLE_X,
			y: TABLE_Y,
			stepX: (CARD_WIDTH + CARD_PADDING),
			stepY: 0
		}
	},{
		key: 'cards',
		frame: [...split_table[1], "Empty"],
		setXY: {
			x: TABLE_X,
			y: TABLE_Y + (CARD_HEIGHT + CARD_PADDING),
			stepX: (CARD_WIDTH + CARD_PADDING),
			stepY: 0
		}
	}])
	//
	//create deck
	this.deck = this.add.group({
		key: 'cards',
		frame: ['Blank','Blank','Blank','Blank'],
		setXY: {
			x: DECK_X,
			y: DECK_Y,
			stepX: -2,
			stepY: -1
		}
	})
	//
	//create discard piles
	this.discard = this.add.group([
		{//20 pile
			key: 'cards',
			frame: splitDiscard(state.player_discard, 20),
			setScale: {
				x: 0.75,
				y: 0.75
			},
			setXY: {
				x: DISCARD_20_X,
				y: DISCARD_BOTTOM_Y,
				stepX: (CARD_WIDTH * 0.75) / 4,
				stepY: 0
			}
		},
		{//10 pile
			key: 'cards',
			frame: splitDiscard(state.player_discard, 10),
			setScale: {
				x: 0.75,
				y: 0.75
			},
			setXY: {
				x: DISCARD_10_X,
				y: DISCARD_BOTTOM_Y,
				stepX: (CARD_WIDTH * 0.75) / 4,
				stepY: 0
			}
		},
		{//50 pile
			key: 'cards',
			frame: splitDiscard(state.player_discard, 5),
			setScale: {
				x: 0.75,
				y: 0.75
			},
			setXY: {
				x: DISCARD_5_X,
				y: DISCARD_TOP_Y,
				stepX: (CARD_WIDTH * 0.75) / 4,
				stepY: 0
			}
		},
		{//1 pile
			key: 'cards',
			frame: splitDiscard(state.player_discard, 1),
			setScale: {
				x: 0.75,
				y: 0.75
			},
			setXY: {
				x: DISCARD_1_X,
				y: DISCARD_TOP_Y,
				stepX: 2,
				stepY: 0
			}
		}
	])
}

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

const handleHighlights = () => {
	//i want all of this to be part of the template eventually
	if(state.draw) {
		document.getElementById(state.draw).className += " selected"
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

writeEvent("Listening to Server")

const socket = io()
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