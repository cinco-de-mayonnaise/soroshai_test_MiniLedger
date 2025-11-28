import { useState } from 'react'

import {TransactionLedger} from "../Ledger"

import Header from "../components/Header";
import FileUpload from "../components/FileUpload";
import LedgerTable from "../components/LedgerTable";
import WarningsList from "../components/WarningsList";
import { STATUS } from '../Constants';

export default function Home() {
  const [ledgerData, setLedgerData] = useState(null);
  const [warnings, setWarnings] = useState(null);  // dummy vars to test clearing

  function handleFileLoaded(json)
  {
    const theLedger = new TransactionLedger();
    console.log("Time to load a file!");

    // handle JSON
    // try   // unnecessary cause an exception here will be caught in FileUpload
    var accs = json["accounts"];
    var trans = json["transactions"];
    
    if (!Array.isArray(accs) || !Array.isArray(trans)) { // 'accounts'/'transactions' must be an array.
      throw Error("JSON error: The JSON file is malformed. The accounts or transaction field is not an array.");
    }

    for (let i = 0; i < accs.length; i++)
    {
      const item = accs[i];
      if (!item.id || typeof item.balance !== "number") {    // accounts must be a valid list of accounts
        throw Error(`JSON error: The JSON file is malformed. One of the accounts(#${i}) in the file is malformed.`); 
        // i dont think a end-user would need to know exactly where the JSON file is malformed. Up to discussion.
      }

      theLedger.addAccount(item.id, item.balance);
    }

    for (let i = 0; i < trans.length; i++)
    {
      const item = trans[i];
      if (!item.id || !item.type || !item.timestamp ||typeof item.amount !== "number") {    // accounts must be a valid list of accounts
        throw Error("JSON error: The JSON file is malformed. One of the transactions in the file is malformed.");
      }
      
      // x ?? y MEANS return x if its not null, else return y  (it works for undefined too)
      theLedger.addTransaction(item.id, item.type, item.timestamp, item.fromAccount ?? item.account ?? null, item.toAccount ?? null, item.amount); // chatgpt suggested a helper function but thats annoying so i inlined it
    }

    // process transactions
    const initial_balances = theLedger.getBalances();
    const final_balances = theLedger.process(); // currently unnecessary
    const l = theLedger.getTransactions(); // contains both warnings and ledgerData
    const w = [];
    // // extract warnings
    for (const i of l)
    {
      if (STATUS.errors().includes(i.status))
        w.push(i);
    }

    // make combined balances and send to ledger
    const combinedBalances = new Map();
    for (const [accId, initBal] of initial_balances) {
      const finalBal = final_balances.get(accId) ?? initBal; // fallback in case final_balance is missing
      combinedBalances.set(accId, [initBal, finalBal]);
    }

    setLedgerData(combinedBalances);
    setWarnings(w);
  }

  function handleFileCleared()
  {
    setLedgerData(null);
    setWarnings([]);
  }

  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Header />

      {/* Upload Section */}
      <div className="mt-8">
        <FileUpload onFileLoaded={handleFileLoaded} onClear={handleFileCleared}/>
      </div>

      {/* Results Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ledger Table */}
        <div className="lg:col-span-2">
          <LedgerTable data={ledgerData}/>
        </div>

        {/* Warnings */}
        <WarningsList data={warnings}/>
      </div>
    </div>
  );
}
