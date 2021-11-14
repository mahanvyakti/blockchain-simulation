const fs = require('fs');
const crypto = require("crypto");

const Wallet = class {
    constructor(name) {
        this.name = name;
        const {
            publicKey,
            privateKey
        } = crypto.generateKeyPairSync("rsa", {
            modulusLength: 2048,
        });
        this.privateKey = Buffer.from(privateKey.export({
            format: "pem",
            type: "pkcs1"
        }));
        this.publicKey = Buffer.from(publicKey.export({
            format: "pem",
            type: "pkcs1"
        }));
        this.publicKeyHash = crypto.createHash('sha256').update(this.publicKey.toString(), 'utf-8').digest("hex");

        // Save Private Key 
        fs.writeFileSync(`${__dirname}/PrivateKeys/${name}PrivateKey.pem`, this.privateKey.toString().replace(/\\n/g, '\n').trim());
    }
}

module.exports = Wallet;