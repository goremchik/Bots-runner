/**
 * Created by Andrii_Shoferivskyi on 2018-02-09.
 */

ItemBlock.actions = {
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

ItemBlock.types = {
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

ItemBlock.actionsMatrix = [
    [ ItemBlock.actions.LEFT_FORWARD, ItemBlock.actions.FORWARD, ItemBlock.actions.FORWARD_RIGHT ],
    [ ItemBlock.actions.LEFT,         ItemBlock.actions.NOTHING, ItemBlock.actions.RIGHT         ],
    [ ItemBlock.actions.BACK_LEFT,    ItemBlock.actions.BACK,    ItemBlock.actions.RIGHT_BACK    ]
];

function ItemBlock(row, column, type, color) {
    this.type = type > -1 ? type : ItemBlock.types.EMPTY;
    
    this.row = row;
    this.column = column;
    
    this.coins = 0;
    this.color = color || '';
    
    this.isDead = false;
    
    this.id = this.getRandom(0, 1e6);
}

ItemBlock.prototype.getRandom = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
};

ItemBlock.prototype.getAction = function(matrix) {

    var action = ItemBlock.actions.NOTHING;
    
    if (this.isEnemy()) {
        action = this.findBot(matrix);
        if (action === ItemBlock.actions.NOTHING) {
            action = this.getRandom(0, 8);
        }
        
    } else if (this.isBot()) {
        action = this.getRandom(0, 8);
    }
    
    return action;
};

ItemBlock.prototype.findBot = function(matrix) {
    for (var i = this.row - 1; i <= this.row + 1; i++) {
        if (i < 0 || i >= matrix.length) continue;
        
        for (var j = this.column - 1; j < this.column + 1; j++) {
            
            if (this.row === i && this.column === j) continue;
            if (j < 0 || j >= matrix[i].length) continue;
            
            var item = matrix[i][j];
            if (new ItemBlock(0, 0, item).isBot()) {
                return ItemBlock.actionsMatrix[i - this.row + 1][j - this.column + 1];
            }
        }
    }
    
    return ItemBlock.actions.NOTHING;
};

ItemBlock.prototype.getHit = function() {
    
    if (this.isEnemy()) {
        this.type--;
        if (this.type < ItemBlock.types.ENEMY_SMALLEST) this.die();
        
    } else if (this.isBot()) {
        this.type--;
        if (this.type < ItemBlock.types.BOT_SMALL) this.die();
    }
};

ItemBlock.prototype.die = function() {
    this.clear();
    this.isDead = true;
};

ItemBlock.prototype.clear = function() {
    this.color = '';
    this.type = 0;
};

ItemBlock.prototype.getFood = function() {
    if (this.isBot()) {
        this.type += this.type < ItemBlock.types.BOT_BIG ? 1 : 0;
    }
};

ItemBlock.prototype.getHelth = function() {
    if (this.isBot()) {
        return this.type - ItemBlock.types.BOT_SMALL + 1;
        
    } else if (this.isEnemy()) {
        return this.type - ItemBlock.types.ENEMY_SMALLEST + 1;
    }
    
    return 0;
};

ItemBlock.prototype.getCoins = function(item) {
    var COINS_PER_HP = 5;
    
    if (item.isBot() || item.isEnemy()) {
        this.coins += (item.getHelth() + 1) * COINS_PER_HP;
    } else if (item.isCoin()) {
        this.coins++;
    } else {
        this.coins += COINS_PER_HP;
    }
};

ItemBlock.prototype.move = function(newRow, newColumn) {
    this.row = newRow;
    this.column = newColumn;
};

ItemBlock.prototype.isBot = function() {
    return this.type >= ItemBlock.types.BOT_SMALL && this.type <= ItemBlock.types.BOT_BIG;
};

ItemBlock.prototype.isEnemy = function() {
    return this.type >= ItemBlock.types.ENEMY_SMALLEST && this.type <= ItemBlock.types.ENEMY_BIGGEST;
};

ItemBlock.prototype.isFood = function() {
    return this.type === ItemBlock.types.FOOD;
};

ItemBlock.prototype.isCoin = function() {
    return this.type === ItemBlock.types.COIN;
};

ItemBlock.prototype.isWall = function() {
    return this.type === ItemBlock.types.WALL;
};

ItemBlock.prototype.getStep = function(action) {
    var indexes = this.getIndexes(action);
    
    var step = {
        row: indexes.i - 1,
        column: indexes.j - 1
    };
    return step;
};

ItemBlock.prototype.getIndexes = function(action) {
    var indexes = { i: 1, j: 1 };
    
    ItemBlock.actionsMatrix.forEach(function(actionsRow, rowIndex) {
        var columnIndex = actionsRow.indexOf(action);
        if (columnIndex > -1) {
            indexes.i = rowIndex;
            indexes.j = columnIndex;
        }
    });
    
    return indexes;
};
