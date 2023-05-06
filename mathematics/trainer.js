const fs = require('fs');
const prompt = require('../node_modules/prompt-sync')();
const rawConf = JSON.parse(fs.readFileSync(__dirname+'/trainer.conf.json', {encoding: 'utf8', flag: 'r'}));
const conf = getCurrentConfig(rawConf);

let i = 0
let j = false
const startTime = new Date().getTime()
let fst, scd;

while (i < conf.numberOfTasks) {
    if (j == false) {
        fst = generateRandom(conf.min_number, conf.max_number);
        scd = generateRandom(conf.min_number, conf.max_number);
        if (conf.first_number_is_larger && fst < scd) {
            [fst, scd] = [scd, fst]
        }
    }
    calculationElements = calculate(fst, scd, conf.sign);
    resultCandidate = Number(prompt(calculationElements.resultString));
    if (calculationElements.resultElement !== resultCandidate) {
        console.log('Wrong, try again!')
        j = true
        continue
    } else console.log("OK")
    j = false
    i += 1 
}
console.log(`Calculation time: ${(new Date().getTime()-startTime)/1000} sec`)

function generateRandom(min, max) {
    const diff = max - min
    let rand = Math.random()
    rand = Math.floor(rand * diff)
    rand = rand + min

    return rand
}

function getCurrentConfig(rawJSONConf) {
    const difficulty = rawJSONConf.config.difficulty;
    const sign = rawJSONConf.config.operation;
    let operation;

    if (sign === '+') {
        operation = 'plus';   
    } else if (sign === '-') {
        operation = 'minus';   
    } else if (sign === '*') {
        operation = 'multiplication';   
    } else if (sign === '/') {
        operation = 'division';   
    }

    return rawJSONConf[difficulty][operation];
}

function calculate(firstNum, secondNum, sign) {
    let firstElement;
    let secondElement;
    let resultElement;

    if (sign === '/') {
        firstElement = eval(`${firstNum} * ${secondNum}`);
        resultElement = firstNum;
    } else {
        firstElement = firstNum;
        resultElement = eval(`${firstNum} ${sign} ${secondNum}`);
    }
    secondElement = secondNum;
    resultString = `${firstElement} ${sign} ${secondElement} =  `;

    return {resultElement, resultString}
}