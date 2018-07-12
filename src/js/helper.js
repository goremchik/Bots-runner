/**
 * Created by Andrii_Shoferivskyi on 2018-07-11.
 */


let getRandom = (min, max) => Math.floor(Math.random() * (max - min + 1) + min);

let getBotAction = matrix => {
    return getRandom(0, 8);
};


export {
    getRandom,
    getBotAction
};