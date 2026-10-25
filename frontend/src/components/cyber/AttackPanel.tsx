import React from "react";
import { AlertTriangle, Zap, Flame } from "lucide-react";

interface AttackPanelProps {
  isAttacking: boolean;
  onStartAttack: (attackType?: string) => void;
}

const AttackPanel: React.FC<AttackPanelProps> = ({
  isAttacking,
  onStartAttack,
}) => {
  return (
    <div className={`card-professional p-6 flex flex-col justify-between ${isAttacking ? "border-glow-red" : ""}`}>
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <h2 className="font-semibold text-lg text-white">Threat Simulator</h2>
          </div>
          <span className="status-indicator status-warning">
            AI Monitored
          </span>
        </div>

        <p className="text-muted-foreground text-sm mb-4">
          Simulate incoming cyber attacks to test the ML detection engine and blockchain audit logging.
        </p>

        <div className="grid grid-cols-3 gap-2 mb-4">
          <button
            disabled={isAttacking}
            onClick={() => onStartAttack("sql_injection")}
            className="px-2 py-2 text-xs bg-slate-800/80 hover:bg-red-950/60 hover:text-red-300 border border-border/80 hover:border-red-500/40 rounded-lg transition disabled:opacity-50 text-center font-mono"
            title="High Severity (-20%)"
          >
            SQLi
          </button>
          <button
            disabled={isAttacking}
            onClick={() => onStartAttack("ddos")}
            className="px-2 py-2 text-xs bg-slate-800/80 hover:bg-yellow-950/60 hover:text-yellow-300 border border-border/80 hover:border-yellow-500/40 rounded-lg transition disabled:opacity-50 text-center font-mono"
            title="Medium Severity (-10%)"
          >
            DDoS
          </button>
          <button
            disabled={isAttacking}
            onClick={() => onStartAttack("xss")}
            className="px-2 py-2 text-xs bg-slate-800/80 hover:bg-emerald-950/60 hover:text-emerald-300 border border-border/80 hover:border-emerald-500/40 rounded-lg transition disabled:opacity-50 text-center font-mono"
            title="Low Severity (-5%)"
          >
            XSS
          </button>
        </div>
      </div>

      <button
        disabled={isAttacking}
        onClick={() => onStartAttack()}
        className="w-full py-2.5 px-4 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-medium rounded-lg shadow-lg shadow-red-900/30 flex items-center justify-center gap-2 transition disabled:opacity-50 active:scale-[0.99]"
      >
        {isAttacking ? (
          <>
            <Zap className="w-4 h-4 animate-spin text-yellow-300" />
            <span>Simulating Attack...</span>
          </>
        ) : (
          <>
            <Flame className="w-4 h-4" />
            <span>Launch Random Threat</span>
          </>
        )}
      </button>
    </div>
  );
};

export default AttackPanel;
