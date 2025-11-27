import { STATUS, TRANSTYPE, TransactionWarning} from "./Constants";

const accounts = []; // if an account is not in this list, its invalid (maybe allow external accounts?)


class Account
{
    constructor(id, initbal=0)
    {
        // Do ID validation here if necessary (we don't know if ID of forms other than Txxx cannot exist)
        this.id = id;

        // an account may possibly start out with negative balance. The document does not state an account can't have negative balance
        // only that negative balance accounts cant withdraw or transfer.
        this.balance = initbal;
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

    setStatus(state)
    {
        if (STATUS.isValid(state) && !(STATUS.errors().includes(this.status)))  // don't allow setting an invalid row to valid manually
        {
            // valid rows can be set to invalid however
            this.status = state;
        }
    }
}


class TransactionLedger // responsible for keeping track of accounts and generating the ledger, 
{
    
}