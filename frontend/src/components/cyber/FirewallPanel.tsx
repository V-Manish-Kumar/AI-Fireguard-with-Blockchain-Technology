import React from "react";
import { ShieldCheck, ShieldAlert, RotateCcw } from "lucide-react";

interface FirewallPanelProps {
  health: number;
  isUnderAttack: boolean;
  isHit: boolean;
  onResetHealth: () => void;
}

const FirewallPanel: React.FC<FirewallPanelProps> = ({
  health,
  isUnderAttack,
  isHit,
  onResetHealth,
}) => {
  const healthColor =
    health > 70 ? "text-emerald-400" : health > 40 ? "text-yellow-400" : "text-red-400";
  const barColor =
    health > 70
      ? "bg-gradient-to-r from-emerald-500 to-teal-400"
      : health > 40
      ? "bg-gradient-to-r from-yellow-500 to-amber-400"
      : "bg-gradient-to-r from-red-600 to-rose-500";
  const statusLabel =
    health > 70 ? "OPTIMAL" : health > 40 ? "DEGRADED" : "CRITICAL";

  return (
    <div
      className={`card-professional p-6 flex flex-col justify-between transition-all duration-300 ${
        isHit ? "border-glow-red scale-[1.01]" : health > 70 ? "border-glow-cyan" : "border-glow-green"
      }`}
    >
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-primary/10 rounded-lg text-primary">
              {health > 40 ? <ShieldCheck className="w-5 h-5" /> : <ShieldAlert className="w-5 h-5 text-red-400" />}
            </div>
            <h2 className="font-semibold text-lg text-white">AI Firewall Health</h2>
          </div>

          <span className={`status-indicator ${health > 40 ? "status-success" : "status-warning"}`}>
            {statusLabel}
          </span>
        </div>

        <div className="flex items-baseline justify-between mb-2">
          <span className="text-xs uppercase tracking-wider text-muted-foreground">Firewall Shield</span>
          <span className={`text-2xl font-bold font-mono ${healthColor}`}>{health}%</span>
        </div>

        <div className="w-full bg-slate-800/80 rounded-full h-3 overflow-hidden p-0.5 border border-border/60">
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${Math.max(0, Math.min(100, health))}%` }}
          />
        </div>

        <p className="text-xs text-muted-foreground mt-3">
          Protection strength automatically calibrated against incoming threat signatures.
        </p>
      </div>

      <button
        onClick={onResetHealth}
        className="w-full mt-6 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 active:scale-[0.99] text-white font-medium rounded-lg border border-border/80 hover:border-primary/50 transition flex items-center justify-center gap-2 text-sm"
      >
        <RotateCcw className="w-4 h-4 text-primary" />
        <span>Reinforce Firewall to 100%</span>
      </button>
    </div>
  );
};

export default FirewallPanel;
