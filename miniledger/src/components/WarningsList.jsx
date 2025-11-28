import { STATUS } from "../Constants";

export default function WarningsList({data}) {

  var timethen = Date.parse("2025-01-01T10:00");

  if (!data)
    return; // don't render if there are no warnings

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Warnings</h2>

      <div className="space-y-3">
        {/* Placeholder example */}
        {InsertWarning(data)}
      </div>
    </div>
  );
}

function InsertWarning(warnings)
{
  console.log(warnings);
  const ret = [];
  for (const t of warnings)
  {
    ret.push(InsertWarning_worker(t.id, t.status));
  }
  return ret;
}

/* UI-only function */
function InsertWarning_worker(transId, reason)
{
    return (
      <div className="border-l-4 border-red-500 bg-red-50 p-3 rounded">
        <p className="font-semibold text-red-700">{transId} – Invalid Transaction</p>
        <p className="text-sm text-red-600 mt-1">Reason: {reason}</p>
      </div>
    );
}