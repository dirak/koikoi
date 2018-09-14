module.exports = (players) => {
	let game = {}
	game.state = {
		hands: [],
		discards: [],
		table: [],
		turn: 0
	}

	game.state.deck = 
		//as soon as we create the game it should be populated
		//cards are split up into months, and points. not all months have all points
		//months are jan->dec, points are 20, 10, 5, 1.
		//using this for ref: http://hanafuda.richmind.net/hanafuda-cards

		Object.entries({
			'January': [20, 5, "1_1", "1_2"],
			'February': [10, 5, "1_1", "1_2"],
			'March': [20, 5, "1_1", "1_2"],
			'April': [10, 5, "1_1", "1_2"],
			'May': [10, 5, "1_1", "1_2"],
			'June': [10, 5,"1_1", "1_2"],
			'July': [10, 5, "1_1", "1_2"],
			'August': [20, 10, "1_1", "1_2"],
			'September': [10, 5, "1_1", "1_2"],
			'October': [10, 5, "1_1", "1_2"],
			'November': [20, 10, 5, "1_1"],
			'December': [20, "1_1", "1_2", "1_3"]
		}).reduce((deck, [month, cards]) => {
			return deck.concat(
				cards.map((card) => {
					return month+"_"+card
				}))
		}, [])//ok this is a huge mess just ignore it tbh

	game.turn = (player, move) => {
		console.log("player", player, game.state.turn, player == game.state.turn % 2)
		if(player == game.state.turn % 2) {
			//we're in the players turn
			let valid_turn = false
			if(game.checkMatch(...move)) {
				console.log("valid move")
				game.makeMatch(player,...move)
				//redeal to table
				game.dealToTable(player)
				//check table deal
				valid_turn = true
			}
			if(valid_turn) game.state.turn++//game state changed somehow 
		}
	}
	
	game.deal = () => {
		//deal cards out
		game.state.deck = shuffle(game.state.deck)
		for(let player of players) {
			console.log("[SERVER] Dealing to player")
			let temp = []
			for(let i = 0; i < CARDS_IN_DECK; i++) temp.push(game.state.deck.pop())
			game.state.hands.push(temp)
		}
		console.log("[SERVER] Dealing to table")
		for(let i = 0; i < CARDS_IN_DECK; i++) game.state.table.push(game.state.deck.pop())
	}

	game.dealToTable = (player) => {
		let drawnCard = game.state.deck.pop()
		//Find all possible matches on the table
		let possibleMatches = []
		for(let currentCard of game.state.table){
			if(game.checkMatch(drawnCard, currentCard)) possibleMatches.push(currentCard)
		}
		switch(possibleMatches.length){
			case 0: //No matches, put drawn card on table
				game.state.table.push(drawnCard)
				break
			case 1: //One match, put match in discard and remove from table
				game.state.discards[player].push(drawnCard)
				game.state.discards[player].push(possibleMatches[0])
				game.state.table = game.state.table.filter((c) => c !== possibleMatches[0])
				break
			case 2: //Two matches, need player to choose
				//need the player to choose between the two
				//this is a placeholder:
				game.state.discards[player].push(drawnCard)
				game.state.discards[player].push(possibleMatches[0])
				game.state.table = game.state.table.filter((c) => c !== possibleMatches[0])
			break
		}
	}

	game.checkMatch = (a, b) => {
		//check two cards, a and b, for a match.
		//we just need to check if the suits are the same
		//since it is months, we can check the first 3 letters for matching
		//can't use 2, because ju/ly, ju/ne.
		return a.slice(0,3) == b.slice(0,3)
	}

	game.makeMatch = (player,card_a, card_b) => {
		//this will take the cards and add them to the players discard pile,
		//and fill the board up appropriately
		for(let card of [card_a, card_b]){
			game.state.discards[player] = game.state.discards[player] || []//this helps us init it
			game.state.discards[player].push(card)
			game.state.hands[player] = game.state.hands[player].filter((c) => c !== card)
			game.state.table = game.state.table.filter((c) => c !== card)
		}
	}

	return game
}

const CARDS_IN_DECK = 8

/*
	Implementation of the Fisher-Yates-Shuffle
	Goes through the array backwards and swaps the current element with a random
	element at a smaller position
*/
let shuffle = (deckToShuffle) => {
	for(let i = deckToShuffle.length - 1; i > 0; i--){
		let j = Math.floor(Math.random() * (i+1))
		let temp = deckToShuffle[i]
		deckToShuffle[i] = deckToShuffle[j]
		deckToShuffle[j] = temp
	}
	return deckToShuffle
}