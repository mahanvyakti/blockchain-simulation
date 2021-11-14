const STOP = "STOP";
const NONE = "NONE"
const REPEAT = "REPEAT";
const TRANSACTION_TYPES = {
    UNSPENT: "UNSPENT",
    CREATE: "CREATE",
    PAY: "PAY"
}

const NUM_TO_TXN_TYPE = {
    "0": STOP,
    "1": TRANSACTION_TYPES.CREATE,
    "2": TRANSACTION_TYPES.PAY,
    "3": TRANSACTION_TYPES.UNSPENT
}

const COLORS = {
    BRIGHT: "\x1b[1m",
    RED: "\x1b[31m",
    YELLOW: "\x1b[33m",
    BLUE: "\x1b[34m",
    GREEN: "\x1b[32m",
    RESET: "\x1b[0m"
}
const QUESTIONS = {
    ASK_ACTION: `\nSelect:\n 1. Create a new wallet\n 2. Do a transaction\n 3. View blockchain\n 4. View UTXO Database\n 5. View Public Key Hash\n 6. Exit\n==> `,
    ASK_TRANSACTION_TYPE: `\n  Select the type of transaction:\n    1. Create new coins\n    2. Pay existing coins\n    0. Cancel Transaction\n    ==> `,
    ASK_USERNAME: `\nEnter name of the user\n==> `,
    ASK_AMOUNT: `\nEnter the number of coins\n==> `,
    ASK_PRIVATE_KEY_OF: `Enter the first 64 characters of the private key of`,
    ASK_SENDER_NAME: `\nEnter name of the sender\n==> `,
    ASK_RECEIVER_NAME: `\nEnter name of the receiver\n==> `
}

const ERR_MESSAGES = {
    USER_ALREADY_EXISTS: `User already exists!`,
    USER_DOES_NOT_EXIST: `The user does not exist!`,
    INVALID_TXN_SELECTION: `Select valid type of transaction`,
    INVALID_SIGNATUE: `Invalid signature provided!\n`,
    DOUBLE_SPENDING: `Double spending detected!\n`
}

const SUCCESS_MESSAGES = {
    WALLET_CREATED: `The wallet is created successfully!`,
    BLOCK_CREATED: `The block is created successfully!\n`,
    COINS_CREATED: `The coin creation is successful!`,
    TRANSACTION_COMPLETE: `The transaction is completed successfully!`,
    TRANSACTION_CANCELLED: `  The transaction is cancelled.`
}

const INFO_MESSAGES = {
    NO_USERS_REGISTERED: `No users registered yet.`,
    BLOCKCHAIN_EMPTY: `The blockchain does not contain any blocks yet.`
}
module.exports = {
    COLORS,
    TRANSACTION_TYPES,
    NUM_TO_TXN_TYPE,
    QUESTIONS,
    ERR_MESSAGES,
    SUCCESS_MESSAGES,
    INFO_MESSAGES,
    REPEAT,
    NONE,
    STOP
}