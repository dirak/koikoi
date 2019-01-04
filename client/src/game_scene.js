class GameScene extends Phaser.Scene {
	constructor() {
		super({key: "Game"})
	}

	preload() {
		this.load.multiatlas('cards', 'assets/spritesheet.json','assets')
		this.load.image('background', 'assets/bg.png')
		this.highlights = this.add.group()
	}

	create() {
		socket.emit('join_room', window.location.hash.slice(1))
		this.draw()
		this.bindCards()
		document.getElementById('menu').style.display = 'none'
	}

	KoiKoiPopUp(message) {
		this.add.text(40, 140, 
			message, {
				fontSize: '32px',
				fill: '#000'
			});
	}

	update() {
		if(state.update) {
			state.update = false
			this.draw()
			if(state.handle_koi) {
				let yakus = state.yakus[state.last_koi]
				document.getElementById('koi_menu').innerHTML = "";
				let ul = document.createElement('ul')
				Object.entries(yakus).forEach((v, k) => {
					let li = document.createElement('li')
					li.innerHTML = `${k} for ${v}`
					ul.appendChild(li)
				})
				document.getElementById('koi_menu').appendChild(ul)

				let message = Object.keys(yakus).join(", ")
				let points = Object.values(yakus).reduce((a, b) => a + b, 0)
				if(state.last_koi == state.player) {
					message = "You got koi: " + message + " for a total of " + points
				} else {
					message = "They got koi: " + message + " for a total of " + points
				}
				//this.KoiKoiPopUp(message)
			} else {
				this.bindCards()
			}
			if(state.draw) {
				this.table
					.getChildren()
					.forEach((card) => {
						if(card.frame.name == state.draw) {
							this.highlightCard(card, 0xffffb2)
					 }
					})
				this.table
					.getChildren()
					.filter((card) => state.possible.includes(card.frame.name))
					.forEach((card) => {
						this.highlightCard(card, 0xff9999)
					})
			}
		}
	}

	draw() {
		this.hands = null
		this.table = null
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
	
		this.opp_discard = this.add.group([
			{//20 pile
				key: 'cards',
				frame: splitDiscard(state.opponent_discard, 20),
				setScale: {
					x: 0.75,
					y: 0.75
				},
				setXY: {
					x: DISCARD_20_X,
					y: DISCARD_OPP_BOTTOM_Y,
					stepX: (CARD_WIDTH * 0.75) / 4,
					stepY: 0
				}
			},
			{//10 pile
				key: 'cards',
				frame: splitDiscard(state.opponent_discard, 10),
				setScale: {
					x: 0.75,
					y: 0.75
				},
				setXY: {
					x: DISCARD_10_X,
					y: DISCARD_OPP_BOTTOM_Y,
					stepX: (CARD_WIDTH * 0.75) / 4,
					stepY: 0
				}
			},
			{//50 pile
				key: 'cards',
				frame: splitDiscard(state.opponent_discard, 5),
				setScale: {
					x: 0.75,
					y: 0.75
				},
				setXY: {
					x: DISCARD_5_X,
					y: DISCARD_OPP_TOP_Y,
					stepX: (CARD_WIDTH * 0.75) / 4,
					stepY: 0
				}
			},
			{//1 pile
				key: 'cards',
				frame: splitDiscard(state.opponent_discard, 1),
				setScale: {
					x: 0.75,
					y: 0.75
				},
				setXY: {
					x: DISCARD_1_X,
					y: DISCARD_OPP_TOP_Y,
					stepX: 2,
					stepY: 0
				}
			}
		])
	}

	highlightCard(card, color) {
		let rectangle = this.add.graphics()
		rectangle.lineStyle(4, color, 1)
		rectangle.strokeRect(card.x - CARD_WIDTH/2,
			card.y - CARD_HEIGHT/2,
			CARD_WIDTH,
			CARD_HEIGHT)
		this.highlights.add(rectangle)
	}

	bindCards() {
		//bind player hand
		Phaser.Actions.Call(this.hand.getChildren(), (card) => {
			card.setInteractive()
			card.on('pointerdown', () => {
				console.log(this.highlights)
				//clear old stuff
				this.highlights.clear(true)
				//set new stuff
				selectHand(card.frame.name)
				if(state.selected != null) {
					this.highlightCard(card, 0xffffb2)
					//card.tint = 0xffffb2
					findPossibilities()
					this.table
						.getChildren()
						.filter((card) => state.possible.includes(card.frame.name))
						.forEach((card) => this.highlightCard(card, 0xff9999))
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


}