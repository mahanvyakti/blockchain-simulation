const crypto = require("crypto");

const {
    TRANSACTION_TYPES
} = require("./constants");
const {
    logInfo,
    logWarning
} = require("./utils");

const Transaction = class {
    constructor(txnType, receiver, amount, sender = null) {
        this.txnType = txnType;
        this.receiver = receiver;
        this.amount = amount;
        this.sender = sender;
    }

    printTransaction = (txnIndex) => {
        console.log(" {");
        console.log(`   Transaction No.:\t${txnIndex+1}`);
        logInfo(`   Transaction Hash:\t${this.getHash()}`);
        logWarning(`   Transaction Type:\t ${this.txnType}`);
        console.log(`   Receiver:\t${this.receiver}`);
        console.log(`   Sender:\t${this.sender?this.sender:"-"}`);
        logWarning(`   Amount:\t${this.amount}`);
        if (this.txnType === TRANSACTION_TYPES.CREATE) {
            logWarning(`   ${this.amount} ➡➡➡  ${this.receiver}`);
        } else if (this.txnType === TRANSACTION_TYPES.UNSPENT) {
            logWarning(`   ${this.amount} ====  ${this.receiver}`);
        } else {
            logWarning(`   ${this.amount} >>>>>  ${this.receiver}`);
        }
        console.log(" }");
    }

    getHash = () => {
        if (this.txnType === TRANSACTION_TYPES.PAY)
            return crypto.createHash('sha256').update(`${this.receiver}${this.amount}`).digest("hex");
        return crypto.createHash('sha256').update(`${this.sender}${this.receiver}${this.amount}`).digest("hex");
    }
}

module.exports = Transaction;