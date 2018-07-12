
import ItemBlock from './ItemBlock';
import { ITEM_COLORS, ACTIONS, TYPES } from './constants';
import { getRandom } from './helper';

const DEFAULT_FIELD_SIZE = 8;

export default class Field {

    constructor({ rows = DEFAULT_FIELD_SIZE, columns = DEFAULT_FIELD_SIZE, oninit,  enemies = 0, bots = 0, coins = 0, health = 0, updateFieldItem = () => {} }) {
        this.matrix = [];
        this.bots = [];
        this.enemies = [];

        this.numberMatrix = [];

        this.oninit = typeof oninit === 'function' ? oninit : () => {};

        this.onchange = () => {};

        this.onStepEnd = () => {};

        for (let i = 0; i < rows; i++) {
            this.matrix[i] = [];
            this.numberMatrix[i] = [];

            for (let j = 0; j < columns; j++) {
                this.generateItem(i, j, TYPES.EMPTY);
            }
        }

        this.generateRandomItems(enemies, TYPES.ENEMY_BIGGEST);
        this.generateRandomItems(bots,    TYPES.BOT_BIG);
        this.generateRandomItems(coins,   TYPES.COIN);
        this.generateRandomItems(health,  TYPES.FOOD);

        this.oninit(this);
    }

    generateRandomItems(amount, type) {
        for (let i = 0; i < amount; i++) {
            let { column, row } = this.getRandomEmptyCell();
            this.generateItem(row, column, type, this.bots.length);


        }
    }

    getRandomEmptyCell() {
        let emptyCells = [].concat(...this.matrix)
                           .filter(item => item.type === TYPES.EMPTY)
                           .map( ({ column, row }) => ({ column, row }));

        return emptyCells[getRandom(0, emptyCells.length)];
    }

    generateItem(row, column, type, botsAmount) {

        let item = new ItemBlock(row, column, type);
        item.color = item.isBot() ? ITEM_COLORS[botsAmount] : '';
        console.log(item.color);
        this.matrix[row][column] = item;
        this.numberMatrix[row][column] = type;

        if (item.isBot()) {
            this.bots.push(item);
        }

        else if (item.isEnemy()) {
            this.enemies.push(item);
        }

        this.onchange(this.matrix[row][column]);
    };

    // setType(row, column, type) {
    //     this.matrix[row][column].type = type;
    //     this.numberMatrix[row][column] = type;
    //     this.onchange(this.matrix[row][column]);
    // };

    step() {
        this.enemies.forEach(this.enemyStep.bind(this));
        this.bots.forEach(this.botStep.bind(this));

        this.onStepEnd(this);
    };

    enemyStep(enemy) {
        if (enemy.isDead) { return; }

        let action = enemy.getAction(this.numberMatrix);

        if (action === ACTIONS.NOTHING) { return; }

        let step = enemy.getStep(action);

        let newRow = enemy.row + step.row;
        let newColumn = enemy.column + step.column;

        let oldRow = enemy.row;
        let oldColumn = enemy.column;

        if (newRow < 0 || newRow >= this.matrix.length) {
            return;
        } else if (newColumn < 0 || newColumn >= this.matrix[0].length) {
            return;
        }

        let itemOnStep = this.matrix[newRow][newColumn];

        if (itemOnStep.isEnemy() || itemOnStep.isFood() || itemOnStep.isCoin() || itemOnStep.isWall()) {
            return;

        } else if (itemOnStep.isBot()) {
            itemOnStep.getHit();

        } else {
            enemy.move(newRow, newColumn);
            itemOnStep.move(oldRow, oldColumn);
            this.switchItems(newRow, newColumn, oldRow, oldColumn);
        }

        this.onchange(enemy, itemOnStep);
    };

    botStep(bot) {
        if (bot.isDead) { return; }

        let action = bot.getAction(this.numberMatrix);
        if (action === ACTIONS.NOTHING) { return; }

        let step = bot.getStep(action);

        let newRow = bot.row + step.row;
        let newColumn = bot.column + step.column;

        let oldRow = bot.row;
        let oldColumn = bot.column;

        if (newRow < 0 || newRow >= this.matrix.length) {
            return;
        } else if (newColumn < 0 || newColumn >= this.matrix[0].length) {
            return;
        }

        let itemOnStep = this.matrix[newRow][newColumn];
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

        this.onchange(bot, itemOnStep);
    };

    switchItems(newRow, newColumn, oldRow, oldColumn) {
        let tempItem = this.matrix[oldRow][oldColumn];
        this.matrix[oldRow][oldColumn] = this.matrix[newRow][newColumn];
        this.matrix[newRow][newColumn] = tempItem;

        let tempNumber = this.numberMatrix[oldRow][oldColumn];
        this.numberMatrix[oldRow][oldColumn] = this.numberMatrix[newRow][newColumn];
        this.numberMatrix[newRow][newColumn] = tempNumber;
    };
}
