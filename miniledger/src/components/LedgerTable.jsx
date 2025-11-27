export default function LedgerTable({data}) {
  return (
    <div className="bg-white shadow-md rounded-lg p-6 overflow-x-auto">
      <h2 className="text-xl font-semibold mb-4">Final Ledger</h2>

      {/* if table is empty then this */}
      {!data && (
        <table className="min-w-full border-collapse">
          <tbody>
            <tr>
              <td colSpan={4} className="py-10 px-4 text-center text-gray-500">
                <div className="flex flex-col items-center justify-center space-y-3">

                  {/* Icon */}
                  <svg
                    className="w-12 h-12 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M3 7.5l9-5.25 9 5.25m-18 0l9 5.25 9-5.25m-18 0v9l9 5.25 9-5.25v-9"
                    />
                  </svg>

                  {/* Message */}
                  <p className="text-lg font-medium">No ledger data available</p>
                  <p className="text-sm text-gray-400">Upload a JSON file to get started.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
        )}
      
      {/* if table is full then this */}
      {data && (<table className="min-w-full border-collapse">
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
      </table>)}
      
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