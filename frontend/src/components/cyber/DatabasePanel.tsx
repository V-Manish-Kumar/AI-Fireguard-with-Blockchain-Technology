import React from "react";
import { Database, ListFilter, HardDrive } from "lucide-react";

interface DatabasePanelProps {
  isUnderAttack: boolean;
  onOpenLog: () => void;
  attackCount: number;
}

export const DatabasePanel: React.FC<DatabasePanelProps> = ({
  isUnderAttack,
  onOpenLog,
  attackCount,
}) => {
  return (
    <div className="card-professional p-6 flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              <Database className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-lg text-white">Security Ledger</h2>
          </div>

          <span className="status-indicator status-success">
            SQLite Online
          </span>
        </div>

        <p className="text-muted-foreground text-sm mb-4">
          Persistent transactional storage of all detected attack incidents and system events.
        </p>

        <div className="p-3 bg-slate-900/60 rounded-lg border border-border/60 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <HardDrive className="w-4 h-4 text-primary" />
            <span>Recorded Incidents</span>
          </div>
          <span className="text-primary font-bold text-sm">{attackCount}</span>
        </div>
      </div>

      <button
        onClick={onOpenLog}
        className="w-full mt-6 py-2.5 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-lg shadow-lg shadow-cyan-900/20 flex items-center justify-center gap-2 text-sm transition active:scale-[0.99]"
      >
        <ListFilter className="w-4 h-4" />
        <span>View Full Audit Logs ({attackCount})</span>
      </button>
    </div>
  );
};
