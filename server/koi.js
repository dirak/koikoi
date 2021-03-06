module.exports = (players) => {
	let game = {}
	game.state = {
		table: [],
		hands: [],
		discards: [],
		turn: 0,
		possible: [],
		yakus: [],
		last_koi: null,
		handle_koi: false,
		draw: null
	}
	//as soon as we create the game it should be populated
	//cards are split up into months, and points. not all months have all points
	//months are jan->dec, points are 20, 10, 5, 1.
	//using this for ref: http://hanafuda.richmind.net/hanafuda-cards
	game.state.deck = Object.entries({
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

	for(player of players) {
		game.state.discards.push([])
		game.state.yakus.push({})
	}

	game.checkTurn = (player) => { return player == game.state.turn % 2 }

	game.turn = (player, move) => {
		console.log("player", player, game.state.turn, player == game.state.turn % 2)
		if(game.checkTurn(player)) {
			//we're in the players turn
			let valid_turn = false
			if(move.includes("Empty")) {
				//we are placing a card on the table
				game.placeOnTable(player, ...move)
				valid_turn = game.dealToTable(player)
			}
			else if(game.checkMatch(...move)) {
				game.makeMatch(player,...move)
				//redeal to table
				valid_turn = game.dealToTable(player)
			}
			if(valid_turn) game.state.turn++
			return valid_turn
		}
		return false 
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

	game.placeOnTable = (player, card, _empty) => {
		game.state.hands[player] = game.state.hands[player].filter((c) => c !== card)
		game.state.table.push(card)
	}

	game.dealToTable = (player) => {
		if(game.state.draw != null && game.state.possible.length != 0) {
			console.log("This is a draw match")
			game.state.draw = null
			game.state.possible = []
			return true
		}
		
		let drawnCard = game.state.deck.pop()
		//Find all possible matches on the table
		let possibleMatches = []
		for(let currentCard of game.state.table){
			if(game.checkMatch(drawnCard, currentCard)) possibleMatches.push(currentCard)
		}
		switch(possibleMatches.length){
			case 0: //No matches, put drawn card on table
				console.log("pushing to table", drawnCard)
				game.state.table.push(drawnCard)
				return true
			case 1: case 2:
				game.state.possible = possibleMatches
				game.state.table.push(drawnCard)
				game.state.draw = drawnCard
				console.log(game.state.possible, drawnCard)
				return false
		}
	}
	//returns an object with a yaku code and point value
	game.checkForYakus = (player) =>{
		let yakus = {}
		yakus['kasu'] = kasu(game.state, player)
		yakus['tan'] = tan(game.state, player)
		yakus['akatan'] = akatan(game.state, player)
		yakus['aotan'] = aotan(game.state, player)
		yakus['akatanAotanNoChokufu'] = akatanAotanNoChokufu(game.state, player)
		yakus['tane'] = tane(game.state, player)
		yakus['inoshikacho'] = inoshikacho(game.state, player)
		yakus['light'] = light(game.state, player)
		yakus['tsukimiDeIppai'] = tsukimiDeIppai(game.state, player)
		yakus['hanamiDeIppai'] = hanamiDeIppai(game.state, player)
		console.log("yakus", yakus)
		return Object.filter(yakus, yaku => yaku > 0)
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
			game.state.discards[player].push(card)
			game.state.hands[player] = game.state.hands[player].filter((c) => c !== card)
			game.state.table = game.state.table.filter((c) => c !== card)
		}
	}

	return game
}

const CARDS_IN_DECK = 8

//10 1-Point Cards
//returns 0 if there are less
//else, returns number of points gained
/*let kasu = (player) => {
	let numberOfCards = 0
	for(let currentCard of discards[player]){
		if(currentCard.split('_')[1]== '1') numberOfCards += 1
	}
	if(numberOfCards < 10) return 0
	return numberOfCards - 9
}
*/
let kasu = (state, player) => {
    return Math.max(0, state.discards[player].filter((card) => card.split('_')[1] == 1).length - 9)
}

//5 5-Point Cards
//returns 0 if there are less
//else, returns number of points gained
/*let tan = (player) => {
	let numberOfCards = 0
	for(let currentCard of game.discards[player]){
		if(currentCard.split('_')[1] == '5') numberOfCards += 1
	}
	if(numberOfCards < 5) return 0
	return numberOfCards - 4
}*/
let tan = (state, player) => {
	return Math.max(0, state.discards[player].filter((card) => card.split('_')[1] == 5).length - 4)
}

//3 red poem tanzaku (5pt) + 1pt for each add. tanzaku
let akatan = (state, player) => {
	//return game.discards[player].includes('January_5')&&game.discards[player].includes('February_5')&&game.discards[player].includes('March_5') ? game.discards[player].filter((card) => card.split('_')[1] == 5).length + 2 : 0
	if(state.discards[player].includes('January_5')&&state.discards[player].includes('February_5')&&state.discards[player].includes('March_5')){
		return state.discards[player].filter((card) => card.split('_')[1] == 5).length + 2
	}
	return 0
}

//3 blue tanzaku (5pt) + 1pt for each additional tanzaku
let aotan = (state, player) => {
	if(state.discards[player].includes('June_5')&&state.discards[player].includes('September_5')&&state.discards[player].includes('October_5')){
		return state.discards[player].filter((card) => card.split('_')[1] == 5).length + 2
	}
	return 0
}

//aotan and akatan (10pt) + 1pt for each additional tanzaku
let akatanAotanNoChokufu = (state, player) => {
	if(akatan(state, player) > 0 && aotan(state, player) > 0){
		return state.discards[player].filter((card) => card.split('_')[1] == 5).length + 4
	} else return 0
}

//5 10pt-cards (1pt) + 1pt for each add. 10pt card
let tane = (state, player) => {
	return Math.max(0, state.discards[player].filter((card) => card.split('_')[1] == 10).length - 4)
}

//Boar, Deer, Butterfly (5pt) + 1pt for each add. 10pt card
let inoshikacho = (state, player) => {
	if(state.discards[player].includes('June_10')&&state.discards[player].includes('July_10')&&state.discards[player].includes('October_10')){
		return state.discards[player].filter((card) => card.split('_')[1] == 10).length + 2
	}
	return 0
}

//Moon and Sake Cup (5pt)
let tsukimiDeIppai = (state, player) => {
	if(state.discards[player].includes('August_20')&&state.discards[player].includes('September_10')){
		return 5
	}
	return 0
}

//Curtain and Sake Cup (5pt)
let hanamiDeIppai = (state, player) => {
	if(state.discards[player].includes('March_20')&&state.discards[player].includes('September_10')){
		return 5
	}
	return 0	
}

//This is Sanko(3light), Ame Shiko (four light with rain), Shiko (four light without rain) and Goko (five light) all in one
let light = (state, player) => {
	switch (state.discards[player].filter((card) => card.split('_')[1] == 20).length){
		default:
			return 0
		case 3:
			return 5
		case 4:
			if(state.discards[player].includes('November_20')) return 7
			else return 8
		case 5:
			return 10
	}
}


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

Object.filter = (obj, predicate) => 
    Object.keys(obj)
          .filter( key => predicate(obj[key]) )
          .reduce( (res, key) => (res[key] = obj[key], res), {} );
