import { STATUS } from "../Constants";

export default function WarningsList() {

  var timethen = Date.parse("2025-01-01T10:00");


  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Warnings</h2>

      <div className="space-y-3">
        {/* Placeholder example */}
        <div className="border-l-4 border-red-500 bg-red-50 p-3 rounded">
          <p className="font-semibold text-red-700">T101 – Invalid Transaction</p>
          <p className="text-sm text-red-600 mt-1">Reason: Insufficient funds</p>
        </div>

        {InsertWarning("T102", STATUS.SAMETRANSID)}
        {InsertWarning("T102", STATUS.NOTENOUGH)}
        {InsertWarning("T102", STATUS.UNKNOWNACC)}
        {InsertWarning("T102", STATUS.SAMEACC)}
        {InsertWarning("T102", STATUS.INVALIDTRANS)}
      </div>
    </div>
  );
}

/* UI-only function */
function InsertWarning(transId, reason)
{
    return (
      <div className="border-l-4 border-red-500 bg-red-50 p-3 rounded">
        <p className="font-semibold text-red-700">{transId} – Invalid Transaction</p>
        <p className="text-sm text-red-600 mt-1">Reason: {reason}</p>
      </div>
    );
}