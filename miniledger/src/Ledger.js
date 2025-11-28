import { STATUS, TRANSTYPE, TransactionWarning} from "./Constants";

const accounts = new Set(); // set of ids(string): if an account is not in this list, its invalid (maybe allow external accounts?)
const accounts_inst = new Map(); // map of ids -> Account instances

class Account
{
    constructor(id, initbal)
    {
        // Do ID validation here if necessary (we don't know if ID of forms other than Txxx cannot exist)
        this.id = id;

        // an account may possibly start out with negative balance. The document does not state an account can't have negative balance
        // only that negative balance accounts cant withdraw or transfer.
        this.balance = initbal;
    }

    equals(other) {
        if (!(other instanceof Account)) {
            return false;
        }
        return this.id === other.id;
    }
}

class LedgerRecord // represents a single transaction row
{
    constructor(id, type, timestamp, acc1, acc2, amount)
    {
        this.status = STATUS.PENDING;

        if (!TRANSTYPE.isValid(type))
            throw TypeError("`type` must be a valid transaction type.")

        this.type = type;
        try
        {
            //console.log(timestamp);
            const timestamp_unix = Date.parse(timestamp); // parse timestamps to UNIX for standardness. 
                                                    // UNIX time is always relative to GMT+0.
                                                    // to render on clientside, just use the client's time zone as offset
                                                    // also we can use this to sort transactions
            //console.log(timestamp_unix);
            this.timestamp = timestamp_unix;
        }
        catch (error)
        {
            throw TypeError("Invalid `timestamp` could not be parsed " + error.toString());
        }
        
        // TODO: transaction id validation here
        this.id = id;

        if (acc1 == null)
            throw TypeError("`acc1` must be a valid id of an Account class");

        if (amount <= 0)
            this.status = STATUS.INVALIDTRANS; // throw TransactionWarning(STATUS.INVALIDTRANS);

        switch (type)
        {
            case TRANSTYPE.DEPOSIT:
            case TRANSTYPE.WITHDRAW:
                //console.log(acc1);
                //console.log(accounts);
                if (!accounts.has(acc1))   // account not found for constructor
                    this.status = STATUS.UNKNOWNACC; // throw TransactionWarning(STATUS.UNKNOWNACC);  

                break;
            case TRANSTYPE.TRANSFER:
                if (acc2 == null)
                    throw TypeError("`acc2` must be a valid id of an Account class");
                
                if (!accounts.has(acc2))  
                    this.status = STATUS.UNKNOWNACC; // throw TransactionWarning(STATUS.UNKNOWNACC);  

                if (acc1 == acc2)
                    this.status = STATUS.SAMEACC; // throw TransactionWarning(STATUS.SAMEACC);

                break;
        }
        
        // I decided to keep invalid transactions in the ledger, as a valid transaction may become
        // invalid (i.e insufficient funds), and we might want to potentially see this in the table
        // (we can also choose to not render them in by checking the status field before working)

        this.acc1 = acc1;
        this.acc2 = acc2;
        this.amount = amount;

        // only the ledger transforms the 
    }

    // equals() {} // we don't need this, two records are equal iff all elements are equal

    setStatus(state)
    {
        if (STATUS.isValid(state) && !(STATUS.errors().includes(this.status)))  // don't allow setting an invalid row to valid manually
        {
            // valid rows can be set to invalid however
            this.status = state;
            return true;
        }

        return false;
    }
}


// warning: only one ledger per file. Change global variables if this will change later.
export class TransactionLedger // responsible for keeping track of accounts and generating the ledger, 
{
    /**
     * Initializes the TransactionLedger. There can only be one Ledger per application as this involves global variables.
     * 
     * Instantiating this class again will reset the TransactionLedger.
     */
    constructor()  // singleton does not exist
    {
        accounts.clear();
        accounts_inst.clear();
        this.processed = false;
        this.transactions = [];  // I really wanted to use a Red-Black Tree but Javascript is a bad language, haven't found a standard DS library
    }

