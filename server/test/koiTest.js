const assert = require('assert')
const koi = require('../koi')

describe('koi', function(){
    let players = []
    let game = koi(players)
    describe('checking for yakus', function(){
        describe('checking for kasu', function(){
            it('check empty', function(){
                game.state.discards[0] = []
                let result = kasu(game.state, 0)
                assert.equal(result, 0)
            })
            it('check no yaku', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'August_20', 'February_1_1',
                                            'October_10', 'February_1_2',
                                            'May_1_1', 'May_1_2',
                                            'May_10', 'October_5'          ]
                let result = kasu(game.state, 0)
                assert.equal(result, 0)
            })
            it('check exact', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'February_1_1', 'February_1_2',
                                            'March_1_1', 'March_1_2',
                                            'April_1_1', 'April_1_2',
                                            'May_1_1', 'May_1_2'            ]
                let result = kasu(game.state, 0)
                assert.equal(result, 1)
            })
            it('check exact with extra cards', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'August_20', 'February_1_1',
                                            'October_10', 'February_1_2',
                                            'March_1_1', 'March_1_2',
                                            'April_1_1', 'April_1_2',
                                            'May_1_1', 'May_1_2',
                                            'May_10', 'October_5'          ]
                let result = kasu(game.state, 0)
                assert.equal(result, 1)
            })
            it('check surplus', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'February_1_1', 'February_1_2',
                                            'March_1_1', 'March_1_2',
                                            'April_1_1', 'April_1_2',
                                            'May_1_1', 'May_1_2',
                                            'June_1_1', 'June_1_2'           ]
                let result = kasu(game.state, 0)
                assert.equal(result, 3)
            })
        })

        describe('check for tan', function(){
            it('check empty', function(){
                game.state.discards[0] = []
                let result = tan(game.state, 0)
                assert.equal(result, 0)
            })
            it('check no yaku', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'August_20', 'February_1_1',
                                            'October_10', 'February_1_2',
                                            'May_1_1', 'May_1_2',
                                            'May_10', 'October_5'          ]
                let result = tan(game.state, 0)
                assert.equal(result, 0)
            })
            it('check exact', function(){
                game.state.discards[0] = [  'January_5', 'February_5',
                                            'March_5', 'April_5',
                                            'May_5']
                let result = tan(game.state, 0)
                assert.equal(result, 1)
            })
            it('check exact with extra cards', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'January_5', 'February_5',
                                            'March_5', 'April_5',
                                            'May_5', 'April_1_2',
                                            'May_1_1', 'May_1_2',
                                            'May_10'         ]
                let result = tan(game.state, 0)
                assert.equal(result, 1)
            })
            it('check surplus', function(){
                game.state.discards[0] = [  'January_5', 'February_5',
                                            'March_5', 'April_5',
                                            'May_5', 'June_5',
                                            'July_5'          ]
                let result = tan(game.state, 0)
                assert.equal(result, 3)
            })
        })

        describe('check for akatan', function(){
            it('check empty', function(){
                game.state.discards[0] = []
                let result = akatan(game.state, 0)
                assert.equal(result, 0)
            })
            it('check no yaku', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'August_20', 'February_1_1',
                                            'October_10', 'February_1_2',
                                            'May_1_1', 'May_1_2',
                                            'May_10', 'October_5'          ]
                let result = akatan(game.state, 0)
                assert.equal(result, 0)
            })
            it('check exact', function(){
                game.state.discards[0] = [  'January_5', 'February_5',
                                            'March_5']
                let result = akatan(game.state, 0)
                assert.equal(result, 5)
            })
            it('check exact with extra cards', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'January_5', 'February_5',
                                            'March_5', 'April_1_2',
                                            'May_1_1', 'May_1_2',
                                            'May_10'         ]
                let result = akatan(game.state, 0)
                assert.equal(result, 5)
            })
            it('check surplus', function(){
                game.state.discards[0] = [  'January_5', 'February_5',
                                            'March_5', 'April_5',
                                            'May_5', 'June_5',
                                            'July_5'          ]
                let result = akatan(game.state, 0)
                assert.equal(result, 9)
            })
        })

        describe('check for aotan', function(){
            it('check empty', function(){
                game.state.discards[0] = []
                let result = aotan(game.state, 0)
                assert.equal(result, 0)
            })
            it('check no yaku', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'August_20', 'February_1_1',
                                            'October_10', 'February_1_2',
                                            'May_1_1', 'May_1_2',
                                            'May_10', 'October_5'          ]
                let result = aotan(game.state, 0)
                assert.equal(result, 0)
            })
            it('check exact', function(){
                game.state.discards[0] = [  'June_5', 'September_5',
                                            'October_5']
                let result = aotan(game.state, 0)
                assert.equal(result, 5)
            })
            it('check exact with extra cards', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'June_5', 'September_5',
                                            'October_5', 'April_1_2',
                                            'May_1_1', 'May_1_2',
                                            'May_10'         ]
                let result = aotan(game.state, 0)
                assert.equal(result, 5)
            })
            it('check surplus', function(){
                game.state.discards[0] = [  'January_5', 'February_5',
                                            'March_5', 'April_5',
                                            'May_5', 'June_5',
                                            'September_5', 'October_5' ]
                let result = aotan(game.state, 0)
                assert.equal(result, 10)
            })
        })

        describe('check for Akatan Aotan No Chõfuku', function(){
            it('check empty', function(){
                game.state.discards[0] = []
                let result = akatanAotanNoChokufu(game.state, 0)
                assert.equal(result, 0)
            })
            it('check no yaku', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'August_20', 'February_1_1',
                                            'October_10', 'February_1_2',
                                            'May_1_1', 'May_1_2',
                                            'May_10', 'October_5'          ]
                let result = akatanAotanNoChokufu(game.state, 0)
                assert.equal(result, 0)
            })
            it('check exact', function(){
                game.state.discards[0] = [  'January_5', 'February_5',
                                            'June_5', 'September_5',
                                            'March_5', 'October_5']
                let result = akatanAotanNoChokufu(game.state, 0)
                assert.equal(result, 10)
            })
            it('check exact with extra cards', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'June_5', 'September_5',
                                            'October_5', 'April_1_2',
                                            'May_1_1', 'May_1_2',
                                            'May_10', 'January_5',
                                            'February_5', 'March_5']
                let result = akatanAotanNoChokufu(game.state, 0)
                assert.equal(result, 10)
            })
            it('check surplus', function(){
                game.state.discards[0] = [  'January_5', 'February_5',
                                            'March_5', 'April_5',
                                            'May_5', 'June_5',
                                            'September_5', 'October_5' ]
                let result = akatanAotanNoChokufu(game.state, 0)
                assert.equal(result, 12)
            })
        })

        describe('check for tane', function(){
            it('check empty', function(){
                game.state.discards[0] = []
                let result = tane(game.state, 0)
                assert.equal(result, 0)
            })
            it('check no yaku', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'August_20', 'February_1_1',
                                            'October_10', 'February_1_2',
                                            'May_1_1', 'May_1_2',
                                            'May_10', 'October_5'          ]
                let result = tane(game.state, 0)
                assert.equal(result, 0)
            })
            it('check exact', function(){
                game.state.discards[0] = [  'February_10', 'April_10',
                                            'May_10', 'June_10',
                                            'July_10']
                let result = tane(game.state, 0)
                assert.equal(result, 1)
            })
            it('check exact with extra cards', function(){
                game.state.discards[0] = [  'July_10', 'January_1_2',
                                            'February_10', 'September_5',
                                            'October_5', 'April_10',
                                            'May_1_1', 'June_10',
                                            'May_10'       ]
                let result = tane(game.state, 0)
                assert.equal(result, 1)
            })
            it('check surplus', function(){
                game.state.discards[0] = [  'February_10', 'April_10',
                                            'May_10', 'June_10',
                                            'July_10', 'August_10',
                                            'September_10', 'October_10' ]
                let result = tane(game.state, 0)
                assert.equal(result, 4)
            })
        })

        describe('check for inoshikachõ', function(){
            it('check empty', function(){
                game.state.discards[0] = []
                let result = inoshikacho(game.state, 0)
                assert.equal(result, 0)
            })
            it('check no yaku', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'August_20', 'February_1_1',
                                            'October_10', 'February_1_2',
                                            'May_1_1', 'May_1_2',
                                            'May_10', 'October_5'          ]
                let result = inoshikacho(game.state, 0)
                assert.equal(result, 0)
            })
            it('check exact', function(){
                game.state.discards[0] = [  'June_10', 'July_10',
                                            'October_10']
                let result = inoshikacho(game.state, 0)
                assert.equal(result, 5)
            })
            it('check exact with extra cards', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'June_10', 'September_5',
                                            'October_10', 'April_1_2',
                                            'May_1_1', 'May_1_2',
                                            'July_10'         ]
                let result = inoshikacho(game.state, 0)
                assert.equal(result, 5)
            })
            it('check surplus', function(){
                game.state.discards[0] = [  'June_10', 'July_10',
                                            'October_10', 'May_10',
                                            'February_10', 'August_10',
                                            'November_10' ]
                let result = inoshikacho(game.state, 0)
                assert.equal(result, 9)
            })
        })

        describe('check for Tsukimi De Ippai', function(){
            it('check empty', function(){
                game.state.discards[0] = []
                let result = tsukimiDeIppai(game.state, 0)
                assert.equal(result, 0)
            })
            it('check no yaku', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'August_20', 'February_1_1',
                                            'October_10', 'February_1_2',
                                            'May_1_1', 'May_1_2',
                                            'May_10', 'October_5'          ]
                let result = tsukimiDeIppai(game.state, 0)
                assert.equal(result, 0)
            })
            it('check exact', function(){
                game.state.discards[0] = [  'September_10', 'August_20']
                let result = tsukimiDeIppai(game.state, 0)
                assert.equal(result, 5)
            })
            it('check exact with extra cards', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'August_20', 'September_5',
                                            'October_5', 'September_10',
                                            'May_1_1', 'May_1_2',
                                            'May_10',         ]
                let result = tsukimiDeIppai(game.state, 0)
                assert.equal(result, 5)
            })
        })

        describe('check for Hanami De Ippai', function(){
            it('check empty', function(){
                game.state.discards[0] = []
                let result = hanamiDeIppai(game.state, 0)
                assert.equal(result, 0)
            })
            it('check no yaku', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'August_20', 'February_1_1',
                                            'October_10', 'February_1_2',
                                            'May_1_1', 'May_1_2',
                                            'May_10', 'October_5'          ]
                let result = hanamiDeIppai(game.state, 0)
                assert.equal(result, 0)
            })
            it('check exact', function(){
                game.state.discards[0] = [  'September_10', 'March_20']
                let result = hanamiDeIppai(game.state, 0)
                assert.equal(result, 5)
            })
            it('check exact with extra cards', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'March_20', 'September_5',
                                            'October_5', 'September_10',
                                            'May_1_1', 'May_1_2',
                                            'May_10'        ]
                let result = hanamiDeIppai(game.state, 0)
                assert.equal(result, 5)
            })
        })

        describe('check for Light', function(){
            it('check empty', function(){
                game.state.discards[0] = []
                let result = light(game.state, 0)
                assert.equal(result, 0)
            })
            it('check no yaku', function(){
                game.state.discards[0] = [  'January_1_1', 'January_1_2',
                                            'August_20', 'February_1_1',
                                            'October_10', 'February_1_2',
                                            'May_1_1', 'May_1_2',
                                            'May_10', 'October_5'          ]
                let result = light(game.state, 0)
                assert.equal(result, 0)
            })
            it('check 3 Light', function(){
                game.state.discards[0] = [  'January_20', 'March_20', 'August_20']
                let result = light(game.state, 0)
                assert.equal(result, 5)
            })
            it('check 3 Light with extra cards', function(){
                game.state.discards[0] = [  'January_20', 'February_5',
                                            'March_20', 'August_20',
                                            'September_10']
                let result = light(game.state, 0)
                assert.equal(result, 5)
            })
            it('check 4 Light with rain', function(){
                game.state.discards[0] = [  'January_20', 'March_20',
                                            'November_20', 'December_20']
                let result = light(game.state, 0)
                assert.equal(result, 7)
            })
            it('check 4 Light without rain', function(){
                game.state.discards[0] = [  'January_20', 'March_20',
                                            'August_20', 'December_20']
                let result = light(game.state, 0)
                assert.equal(result, 8)
            })
            it('check 5 Light', function(){
                game.state.discards[0] = [  'January_20', 'March_20',
                                            'August_20', 'November_20',
                                            'December_20'       ]
                let result = light(game.state, 0)
                assert.equal(result, 10)
            })
        })
    })
})

//10 1-Point Cards
//returns 0 if there are less
//else, returns number of points gained
let kasu = (state, player) => {
    return Math.max(0, state.discards[player].filter((card) => card.split('_')[1] == 1).length - 9)
}

//5 5-Point Cards
//returns 0 if there are less
//else, returns number of points gained
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