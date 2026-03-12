import { Database } from "lucide-react";

export const DatabasePanel = ({
  isUnderAttack,
  onOpenLog,
  attackCount
}: {
  isUnderAttack: boolean;
  onOpenLog: () => void;
  attackCount: number;
}) => {
  return (
    <div className="card-professional p-6 border-glow-cyan">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Database className="w-6 h-6 text-primary" />
          <h2 className="font-semibold text-lg">Database</h2>
        </div>

        <span className="status-indicator status-success">
          Secure
        </span>
      </div>

      <p className="text-muted-foreground text-sm">
        Primary storage
      </p>

      <div className="mt-4">
        <button
          onClick={onOpenLog}
          className="bg-primary px-4 py-2 rounded-md hover:opacity-90 transition"
        >
          View Attack Log ({attackCount})
        </button>
      </div>
    </div>
  );
};
