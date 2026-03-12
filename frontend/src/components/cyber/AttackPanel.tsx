import { AlertTriangle } from "lucide-react";

const AttackPanel = ({
  isAttacking,
  onStartAttack
}: {
  isAttacking: boolean;
  onStartAttack: () => void;
}) => {
  return (
    <div className="card-professional p-6 border-glow-red">
      <div className="flex items-center gap-2 mb-4">
        <AlertTriangle className="w-6 h-6 text-red-500" />
        <h2 className="font-semibold text-lg">Threat Simulation</h2>
      </div>

      <p className="text-muted-foreground mb-4">
        Trigger cyber attack simulation
      </p>

      <button
        disabled={isAttacking}
        onClick={onStartAttack}
        className="bg-red-600 w-full py-2 rounded-md disabled:opacity-50"
      >
        {isAttacking ? "Attacking..." : "Start Attack"}
      </button>
    </div>
  );
};

export default AttackPanel;
