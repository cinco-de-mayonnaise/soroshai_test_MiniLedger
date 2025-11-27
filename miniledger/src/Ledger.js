import { STATUS, TRANSTYPE, TransactionWarning} from "./Constants";

const accounts = new Set(); // if an account is not in this list, its invalid (maybe allow external accounts?)


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
            timestamp_unix = Date.parse(timestamp); // parse timestamps to UNIX for standardness. 
                                                    // UNIX time is always relative to GMT+0.
                                                    // to render on clientside, just use the client's time zone as offset
                                                    // also we can use this to sort transactions
            this.timestamp = timestamp_unix;
        }
        catch (error)
        {
            throw TypeError("Invalid `timestamp` could not be parsed");
        }
        
        // TODO: transaction id validation here
        this.id = id;

        if (acc1 == null || !(acc1 instanceof Account))
            throw TypeError("`acc1` must be a valid reference to an Account class");

        if (amount <= 0)
            this.status = STATUS.INVALIDTRANS; // throw TransactionWarning(STATUS.INVALIDTRANS);

        switch (type)
        {
            case TRANSTYPE.DEPOSIT:
            case TRANSTYPE.WITHDRAW:
                if (!accounts.includes(acc1))   // account not found for constructor
                    this.status = STATUS.UNKNOWNACC; // throw TransactionWarning(STATUS.UNKNOWNACC);  

                break;
            case TRANSTYPE.TRANSFER:
                if (acc2 == null || !(acc2 instanceof Account))
                    throw TypeError("`acc2` must be a valid reference to an Account class");
                
                if (!accounts.includes(acc2))  
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
    constructor()
    {
        accounts.clear();
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
        if (accounts.has(n))
            throw Error("This account already exists!");

        accounts.add(n);
    }

    static compareRecord_timestamp(a, b)
    {
        if (a.timestamp > b.timestamp)
            return 1;
        else if (a.timestamp < b.timestamp)
            return -1;
        
        return 0;
    }

    addTransaction(id, type, timestamp, acc1, acc2, amount)
    {
        const t = new LedgerRecord(id, type, timestamp, acc1, acc2, amount);

        // it is fine for multiple records to have the same id (concurrency issue, etc.)
        this.transactions.push(t);

        // did some research, turns out Javascript built-in sort uses Timsort, which is very fast for already sorted arrays
        // was thinking of manually putting in an insertion sort code in here which would give us O(n) insertion time but 
        // have an already sorted array, which is what i'd for large numbers of transactions.
        this.transactions.sort(compareRecord_timestamp)
    }

    /**
     * Processes the transactions added to the accounts involving them and returns a map of
     * final balances of all accounts indicating how much money is in each account.
     */
    process()
    {
        
        for (const t of this.transactions)
        {

        }

    }

    /**
     * Returns the list of transactions, sorted by timestamp
     */
    getTransactions()
    {
        return this.transactions;
    }

}