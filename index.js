const Cryptocurrency = require("./Cryptocurreny");
const {
    question,
    getNum
} = require("./utils");

const simulate = async () => {
    const difficulty = await question(`Enter the difficulty:\t`)
    const c = new Cryptocurrency(getNum(difficulty));
    c.startSimulation();
}

simulate();