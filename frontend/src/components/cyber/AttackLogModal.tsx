export interface AttackLogEntry {
  id: number;
  type: string;
  timestamp: Date;
  blocked: boolean;
  damage: number;
}

export const AttackLogModal = ({
  open,
  onOpenChange,
  logs
}: {
  open: boolean;
  onOpenChange: (val: boolean) => void;
  logs: AttackLogEntry[];
}) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center">
      <div className="bg-card p-6 rounded-xl w-[800px] max-h-[80vh] overflow-y-auto border border-border">
        <h2 className="text-xl font-semibold mb-4">Attack Logs</h2>

        <table className="w-full text-left">
          <thead>
            <tr>
              <th>Type</th>
              <th>Status</th>
              <th>Damage</th>
              <th>Time</th>
            </tr>
          </thead>

          <tbody>
            {logs.map(log => (
              <tr key={log.id}>
                <td>{log.type}</td>
                <td style={{ color: log.blocked ? "green" : "red" }}>
                  {log.blocked ? "Blocked" : "Success"}
                </td>
                <td>{log.damage}</td>
                <td>{log.timestamp.toLocaleTimeString()}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <button
          onClick={() => onOpenChange(false)}
          className="mt-4 bg-red-600 py-2 px-4 rounded-md"
        >
          Close
        </button>
      </div>
    </div>
  );
};
