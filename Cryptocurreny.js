const Wallet = require("./Wallet");
const Block = require("./Block");
const BlockChain = require("./BlockChain");

const Transaction = require("./Transaction");
const fs = require('fs');
const {
    TRANSACTION_TYPES,
    NUM_TO_TXN_TYPE,
    QUESTIONS,
    STOP,
    NONE,
    REPEAT,
    ERR_MESSAGES,
    SUCCESS_MESSAGES,
    INFO_MESSAGES
} = require("./constants");
const {
    readline,
    question,
    getNum,
    logError,
    logWarning,
    logSuccess,
    logInfo
} = require("./utils")


const Cryptocurrency = class {
    constructor(difficulty) {
        this.blockchain = new BlockChain();
        this.wallets = {};
        this.users = new Set();
        this.utxoDatabase = {};
        this.difficulty = difficulty;
    }

    getPublicKeyHash = (username) => this.wallets[username].publicKeyHash;

    validateSign = async (username, hash) => {
        try {
            const privateKey64Entered = await question(`${QUESTIONS.ASK_PRIVATE_KEY_OF} ${username}\n===> `);
            const privateKey = fs.readFileSync(`${__dirname}/PrivateKeys/${username}PrivateKey.pem`, 'utf-8');
            const privateKey64Actual = privateKey.substring(31, 96);

            if (privateKey64Entered.trim() === privateKey64Actual.trim()) { //**never ever forget to trim()!**
                const sign = this.blockchain.signTransaction(privateKey, hash);
                return this.blockchain.validateTransaction(hash, this.wallets[username].publicKey, sign);
            }
            return false;
        } catch (e) {
            logError(e);
        }
    }

    /**
     * @param  {} username: The username of a user
     * @param  {} amount: The amount to be spent
     * 
     * @returns `true` if double spending is detected otherwise returns `false`
     */
    isDoubleSpent(username, amount) {
        let userBalance = 0;
        this.utxoDatabase[this.getPublicKeyHash(username)].map((utxo) => userBalance += utxo);
        return userBalance < amount;
    }

    getNewWallet(name) {
        const newWallet = new Wallet(name);
        this.wallets[name] = newWallet;
        this.users.add(name);
        this.utxoDatabase[this.getPublicKeyHash(name)] = [];
        logSuccess(SUCCESS_MESSAGES.WALLET_CREATED);
        logInfo(`The public key hash: \t ${this.getPublicKeyHash(name)}`)
    }

    displayUtxoDatabase() {
        const publickKeyHashes = Object.keys(this.utxoDatabase);
        if (publickKeyHashes.length === 0) {
            logWarning(INFO_MESSAGES.NO_USERS_REGISTERED);
            return;
        }
        publickKeyHashes.forEach(hash => {
            console.log(`\nUTXO for user with public key hash ${hash}:`);
            const utxos = this.utxoDatabase[hash];
            if (utxos.length === 0) {
                logWarning(NONE)
            } else {
                console.log(utxos);
            }
        });
    }

    createNewCoins = async () => {
        let username = await question(QUESTIONS.ASK_USERNAME);
        let amountStr = await question(QUESTIONS.ASK_AMOUNT);
        let amount = getNum(amountStr);

        const txn = new Transaction(TRANSACTION_TYPES.CREATE, username, amount);
        const txnHash = txn.getHash();
        const isValidSign = await this.validateSign(username, txnHash);
        if (isValidSign) {
            let block;
            if (this.blockchain.size() === 0) {
                block = new Block(this.blockchain.size(), [txn], "0".repeat(64), this.difficulty);
            } else {
                block = new Block(this.blockchain.size(), [txn], this.blockchain.chain[this.blockchain.size() - 1].blockHash, this.difficulty)
            }
            this.utxoDatabase[this.wallets[username].publicKeyHash].push(amount);
            this.blockchain.addBlock(block);

            logSuccess(SUCCESS_MESSAGES.COINS_CREATED);
            logSuccess(SUCCESS_MESSAGES.BLOCK_CREATED);
            return STOP;
        } else {
            console.log(ERR_MESSAGES.INVALID_SIGNATUE);
            return "1";
        }
    }

    sendCoins = async () => {
        const senderName = await question(QUESTIONS.ASK_SENDER_NAME);
        if (!this.users.has(senderName)) {
            logError(ERR_MESSAGES.USER_DOES_NOT_EXIST);
            return "2";
        }
        const receiverName = await question(QUESTIONS.ASK_RECEIVER_NAME);
        if (!this.users.has(receiverName)) {
            logError(ERR_MESSAGES.USER_DOES_NOT_EXIST);
            return "2";
        }
        const amountStr = await question(QUESTIONS.ASK_AMOUNT);
        const amount = getNum(amountStr);
        let totalUnspentAmount = 0;

        if (!this.isDoubleSpent(senderName, amount)) {
            this.utxoDatabase[this.wallets[senderName].publicKeyHash].some((utxo) => {
                totalUnspentAmount += utxo;
                return totalUnspentAmount >= amount;
            });

            const txn1 = new Transaction(TRANSACTION_TYPES.PAY, receiverName, amount, senderName);
            const txn2 = new Transaction(TRANSACTION_TYPES.UNSPENT, senderName, totalUnspentAmount - amount);
            const isValidSign = await this.validateSign(senderName, txn1.getHash() + txn2.getHash());

            if (isValidSign) {
                //update utxos of sender
                totalUnspentAmount = 0;
                while (totalUnspentAmount < amount) {
                    totalUnspentAmount += this.utxoDatabase[this.wallets[senderName].publicKeyHash].shift()
                }
                let block;
                if (this.blockchain.size() === 0) {
                    block = new Block(this.blockchain.size(), [txn1, txn2], "0".repeat(64), this.difficulty);
                } else {
                    block = new Block(this.blockchain.size(), [txn1, txn2], this.blockchain.chain[this.blockchain.size() - 1].blockHash, this.difficulty);
                }
                this.utxoDatabase[this.wallets[senderName].publicKeyHash].push(totalUnspentAmount - amount);
                this.utxoDatabase[this.wallets[receiverName].publicKeyHash].push(amount);
                this.blockchain.addBlock(block);

                logSuccess(SUCCESS_MESSAGES.TRANSACTION_COMPLETE);
                logSuccess(SUCCESS_MESSAGES.BLOCK_CREATED);
                return STOP;
            } else {
                console.log(ERR_MESSAGES.INVALID_SIGNATUE);
                return "2";
            }
        } else {
            logError(ERR_MESSAGES.DOUBLE_SPENDING);
            return "2";
        }
    }

    startSimulation = async () => {
        let selection = "";
        while (selection !== "6") {
            selection = await question(QUESTIONS.ASK_ACTION);
            switch (selection) {
                case "1":
                    let name = await question(QUESTIONS.ASK_USERNAME);
                    if (this.users.has(name)) {
                        logError(ERR_MESSAGES.USER_ALREADY_EXISTS);
                        break;
                    }
                    this.getNewWallet(name);
                    break;
                case "2":
                    let txnType = REPEAT;
                    while (txnType !== STOP) {
                        txnType = await question(QUESTIONS.ASK_TRANSACTION_TYPE);
                        switch (NUM_TO_TXN_TYPE[txnType]) {
                            case STOP:
                                logWarning(SUCCESS_MESSAGES.TRANSACTION_CANCELLED);
                                txnType = STOP;
                                break;
                            case TRANSACTION_TYPES.CREATE:
                                txnType = await this.createNewCoins();
                                break;
                            case TRANSACTION_TYPES.PAY:
                                txnType = await this.sendCoins()
                                break;
                            default:
                                txnType = REPEAT;
                                logError(ERR_MESSAGES.INVALID_TXN_SELECTION);
                                break;
                        }
                    }
                    break;
                case "3":
                    this.blockchain.displayChain();
                    break;
                case "4":
                    this.displayUtxoDatabase();
                    break;
                case "5":
                    let name5 = await question(QUESTIONS.ASK_USERNAME);
                    if (!this.users.has(name5)) {
                        logError(ERR_MESSAGES.USER_DOES_NOT_EXIST);
                    } else {
                        logInfo(`The public key hash of ${name5}:\t${this.getPublicKeyHash(name5)}`);
                    }
                    break;
                case "6":
                    logWarning("\nBye!");
                    readline.close();
                    break;
                default:
                    logError("Select valid option !");
                    break;
            }
        }
    }
}

module.exports = Cryptocurrency;