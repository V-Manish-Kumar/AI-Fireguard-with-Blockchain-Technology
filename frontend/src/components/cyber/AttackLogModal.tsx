import React from 'react';
import { X, ShieldAlert, ShieldCheck } from 'lucide-react';

export interface AttackLogEntry {
  id: number;
  type: string;
  severity?: string;
  timestamp: Date;
  blocked: boolean;
  damage: number;
}

export const AttackLogModal: React.FC<{
  open: boolean;
  onOpenChange: (val: boolean) => void;
  logs: AttackLogEntry[];
}> = ({ open, onOpenChange, logs }) => {
  if (!open) return null;

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={() => onOpenChange(false)}
    >
      <div 
        className="bg-card border border-border p-6 rounded-xl w-full max-w-3xl max-h-[85vh] flex flex-col shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold tracking-tight text-white">Security Event Logs</h2>
              <p className="text-xs text-muted-foreground">Historical attack telemetry recorded in SQLite & Blockchain</p>
            </div>
          </div>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 text-muted-foreground hover:text-white rounded-lg hover:bg-white/5 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 my-4 pr-1">
          {logs.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground text-sm">
              No attack events recorded yet.
            </div>
          ) : (
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-border/60 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  <th className="py-3 px-3">Type</th>
                  <th className="py-3 px-3">Severity</th>
                  <th className="py-3 px-3">Status</th>
                  <th className="py-3 px-3">Damage</th>
                  <th className="py-3 px-3">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 font-mono text-xs">
                {logs.map((log) => {
                  const isValidDate = log.timestamp instanceof Date && !isNaN(log.timestamp.getTime());
                  const timeStr = isValidDate ? log.timestamp.toLocaleTimeString() : "Just now";
                  const dateStr = isValidDate ? log.timestamp.toLocaleDateString() : "";

                  return (
                    <tr key={log.id} className="hover:bg-white/[0.02] transition">
                      <td className="py-3 px-3 font-semibold text-slate-200 capitalize">
                        {log.type.replace(/_/g, " ")}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium uppercase ${
                          log.severity === "high" 
                            ? "bg-red-500/10 text-red-400 border border-red-500/30" 
                            : log.severity === "medium" 
                            ? "bg-yellow-500/10 text-yellow-400 border border-yellow-500/30" 
                            : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30"
                        }`}>
                          {log.severity || (log.blocked ? "low" : "high")}
                        </span>
                      </td>
                      <td className="py-3 px-3">
                        <span className={`inline-flex items-center gap-1 font-medium ${
                          log.blocked ? "text-emerald-400" : "text-red-400"
                        }`}>
                          {log.blocked ? (
                            <>
                              <ShieldCheck className="w-3.5 h-3.5" />
                              Blocked
                            </>
                          ) : (
                            <>
                              <ShieldAlert className="w-3.5 h-3.5" />
                              Breached
                            </>
                          )}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-300">
                        -{log.damage}%
                      </td>
                      <td className="py-3 px-3 text-muted-foreground">
                        {dateStr} {timeStr}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>

        <div className="pt-3 border-t border-border flex justify-end">
          <button
            onClick={() => onOpenChange(false)}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-medium rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
