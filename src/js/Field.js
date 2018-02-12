/**
 * Created by Andrii_Shoferivskyi on 2018-02-09.
 */

var itemTypes = [ 
    { name: "Empty",          className: "empty",          index: 0 },
    { name: "Wall",           className: "wall",           index: 1 },
    { name: "Coin",           className: "coin",           index: 2 },
    { name: "Food",           className: "food",           index: 3 },
    { name: "Bot Small",      className: "bot_small",      index: 4 },
    { name: "Bot Medium",     className: "bot_medium",     index: 5 },
    { name: "Bot Big",        className: "bot_big",        index: 6 },
    { name: "Enemy Smallest", className: "enemy_smallest", index: 7 },
    { name: "Enemy Small",    className: "enemy_small",    index: 8 },
    { name: "Enemy Medium",   className: "enemy_medium",   index: 9 },
    { name: "Enemy Big",      className: "enemy_big",      index: 10 },
    { name: "Enemy Biggest",  className: "enemy_biggest",  index: 11 }
];

Field.itemColors = ['green', 'orange', 'red', 'black', 'yellow'];

function Field(initObj) {
    var DEFAULT_FIELD_SIZE = 8;
    
    this.matrix = [];
    this.bots = [];
    this.enemies = [];

    this.numberMatrix = [];

    var rows = initObj.rows || DEFAULT_FIELD_SIZE;
    var columns = initObj.columns || DEFAULT_FIELD_SIZE;

    this.oninit = typeof initObj.oninit === 'function' ? initObj.oninit : function () {};
    this.onchange = function () {};
    this.onStepEnd = function () {};

    for (var i = 0; i < rows; i++) {
        this.matrix[i] = [];
        this.numberMatrix[i] = [];
        for (var j = 0; j < columns; j++) {
            this.generateItem(i, j, 0);
        }
    }

    this.oninit.call(this);
    
}

Field.prototype.generateItem = function (row, column, type) {

    var item = new ItemBlock(row, column, type);
    item.color = item.isBot() ? Field.itemColors[this.bots.length] : '';
    this.matrix[row][column] = item;
    this.numberMatrix[row][column] = type;

    if (item.isBot()) {
        this.bots.push(item);
    }

    else if (item.isEnemy()) {
        this.enemies.push(item);
    }
    
    this.onchange.call(this, this.matrix[row][column]);
};

Field.prototype.setType = function (row, column, type) {
    this.matrix[row][column].type = type;
    this.numberMatrix[row][column] = type;
    this.onchange.call(this, this.matrix[row][column]);
};

Field.prototype.step = function () {
    this.enemies.forEach(this.enemyStep.bind(this));
    this.bots.forEach(this.botStep.bind(this));
    
    this.onStepEnd.call(this);
};

Field.prototype.enemyStep = function(enemy) {
    if (enemy.isDead) return;
   
    var action = enemy.getAction(this.numberMatrix);
        
    if (action === ItemBlock.actions.NOTHING) return;

    var step = enemy.getStep(action);

    var newRow = enemy.row + step.row;
    var newColumn = enemy.column + step.column;
    
    var oldRow = enemy.row;
    var oldColumn = enemy.column;

    if (newRow < 0 || newRow >= this.matrix.length) {
        return;
    } else if (newColumn < 0 || newColumn >= this.matrix[0].length) {
        return;
    }

    var itemOnStep = this.matrix[newRow][newColumn];

    if (itemOnStep.isEnemy() || itemOnStep.isFood() || itemOnStep.isCoin() || itemOnStep.isWall()) {
        return;
        
    } else if (itemOnStep.isBot()) {
        itemOnStep.getHit();
        
    } else {
        enemy.move(newRow, newColumn);
        itemOnStep.move(oldRow, oldColumn);
        this.switchItems(newRow, newColumn, oldRow, oldColumn);
    }
    
    this.onchange.call(this, enemy, itemOnStep);
};

Field.prototype.botStep = function(bot) {
    if (bot.isDead) return;
    
    var action = bot.getAction(this.numberMatrix);
    if (action === ItemBlock.actions.NOTHING) return;

    var step = bot.getStep(action);

    var newRow = bot.row + step.row;
    var newColumn = bot.column + step.column;
    
    var oldRow = bot.row;
    var oldColumn = bot.column;
    
    if (newRow < 0 || newRow >= this.matrix.length) {
        return;
    } else if (newColumn < 0 || newColumn >= this.matrix[0].length) {
        return;
    }

    var itemOnStep = this.matrix[newRow][newColumn];
    if (itemOnStep.isWall()) {
        return;
        
    } else if (itemOnStep.isEnemy() || itemOnStep.isBot()) {
        itemOnStep.getHit();
        bot.getCoins(itemOnStep);
        
    } else if (itemOnStep.isFood()) {
        itemOnStep.clear();
        bot.getFood();

    } else if (itemOnStep.isCoin()) {
        itemOnStep.clear();
        bot.getCoins(itemOnStep);
        
    } else {
        bot.move(newRow, newColumn);
        itemOnStep.move(oldRow, oldColumn);
        this.switchItems(newRow, newColumn, oldRow, oldColumn);
    }
    
    this.onchange.call(this, bot, itemOnStep);
};

Field.prototype.switchItems = function (newRow, newColumn, oldRow, oldColumn) {
    var tempItem = this.matrix[oldRow][oldColumn];
    this.matrix[oldRow][oldColumn] = this.matrix[newRow][newColumn];
    this.matrix[newRow][newColumn] = tempItem;
    
    var tempNumber = this.numberMatrix[oldRow][oldColumn];
    this.numberMatrix[oldRow][oldColumn] = this.numberMatrix[newRow][newColumn];
    this.numberMatrix[newRow][newColumn] = tempNumber;
};