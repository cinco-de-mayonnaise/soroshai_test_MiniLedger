import Header from "../components/Header";
import FileUpload from "../components/FileUpload";
import LedgerTable from "../components/LedgerTable";
import WarningsList from "../components/WarningsList";

export default function Home() {
  return (
    <div className="max-w-6xl mx-auto py-8 px-4">
      <Header />

      {/* Upload Section */}
      <div className="mt-8">
        <FileUpload />
      </div>

      {/* Results Section */}
      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Ledger Table */}
        <div className="lg:col-span-2">
          <LedgerTable />
        </div>

        {/* Warnings */}
        <WarningsList />
      </div>
    </div>
  );
}
