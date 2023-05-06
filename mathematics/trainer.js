const fs = require('fs');
const prompt = require('../node_modules/prompt-sync')();
const conf = JSON.parse(fs.readFileSync(__dirname+'/trainer.conf.json', { encoding: 'utf8', flag: 'r' })).config;

let i = 0
let j = false
const startTime = new Date().getTime()
let fst, scd
while (i < 10) {
    if (j == false) {
        fst = generateRandom(10, 100);
        scd = generateRandom(10, 100);
        if (conf.operation === '-' && fst < scd) {
            [fst, scd] = [scd, fst]
        }
    }
    let result = eval(`${fst} ${conf.operation} ${scd}`);
    const resultCandidate = prompt(`${fst} ${conf.operation} ${scd} = (${result})`);
    if (result != resultCandidate) {
        console.log('Wrong, try again!')
        j = true
        continue
    } else console.log("OK")
    j = false
    i += 1 
}
console.log(`Calculation time: ${(new Date().getTime()-startTime)/1000} sec`)

function generateRandom(min = 0, max = 100) {
    const diff = max - min
    let rand = Math.random()
    rand = Math.floor(rand * diff)
    rand = rand + min
    return rand
}
