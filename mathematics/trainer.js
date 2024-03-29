const fs = require('fs');
const prompt = require('../node_modules/prompt-sync')();

const default_params = JSON.parse(fs.readFileSync(__dirname+'/default.json', {encoding: 'utf8', flag: 'r'})).default_params;

let i = 0;
let j = false;
let fst, scd;

let current_user = prompt(`User (${default_params.user}): `); // You'r Name
if (!current_user) current_user = default_params.user;
let current_difficulty = prompt(`Difficulty (${default_params.difficulty}): `); // low, medium, hard
if (!current_difficulty) current_difficulty = default_params.difficulty;
let current_sign = prompt(`Sign (${default_params.sign}): `); // +, -, *, /, .
if (!current_sign) current_sign = default_params.sign;

const rawConf = JSON.parse(fs.readFileSync(__dirname+'/trainer.conf.json', {encoding: 'utf8', flag: 'r'}));
let conf = getCurrentConfig(rawConf, current_difficulty, current_sign);
let signCandidate = conf.sign;

const startTime = new Date().getTime();
while (i < conf.number_of_tasks) {
    if (j == false) {
        if (signCandidate === '.') {
            const signs = ["+", "-", "*", "/", "|"];
            let signIndex = generateRandom(0, signs.length);
            signCandidate = signs[signIndex];
            let smallConf = getCurrentConfig(rawConf, current_difficulty, signCandidate);
            fst = generateRandom(smallConf.first_number_min_number, smallConf.first_number_max_number);
            scd = generateRandom(smallConf.second_number_min_number, smallConf.second_number_max_number);
        } else {
            fst = generateRandom(conf.first_number_min_number, conf.first_number_max_number);
            scd = generateRandom(conf.second_number_min_number, conf.second_number_max_number);
        }
        if (conf.first_number_is_larger && fst < scd) {
            [fst, scd] = [scd, fst];
        }
    }
    calculationElements = calculate(fst, scd, signCandidate);
    resultCandidate = Number(prompt(calculationElements.resultString));
    if (calculationElements.resultElement !== resultCandidate) {
        console.log('Wrong, try again!');
        j = true;
        signCandidate = calculationElements.sign;
        continue;
    } else {
        console.log(`Task (${i + 1}/${conf.number_of_tasks}) - OK`);
        signCandidate = conf.sign;
    }
    j = false;
    i += 1;
}
const calc_time = (new Date().getTime()-startTime)/1000;
console.log(`Calculation time: ${calc_time} sec`);
supplement_result(current_user, conf.sign, current_difficulty, conf.number_of_tasks, calc_time);

function generateRandom(min, max) {
    const diff = max - min;
    let rand = Math.random();
    rand = Math.floor(rand * diff);
    rand = rand + min;

    return rand;
}

function getCurrentConfig(rawJSONConf, difficulty, sign) {
    let operation = 'plus';
    if (sign === '-') {
        operation = 'minus';
    } else if (sign === '*') {
        operation = 'multiplication';
    } else if (sign === '/') {
        operation = 'division';
    } else if (sign === '|') {
        operation = 'remainder';
    } else if (sign === '.') {
        operation = 'random';
    }

    return rawJSONConf[difficulty][operation];
}

function calculate(firstNum, secondNum, sign) {
    let firstElement;
    let secondElement;
    let resultElement;
    if (sign === '|') {
        firstElement = firstNum;
        resultElement = eval(`${firstNum} % ${secondNum}`);
    } else if (sign === '/') {
        firstElement = eval(`${firstNum} * ${secondNum}`);
        resultElement = firstNum;
    } else {
        firstElement = firstNum;
        resultElement = eval(`${firstNum} ${sign} ${secondNum}`);
    }
    secondElement = secondNum;
    resultString = `${firstElement} ${sign} ${secondElement} = `;

    return {resultElement, resultString, sign};
}

function supplement_result(user, sign, difficulty, number_of_tasks, calc_time) {
    let results_dir = __dirname +'/user_results';
    if (!fs.existsSync(results_dir)) {
        fs.mkdirSync(results_dir);
    }
    let tableHeader = 'User;Current date and time;Sign;Difficulty;Number of tasks;Calculate Time\r\n';
    let content = `${user};${new Date().toLocaleString()};${sign};${difficulty};${number_of_tasks};${calc_time}\r\n`;
    if (fs.existsSync(results_dir + `/${user}.progress.csv`)) {
        try {
            fs.writeFileSync(results_dir + `/${user}.progress.csv`, content, {flag: 'as'});
        } catch (err) {
            console.error(err);
        } 
    } else {
        try {
            fs.writeFileSync(results_dir + `/${user}.progress.csv`, tableHeader, {flag: 'as'});
            fs.writeFileSync(results_dir + `/${user}.progress.csv`, content, {flag: 'as'});
        } catch (err) {
            console.error(err);
        } 
    }
}
