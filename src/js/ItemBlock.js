
import { TYPES, ACTIONS, ACTIONS_MATRIX } from './constants';
import { getRandom, getBotAction } from './helper';

const COINS_PER_HP = 5;

export default class ItemBlock {

    constructor(row, column, type, color) {
        this.type = type > -1 ? type : TYPES.EMPTY;

        this.row = row;
        this.column = column;

        this.coins = 0;
        this.color = color || '';

        this.isDead = false;

        this.id = getRandom(0, 1e9);
    }

    getAction(matrix) {

        let action = ACTIONS.NOTHING;

        if (this.isEnemy()) {
            action = this.findBot(matrix);
            if (action === ACTIONS.NOTHING) {
                action = getRandom(0, 8);
            }

        } else if (this.isBot()) {
            action = getBotAction(matrix);
        }

        return action;
    };

    findBot(matrix) {
        for (let i = this.row - 1; i <= this.row + 1; i++) {
            if (i < 0 || i >= matrix.length) { continue; }

            for (let j = this.column - 1; j < this.column + 1; j++) {

                if (this.row === i && this.column === j) { continue; }
                if (j < 0 || j >= matrix[i].length) { continue; }

                let item = matrix[i][j];
                if (new ItemBlock(0, 0, item).isBot()) {
                    return ACTIONS_MATRIX[i - this.row + 1][j - this.column + 1];
                }
            }
        }

        return ACTIONS.NOTHING;
    };

    getHit() {
        if (this.isEnemy()) {
            this.type--;
            if (this.type < TYPES.ENEMY_SMALLEST) { this.die(); }

        } else if (this.isBot()) {
            this.type--;
            if (this.type < TYPES.BOT_SMALL) { this.die(); }
        }
    };

    die() {
        this.clear();
        this.isDead = true;
    };

    clear() {
        this.color = '';
        this.type = 0;
    };

    getFood() {
        if (this.isBot()) {
            this.type += this.type < TYPES.BOT_BIG ? 1 : 0;
        }
    };

    getHealth() {
        if (this.isBot()) {
            return this.type - TYPES.BOT_SMALL + 1;

        } else if (this.isEnemy()) {
            return this.type - TYPES.ENEMY_SMALLEST + 1;
        }

        return 0;
    };

    getCoins(item) {

        if (item.isBot() || item.isEnemy()) {
            this.coins += (item.getHealth() + 1) * COINS_PER_HP;
        } else if (item.isCoin()) {
            this.coins++;
        } else {
            this.coins += COINS_PER_HP;
        }
    };

    move(newRow, newColumn) {
        this.row = newRow;
        this.column = newColumn;
    };

    isBot() {
        return this.type >= TYPES.BOT_SMALL && this.type <= TYPES.BOT_BIG;
    };

    isEnemy() {
        return this.type >= TYPES.ENEMY_SMALLEST && this.type <= TYPES.ENEMY_BIGGEST;
    };

    isFood() {
        return this.type === TYPES.FOOD;
    };

    isCoin() {
        return this.type === TYPES.COIN;
    };

    isWall() {
        return this.type === TYPES.WALL;
    };

    getStep(action) {
        let indexes = this.getIndexes(action);

        return {
            row: indexes.i - 1,
            column: indexes.j - 1
        };
    };

    getIndexes(action) {
        let indexes = { i: 1, j: 1 };

        ACTIONS_MATRIX.forEach((actionsRow, rowIndex) => {
            let columnIndex = actionsRow.indexOf(action);
            if (columnIndex > -1) {
                indexes.i = rowIndex;
                indexes.j = columnIndex;
            }
        });

        return indexes;
    };
}
