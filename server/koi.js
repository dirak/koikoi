module.exports = (players) => {
	let game = {}

	game.state = {
		hands: [],
		discards: [],
		table: [],
	}

	game.state.deck = 
		//as soon as we create the game it should be populated
		//cards are split up into months, and points. not all months have all points
		//months are jan->dec, points are 20, 10, 5, 1.
		//using this for ref: http://hanafuda.richmind.net/hanafuda-cards

		Object.entries({
			'January': [20, 5, 1, 1],
			'February': [10, 5, 1, 1],
			'March': [20, 5, 1, 1],
			'April': [10, 5, 1, 1],
			'May': [10, 5, 1, 1],
			'June': [10, 5, 1, 1],
			'July': [10, 5, 1, 1],
			'August': [20, 10, 1, 1],
			'September': [10, 5, 1, 1],
			'October': [10, 5, 1, 1],
			'November': [20, 10, 5, 1],
			'December': [20, 1, 1, 1]
		}).reduce((deck, [month, cards]) => {
			return deck.concat(
				cards.map((card) => {
					return month+":"+card
				}))
		}, [])//ok this is a huge mess just ignore it tbh

	game.turn = (players) => {
		let turn = 0//just incrementing
		return (player, move) => {
			if(player == players[turn % 2]) {
				//we're in the players turn
				let valid_turn = false

				if(valid_turn) turn++//game state changed somehow 
			}
		}
	}
	
	game.deal = () => {
		//deal cards out
		console.log(shuffle(game.state.deck))
	}

	game.checkMatch = (a, b) => {
		//check two cards, a and b, for a match.
		//we just need to check if the suits are the same
		//since it is months, we can check the first 3 letters for matching
		//can't use 2, because ju/ly, ju/ne.
		return a.slice(0,3) == b.slice(0,3)
	}

	game.makeMatch = (player, card_a, card_b) => {
		//this will take the cards and add them to the players discard pile,
		//and fill the board up appropriately
	}

	return game
}

/*
	Implementation of the Fisher-Yates-Shuffle
	Goes through the array backwards and swaps the current element with a random
	element at a smaller position
*/
let shuffle = (deckToShuffle) => {
	for(let i = deckToShuffle.length - 1; i > 0; i--){
		let j = Math.floor(Math.random() * (i+1))
		let temp = deckToShuffle[i];
		deckToShuffle[i] = deckToShuffle[j];
		deckToShuffle[j] = temp;
	}
	return deckToShuffle
}