const crypto = require("crypto");
const {INFO_MESSAGES} = require("./constants");
const { logWarning } = require("./utils");

const BlockChain = class {
    constructor() {
        this.chain = [];
    }

    addBlock = (block) => this.chain.push(block);

    displayChain = () => {
        if(this.size() === 0){
            logWarning(INFO_MESSAGES.BLOCKCHAIN_EMPTY);
            return;
        }
        logWarning("-----BLOCKCHAIN-----\n")
        this.chain.forEach(block => block.printBlock(this.size()))
    }

    size = () => this.chain.length;

    signTransaction = (privateKey, transactionHash) => 
        crypto.sign("sha256", Buffer.from(transactionHash), {
            key: privateKey,
            padding: crypto.constants.RSA_PKCS1_PSS_PADDING
        });    

    validateTransaction = (transactionHash, publicKey, signature) => 
        crypto.verify(
            "sha256",
            Buffer.from(transactionHash), {
                key: publicKey,
                padding: crypto.constants.RSA_PKCS1_PSS_PADDING,
            },
            signature
        );
}

module.exports = BlockChain;