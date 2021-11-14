const crypto = require("crypto");
const { logInfo } = require("./utils");

const Block = class{

    constructor(number, transactions, previousBlockHash, difficulty=1){
        this.blockNo = number;
        this.transactions = transactions;
        this.previousBlockHash = previousBlockHash;
        this.merkleRootHash = this.getMerkleRootHash(transactions);
        this.difficulty = difficulty;
        [this.blockHash, this.nonce] = this.getBlockHash();
    }

    getHash = (string) => crypto.createHash('sha256').update(string).digest("hex");

    getDifficulty = () => this.difficulty;

    getMerkleRootHash = (transactions)=>{
        let txns = []
        transactions.forEach((txn, i) => txns[i] = txn.getHash());

        if(txns.length === 2){
            const a = txns.pop();
            const b = txns.pop();
            return this.getHash(`${a}${b}`);
        }
        return txns.pop();
    }

    getBlockHash = (transactions)=>{
        let nonce = 0;
        while(true){
            const hexDigest = this.getHash(`${nonce}${this.blockNo}${this.merkleRootHash}${this.previousBlockHash}`);
            if(hexDigest.startsWith("0".repeat(this.difficulty))){
                return [hexDigest, nonce];
            }
            nonce++;
        }
    }

    printBlock = (chainSize) => {
        console.log("=--=".repeat(25));
        console.log(`Block No.:\t\t${this.blockNo}`);
        console.log(`Previous Hash:\t\t${this.previousBlockHash}`);
        console.log(`Merkle Root Hash:\t${this.merkleRootHash}`);
        console.log(`Block Hash:\t\t${this.blockHash}`);
        console.log(`Nonce:\t\t\t${this.nonce}`);
        console.log("-".repeat(50));
        console.log(`Transactions`);
        console.log("[");
        this.transactions.forEach((txn, idx)=>txn.printTransaction(idx));
        console.log("]");
        console.log("-".repeat(50));
        console.log("=--=".repeat(25));
        if(this.blockNo !== chainSize-1){
            for(var x=0; x<3; x++){
                logInfo(" ".repeat(49) + "||" + " ".repeat(49));
            }
        }
    }
} 
module.exports = Block;