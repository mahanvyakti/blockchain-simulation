const {
    COLORS
} = require('./constants');
const {
    BLUE,
    RED,
    GREEN,
    RESET,
    YELLOW,
    BRIGHT
} = COLORS;
const readline = require('readline').createInterface({
    input: process.stdin,
    output: process.stdout
});

const question = (q) => {
    return new Promise((res, rej) => {
        readline.question(q, answer => {
            res(answer);
        })
    });
};

const getNum = (numString) => parseInt(numString, 10);

const logError = (s) => console.log(`${BRIGHT+RED}%s${RESET}`, s);
const logSuccess = (s) => console.log(`${BRIGHT+GREEN}%s${RESET}`, s);
const logWarning = (s) => console.log(`${BRIGHT+YELLOW}%s${RESET}`, s);
const logInfo = (s) => console.log(`${BRIGHT+BLUE}%s${RESET}`, s);

module.exports = {
    readline,
    question,
    getNum,
    logError,
    logWarning,
    logInfo,
    logSuccess
}