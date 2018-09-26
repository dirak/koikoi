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
const DISCARD_OPP_TOP_Y = HAND_TOP_Y + CARD_HEIGHT + CARD_PADDING
const DISCARD_OPP_BOTTOM_Y = HAND_TOP_Y