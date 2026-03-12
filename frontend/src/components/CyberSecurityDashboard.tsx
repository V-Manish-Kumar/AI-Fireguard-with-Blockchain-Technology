import { useState, useCallback, useEffect } from 'react';
import { DatabasePanel } from './cyber/DatabasePanel';
import FirewallPanel from './cyber/FirewallPanel';
import AttackPanel from './cyber/AttackPanel';
import { AttackLogModal, AttackLogEntry } from './cyber/AttackLogModal';
import { Shield, Activity } from 'lucide-react';

const BACKEND_URL = "http://127.0.0.1:5000";

const attackTypes = ['sql_injection', 'ddos', 'xss'];

const CyberSecurityDashboard = () => {
  const [health, setHealth] = useState(100);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [attackLogs, setAttackLogs] = useState<AttackLogEntry[]>([]);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [lastTx, setLastTx] = useState<string | null>(null);

  // ================= FETCH REAL FIREWALL HEALTH =================
  const fetchStatus = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/status`);
      const data = await res.json();
      setHealth(data.firewall_strength);
    } catch {
      console.log("Backend Offline");
    }
  };

  useEffect(() => {
    fetchStatus();
  }, []);

  // ================= REAL ATTACK =================
  const handleAttack = useCallback(async () => {
    if (isAttacking) return;

    setIsAttacking(true);

    const random = attackTypes[Math.floor(Math.random() * attackTypes.length)];

    const res = await fetch(`${BACKEND_URL}/attack/${random}`);
    const data = await res.json();

    setIsAttacking(false);
    setIsHit(true);
    setTimeout(() => setIsHit(false), 500);

    setLastTx(data.blockchain_tx || null);
    fetchStatus();
    fetchHistory();
  }, [isAttacking]);

  // ================= REINFORCE =================
  const handleResetHealth = useCallback(async () => {
    const res = await fetch(`${BACKEND_URL}/add_firewall`, { method: "POST" });
    const data = await res.json();
    setLastTx(data.blockchain_tx || null);
    fetchStatus();
  }, []);

  // ================= HISTORY =================
  const fetchHistory = async () => {
    const res = await fetch(`${BACKEND_URL}/attacks`);
    const data = await res.json();

    const formatted = data.map((a: any) => ({
      id: a.id,
      type: a.attack_type,
      timestamp: new Date(a.timestamp),
      blocked: a.severity !== "high" ? true : false,
      damage: a.damage,
    }));

    setAttackLogs(formatted);
  };

  const blockedCount = attackLogs.filter(l => l.blocked).length;
  const threatLevel = health > 70 ? "Low" : health > 40 ? "Medium" : "High";

  return (
    <div className="min-h-screen bg-background relative">
      
      {/* HEADER */}
      <header className="border-b border-border bg-card/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-4">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg glow-subtle-cyan">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h1 className="text-xl font-semibold">Security Operations Center</h1>
                <p className="text-sm text-muted-foreground">AI + Blockchain Powered</p>
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2 text-sm">
              <Activity className="w-4 h-4 text-muted-foreground" />
              <span className="text-muted-foreground">Status:</span>

              <span className={`status-indicator ${isAttacking ? "status-warning" : "status-success"}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isAttacking ? "bg-yellow-400" : "bg-green-400"} animate-pulse`} />
                {isAttacking ? "Under Attack" : "Protected"}
              </span>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN GRID */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="card-professional p-4 border-glow-cyan">
            <p className="metric-label">System Health</p>
            <p className="metric-value">{health}%</p>
          </div>

          <div className="card-professional p-4">
            <p className="metric-label">Threats Blocked</p>
            <p className="metric-value text-green-400">{blockedCount}</p>
          </div>

          <div className="card-professional p-4">
            <p className="metric-label">Total Events</p>
            <p className="metric-value text-primary">{attackLogs.length}</p>
          </div>

          <div className="card-professional p-4">
            <p className="metric-label">Threat Level</p>
            <p className={`metric-value ${threatLevel === "Low" ? "text-green-400" : threatLevel === "Medium" ? "text-yellow-400" : "text-red-400"}`}>
              {threatLevel}
            </p>
          </div>
        </div>

        {/* Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <DatabasePanel isUnderAttack={isAttacking} onOpenLog={() => {
            fetchHistory();
            setIsLogOpen(true);
          }} attackCount={attackLogs.length} />

          <FirewallPanel health={health} isUnderAttack={isAttacking} isHit={isHit} onResetHealth={handleResetHealth} />

          <AttackPanel isAttacking={isAttacking} onStartAttack={handleAttack} />
        </div>
      </main>

      {/* HISTORY MODAL */}
      <AttackLogModal open={isLogOpen} onOpenChange={setIsLogOpen} logs={attackLogs} />

      {/* BLOCKCHAIN TX VIEWER */}
      {lastTx && (
        <div className="fixed bottom-4 right-4 bg-card border border-border p-3 rounded-lg">
          <p className="text-sm text-muted-foreground">Blockchain Log</p>
          <a
            className="text-primary underline"
            target="_blank"
            rel="noreferrer"
            href={`https://sepolia.etherscan.io/tx/${lastTx}`}
          >
            View on Etherscan
          </a>
        </div>
      )}
    </div>
  );
};

export default CyberSecurityDashboard;
