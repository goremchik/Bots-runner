'use strict';

/*
    To do:
    1. Рандомно розкидувати елементи по карті
    2. Моніторити кількість речей на полі і добавляти нові
    3. Онуляти поле
    4. Розібратися в лібі SYNAPTIC (для нейронних мереж)
    5. Розібратися в коді генетичного алгоритму
 */

module.exports = function() {
var blockSize = 30;
var spaceSize = 1;

var field = new Field({
    rows: 16,
    columns: 16,
    enemies: 8,
    bots: 8,
    coiuns: 8,
    oninit: function() {
    var fieldBlockEl = document.getElementById('fieldBlock');

    for (var i = 0; i < this.matrix.length; i++) {
        var matrixRow = this.matrix[i];
        for (var j = 0; j < matrixRow.length; j++) {
            fieldBlockEl.appendChild(createItemBlock(matrixRow[j]));
        }
    }
}});

field.onchange = function(itemFrom, itemTo) {
    updateFieldItem(itemFrom);
    
    if (itemTo) {
        updateFieldItem(itemTo);
    }
};

field.onStepEnd = function() {
    this.bots.forEach(function(item) {
        updateBotInfo(item);
    });
}

function updateBotInfo(item) {
    var id = item.id;
    
    var infoItem = document.querySelector('#info_' + id);
    
    if (!infoItem) {
        infoItem = createInfoElement(id, item.color);
        document.querySelector('#monitoring').appendChild(infoItem);
    }
    
    var helth = item.isDead ? 0 : item.getHelth();
    infoItem.querySelector('.helth-string').innerText = 'Helth: ' + helth;
    infoItem.querySelector('.coins-string').innerText = 'Score: ' + item.coins;
}

function createInfoElement(id, color) {
    var el = document.createElement('div');
    el.id = 'info_' + id;
    el.className = 'info-block';
    
    var icon = document.createElement('span');
    icon.className = 'bot-icon';
    icon.style.color = color;
    
    var helthStr =  document.createElement('div');
    helthStr.className = 'helth-string';
    
    var coinsStr =  document.createElement('div');
    coinsStr.className = 'coins-string';
    
    el.appendChild(icon);
    el.appendChild(helthStr);
    el.appendChild(coinsStr);
    
    return el;
}

function updateFieldItem(item) {
    var row = item.row;
    var column = item.column;

    var element = document.querySelector('#item_' + row + '_' + column);
    element.className = 'item-block item-block_' + itemTypes[item.type].className;
    
    element.style.color = item.color;
}

var interval = null;

document.getElementById("start").addEventListener("click", function() {
    interval = setInterval(function() {
        field.step();
    }, 500);
});

document.getElementById("stop").addEventListener("click", function() {
    clearInterval(interval);
});

document.getElementById("step").addEventListener("click", function() {
    field.step();
});


field.generateItem(4, 3, 6);
field.generateItem(4, 2, 6);
field.generateItem(4, 4, 6);

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

function createItemBlock(fieldItem) {
    var row = fieldItem.row;
    var column = fieldItem.column;

    var item = document.createElement('div');

    item.className = 'item-block item-block_' + itemTypes[fieldItem.type].className;
    item.setAttribute('data-row', row);
    item.setAttribute('data-column', column);
    item.id = 'item_' + row + '_' + column;

    item.style.top = (row * (blockSize + spaceSize) + spaceSize) + 'px';
    item.style.left = (column * (blockSize + spaceSize) + spaceSize) + 'px';

    return item;
}

}