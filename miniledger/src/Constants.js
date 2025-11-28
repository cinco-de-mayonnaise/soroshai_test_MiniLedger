export class TRANSTYPE { 
    // enum class
    static #_DEPOSIT  = "DEPOSIT";
    static #_WITHDRAW = "WITHDRAW";
    static #_TRANSFER = "TRANSFER";

    // Read-only public getters
    static get DEPOSIT()  { return this.#_DEPOSIT; }
    static get WITHDRAW() { return this.#_WITHDRAW; }
    static get TRANSFER() { return this.#_TRANSFER; }

    // stuff needed for type checking enforcement
    static values() {
        return [
            this.DEPOSIT, 
            this.WITHDRAW, 
            this.TRANSFER
        ];
    }
    
    static isValid(value) {
        return this.values().includes(value);
    }
}

export class STATUS {// Enum class

    static #_PENDING        = "Pending";                      // Sender account balance < transaction
    static #_ACCEPTED       = "OK";                           // done successfully
    static #_IGNORED        = "Ignored";                      // ignore later identical transaction ids

    // errors/warnings
    static #_NOTENOUGH      = "Insufficient funds";           // Sender account balance < transaction
    static #_SAMETRANSID    = "Duplicate transaction ID";     // same transaction IDs, ignore these (maybe don't post these to warnings?)
    static #_UNKNOWNACC     = "Unknown Account ID";           // Account not in the list of accs
    static #_SAMEACC        = "Transfer to self";             // Transaction to/from same acc
    static #_INVALIDTRANS   = "Invalid transaction";          // 0 or negative transfer


    // Accessors for "get" functions only (no "set" functions)
    static get PENDING()        { return this.#_PENDING; }
    static get ACCEPTED()       { return this.#_ACCEPTED; }
    static get IGNORED()        { return this.#_IGNORED; }
    static get NOTENOUGH()      { return this.#_NOTENOUGH; }
    static get SAMETRANSID()    { return this.#_SAMETRANSID; }
    static get UNKNOWNACC()     { return this.#_UNKNOWNACC; }
    static get SAMEACC()        { return this.#_SAMEACC; }
    static get INVALIDTRANS()   { return this.#_INVALIDTRANS; }

    // stuff needed for type checking enforcement
    static values() {
        return this.errors() + [this.PENDING, this.ACCEPTED, this.IGNORED];
    }

    static errors() {
        return [
            this.NOTENOUGH,
            this.SAMETRANSID,
            this.UNKNOWNACC,
            this.SAMEACC,
            this.INVALIDTRANS
        ];
    }
    
    
    static isValid(value) {
        return this.values().includes(value);
    }
}

export class TransactionWarning extends Error
{
    constructor(message)
    {
        super(message);
        this.name = this.constructor.name;
    }
}