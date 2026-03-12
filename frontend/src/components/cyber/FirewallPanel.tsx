import { ShieldCheck } from "lucide-react";

const FirewallPanel = ({
  health,
  isUnderAttack,
  isHit,
  onResetHealth
}: {
  health: number;
  isUnderAttack: boolean;
  isHit: boolean;
  onResetHealth: () => void;
}) => {
  return (
    <div className={`card-professional p-6 ${isHit ? "border-glow-red" : "border-glow-green"}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-primary" />
          <h2 className="font-semibold text-lg">Firewall</h2>
        </div>

        <span className="status-indicator status-success">
          Secure
        </span>
      </div>

      <p>System Integrity</p>

      <div className="mt-4 w-full bg-muted rounded-full h-3 overflow-hidden">
        <div
          className="bg-primary h-full transition-all"
          style={{ width: `${health}%` }}
        />
      </div>

      <h2 className="text-center text-3xl mt-4">{health}%</h2>

      <button
        onClick={onResetHealth}
        className="bg-primary w-full mt-4 py-2 rounded-md"
      >
        Restore System
      </button>
    </div>
  );
};

export default FirewallPanel;
