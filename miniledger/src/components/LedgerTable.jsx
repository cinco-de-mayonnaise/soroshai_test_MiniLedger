export default function LedgerTable() {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Final Ledger</h2>

      <table className="min-w-full border-collapse">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="p-3 border-b">Account ID</th>
            <th className="p-3 border-b">Initial Balance</th>
            <th className="p-3 border-b">Final Balance</th>
            <th className="p-3 border-b">Status</th>
          </tr>
        </thead>

        <tbody>
          {/* Placeholder Row */}
          <tr>
            <td className="p-3 border-b">A001</td>
            <td className="p-3 border-b">1000</td>
            <td className="p-3 border-b">—</td>
            <td className="p-3 border-b text-gray-500 italic">Pending</td>
          </tr>

          {InsertTableRow("A002", 500, "—", "Pending")}

        </tbody>
      </table>
    </div>
  );
}

function InsertTableRow(accountId, initBal, finalBal, Status)
{
    return (
      <tr>
        <td className="p-3 border-b">{accountId}</td>
        <td className="p-3 border-b">{initBal}</td>
        <td className="p-3 border-b">{finalBal}</td>
        <td className="p-3 border-b text-gray-500 italic">{Status}</td>
      </tr>
    );
}