/**
 * Created by Andrii_Shoferivskyi on 2018-07-11.
 */

const ACTIONS = {
    FORWARD: 1,
    FORWARD_RIGHT: 2,
    RIGHT: 3,
    RIGHT_BACK: 4,
    BACK: 5,
    BACK_LEFT: 6,
    LEFT: 7,
    LEFT_FORWARD: 8,
    NOTHING: 0
};

const TYPES = {
    EMPTY: 0,
    WALL: 1,
    COIN: 2,
    FOOD: 3,
    BOT_SMALL: 4,
    BOT_MEDIUM: 5,
    BOT_BIG: 6,
    ENEMY_SMALLEST: 7,
    ENEMY_SMALL: 8,
    ENEMY_MEDIUM: 9,
    ENEMY_BIG: 10,
    ENEMY_BIGGEST: 11
};

const ACTIONS_MATRIX = [
    [ ACTIONS.LEFT_FORWARD, ACTIONS.FORWARD, ACTIONS.FORWARD_RIGHT ],
    [ ACTIONS.LEFT,         ACTIONS.NOTHING, ACTIONS.RIGHT         ],
    [ ACTIONS.BACK_LEFT,    ACTIONS.BACK,    ACTIONS.RIGHT_BACK    ]
];

// Colors of items
const ITEM_COLORS = ['green', 'orange', 'red', 'black', 'yellow'];

// Elements on field
let ITEM_TYPES = [];

for (let i in TYPES) {
    ITEM_TYPES.push({
        name: i,
        className: i.toLowerCase().replace('_', '-'),
        index: TYPES[i]
    });
}

export {
    ACTIONS,
    TYPES,
    ACTIONS_MATRIX,
    ITEM_COLORS,
    ITEM_TYPES
};
