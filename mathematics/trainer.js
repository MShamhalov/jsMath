const prompt = require('../node_modules/prompt-sync')();

let i = 0
let j = false
const startTime = new Date().getTime()
let fst, scd
while (i < 10) {
    if (j == false) {
        fst = generateRandom(10, 100)
        scd = generateRandom(10, 100)
    }
    let sum = fst + scd
    const result = prompt(`${fst} + ${scd} = `);
    if (sum != result) {
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
