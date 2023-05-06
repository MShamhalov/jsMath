const fs = require('fs');
const prompt = require('../node_modules/prompt-sync')();
const rawConf = JSON.parse(fs.readFileSync(__dirname+'/trainer.conf.json', {encoding: 'utf8', flag: 'r'}));
const conf = getCurrentConfig(rawConf);

let i = 0
let j = false
const startTime = new Date().getTime()
let fst, scd
while (i < 10) {
    if (j == false) {
        fst = generateRandom(conf.min_number, conf.max_number);
        scd = generateRandom(conf.min_number, conf.max_number);
        if (conf.first_number_is_larger && fst < scd) {
            [fst, scd] = [scd, fst]
        }
    }
    let result = eval(`${fst} ${conf.sign} ${scd}`);
    const resultCandidate = prompt(`${fst} ${conf.sign} ${scd} = (${result}) `);
    if (result != resultCandidate) {
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

    if (sign === "+") {
        operation = "plus";   
    } else if (sign === "-") {
        operation = "minus";   
    } else if (sign === "*") {
        operation = "multiplication";   
    } else if (sign === "/") {
        operation = "division";   
    }

    return rawJSONConf[difficulty][operation];
}