    /**
     * Registers an account for use with the TransactionLedger. Transactions involving an account that 
     * hasn't been added using this function is deemed invalid.
     * 
     * If the account already exists, throws an Error as there may be multiple conflicting initial balances.
     * 
     * @param {string} id 
     * @param {number} initial_balance 
     */
    addAccount(id, initial_balance=0)
    {
        const n = new Account(id, initial_balance);

        if (accounts.has(id))
            throw Error("This account already exists!");

        accounts.add(id);
        accounts_inst.set(id, n);
    }

    static _compareRecord_timestamp(a, b)
    {
        if (a.timestamp > b.timestamp)
            return 1;
        else if (a.timestamp < b.timestamp)
            return -1;
        
        return 0;
    }

    /**
     * Adds a transaction record to the TransactionLedger. 
     * 
     * This will throw an Error if the transaction record is invalid due to argument errors such as timestamp being invalid,
     * or an invalid transaction type is defined, or if mandatory arguments are empty.
     * 
     * @param {string} id 
     * @param {TRANSTYPE} type 
     * @param {string} timestamp 
     * @param {string} acc1 
     * @param {?string} acc2 
     * @param {number} amount 
     */
    addTransaction(id, type, timestamp, acc1, acc2, amount)
    {
  
        const t = new LedgerRecord(id, type, timestamp, acc1, acc2, amount);

        // it is fine for multiple records to have the same id (concurrency issue, etc.)
        this.transactions.push(t);

        // did some research, turns out Javascript built-in sort uses Timsort, which is very fast for already sorted arrays
        // was thinking of manually putting in an insertion sort code in here which would give us O(n) insertion time but 
        // have an already sorted array, which is what i'd for large numbers of transactions.
        this.transactions.sort(this._compareRecord_timestamp)
    }

    /**
     * Processes the transactions added to the accounts involving them and returns a map of
     * final balances of all accounts indicating how much money is in each account.
     * 
     * 
     * ..... ONLY NOW do I realise that every ledgerRecord has its own account instances when it was sufficient for 
     * them to just have a string. No time now, I can just ignore those classes and only use the classes inside the 
     * `accounts` global var to track balances across transactions.
     * 
     */
    process()
    {
        // accounts is a global variable, Set of class Accounts.
        // Accounts contain id and balance. Two accounts instances are equal if their id is equal.

        if (this.processed)
            return this.getBalances();  // accounts already contains the final balances, avoid more mutation
        
        const transid_processed = new Set();

        // the array is sorted by timestamp, so we can process transactions in order
        for (let i = 0; i < this.transactions.length; i++)
        {
            const t = this.transactions[i];
            if (transid_processed.has(t.id))
            {
                t.status = STATUS.IGNORED;
                continue;
            }

            const acc1 = accounts_inst.get(t.acc1);
            const acc2 = accounts_inst.get(t.acc2);  // does this make a reference???

            switch (t.type)
            {
                case TRANSTYPE.DEPOSIT:
                    acc1.balance += t.amount;
                    break;
                case TRANSTYPE.WITHDRAW:
                    if (acc1.balance >= t.amount)
                        acc1.balance -= t.amount;
                    else // this trans is invalid
                        t.status = STATUS.NOTENOUGH;
                    break;
                case TRANSTYPE.TRANSFER:
                    if (acc1.balance >= t.amount)
                    {
                        acc1.balance -= t.amount;
                        acc2.balance += t.amount;
                    }
                    else
                        t.status = STATUS.NOTENOUGH;
                    break;
            }

            transid_processed.add(t.id);
        }

        this.processed = true;
        return this.getBalances();
    }

    /**
     * Returns the list of transactions, sorted by timestamp. 
     * 
     * If process() has been executed, then the list of transactions
     * may be modified w.r.t. what was passed to the class on initialization. This is because some transactions may become
     * invalid depending on the current account balance.
     */
    getTransactions()
    {
        return this.transactions;
    }

    /**
     * Returns a list of balances for every account added to the ledger.
     * 
     * If process() hasn't been called, this is the list of initial balances for every account added to the ledger.
     * 
     * If process() has been called, this is the list of final balances for every account added to the ledger.
     */
    getBalances()
    {
        const retbal = new Map();
        for (const id of accounts)
        {
            //console.log(id, accounts_inst.get(id).balance);
            retbal.set(id, accounts_inst.get(id).balance);
        }

        return retbal;
    }



}