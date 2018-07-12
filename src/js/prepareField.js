
import { ITEM_TYPES, TYPES } from './constants';
import Field from './Field';
/*
    To do:
    1. Моніторити кількість речей на полі і добавляти нові
    2. Онуляти поле
    3. Розібратися в лібі SYNAPTIC (для нейронних мереж)
    4. Розібратися в коді генетичного алгоритму
 */

const blockSize = 60;
const spaceSize = 1;

const rowsField = 8;
const columnsField = 8;
const enemiesAmount = 3;
const coinsAmount = 2;
const botsAmount = 3;
const healthAmount = 2;


export default function prepareField () {

    let fieldBlockId = 'fieldBlock';
    let stepDelay = 100; // ms

    let field = new Field({
        rows: rowsField,
        columns: columnsField,
        enemies: enemiesAmount,
        bots: botsAmount,
        coins: coinsAmount,
        health: healthAmount,
        oninit: that => {

            let fieldBlockEl = document.getElementById(fieldBlockId);

            that.matrix.forEach(matrixRow => {
                matrixRow.forEach(matrixItem => {
                    fieldBlockEl.appendChild(createItemBlock(matrixItem))
                });
            });
        }
    });

    field.onchange = (itemFrom, itemTo) => {
        updateFieldItem(itemFrom);

        if (itemTo) {
            updateFieldItem(itemTo);
        }
    };

    field.onStepEnd = that => {
        that.bots.forEach(item => updateBotInfo(item));
    };

    let interval = null;

    document.getElementById("start").addEventListener("click", () => {
        interval = setInterval(() => {
            field.step();
        }, stepDelay);
    });

    document.getElementById("stop").addEventListener("click", () => {
        clearInterval(interval);
    });

    document.getElementById("step").addEventListener("click", () => {
        field.step();
    });

    // console.log(ITEM_TYPES)
    // //
    // field.generateItem(4, 2, TYPES.BOT_BIG);
    // field.generateItem(4, 4, TYPES.BOT_BIG);
    // field.generateItem(4, 6, TYPES.BOT_BIG);


//field.generateItem(6, 4, 7);
//field.generateItem(6, 5, 7);
//field.generateItem(6, 6, 7);
//field.generateItem(6, 7, 10);
//field.generateItem(6, 8, 11);

//field.generateItem(8, 4, 2);
//field.generateItem(8, 6, 3);
//
//field.generateItem(10, 6, 1);
//field.generateItem(10, 7, 1);
//field.generateItem(10, 8, 1);

}

function updateBotInfo(item) {
    let { id, color, isDead, coins } = item;

    let infoItem = document.querySelector('#info_' + id);

    if (!infoItem) {
        infoItem = createInfoElement(id, color);
        document.querySelector('#monitoring').appendChild(infoItem);
    }

    let health = isDead ? 0 : item.getHealth();
    infoItem.querySelector('.health-string').innerText = 'Health: ' + health;
    infoItem.querySelector('.coins-string').innerText = 'Score: ' + coins;
}

function createInfoElement(id, color) {
    let el = document.createElement('div');
    el.id = 'info_' + id;
    el.className = 'info-block';

    let icon = document.createElement('span');
    icon.className = 'bot-icon';
    icon.style.color = color;

    let healthStr = document.createElement('div');
    healthStr.className = 'health-string';

    let coinsStr = document.createElement('div');
    coinsStr.className = 'coins-string';

    el.appendChild(icon);
    el.appendChild(healthStr);
    el.appendChild(coinsStr);

    return el;
}

function updateFieldItem({ row, column, type, color }) {

    let element = document.querySelector('#item_' + row + '_' + column);
    element.className = 'item-block item-block_' + ITEM_TYPES[type].className;
    element.style.color = color;
}

function createItemBlock({ row, column, type }) {

    let item = document.createElement('div');

    item.className = 'item-block item-block_' + ITEM_TYPES[type].className;
    item.setAttribute('data-row', row);
    item.setAttribute('data-column', column);
    item.id = 'item_' + row + '_' + column;

    item.style.top = (row * (blockSize + spaceSize) + spaceSize) + 'px';
    item.style.left = (column * (blockSize + spaceSize) + spaceSize) + 'px';

    return item;
}
