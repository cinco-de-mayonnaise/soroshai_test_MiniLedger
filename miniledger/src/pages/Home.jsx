import { useState } from 'react'

import Header from "../components/Header";
import FileUpload from "../components/FileUpload";
import LedgerTable from "../components/LedgerTable";
import WarningsList from "../components/WarningsList";

export default function Home() {
  const [ledgerData, setLedgerData] = useState(5);
  const [warnings, setWarnings] = useState(5);  // dummy vars to test clearing

  function handleFileLoaded(json)
  {
    console.log("Time to load a file!");

    // TODO: parse JSON object here
    setLedgerData(5);
    setWarnings(5);
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
