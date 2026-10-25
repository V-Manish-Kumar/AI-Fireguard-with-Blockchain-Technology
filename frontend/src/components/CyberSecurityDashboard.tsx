import { useState, useCallback, useEffect } from 'react';
import { DatabasePanel } from './cyber/DatabasePanel';
import FirewallPanel from './cyber/FirewallPanel';
import AttackPanel from './cyber/AttackPanel';
import { AttackLogModal, AttackLogEntry } from './cyber/AttackLogModal';
import { Shield, Activity, ExternalLink, CheckCircle, WifiOff } from 'lucide-react';

const BACKEND_URL = (
  import.meta.env.VITE_BACKEND_URL 
    ? import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, "")
    : (import.meta.env.PROD ? "/api" : "http://127.0.0.1:5000")
);


const defaultAttackTypes = ['sql_injection', 'ddos', 'xss', 'bruteforce'];

const CyberSecurityDashboard = () => {
  const [health, setHealth] = useState(100);
  const [isAttacking, setIsAttacking] = useState(false);
  const [isHit, setIsHit] = useState(false);
  const [attackLogs, setAttackLogs] = useState<AttackLogEntry[]>([]);
  const [isLogOpen, setIsLogOpen] = useState(false);
  const [lastTx, setLastTx] = useState<string | null>(null);
  const [lastAttackResult, setLastAttackResult] = useState<any | null>(null);
  const [backendOnline, setBackendOnline] = useState<boolean | null>(null);

  // ================= FETCH REAL FIREWALL HEALTH =================
  const fetchStatus = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/status`);
      if (res.ok) {
        const data = await res.json();
        setHealth(data.firewall_strength);
        setBackendOnline(true);
      } else {
        setBackendOnline(false);
      }
    } catch {
      setBackendOnline(false);
    }
  };

  // ================= HISTORY =================
  const fetchHistory = async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/attacks`);
      if (res.ok) {
        const data = await res.json();
        const formatted: AttackLogEntry[] = data.map((a: any) => {
          let dateObj: Date;
          if (typeof a.timestamp === "string") {
            const iso = a.timestamp.includes("T") ? a.timestamp : a.timestamp.replace(" ", "T") + "Z";
            dateObj = new Date(iso);
            if (isNaN(dateObj.getTime())) {
              dateObj = new Date(a.timestamp);
            }
          } else {
            dateObj = new Date(a.timestamp);
          }

          return {
            id: a.id,
            type: a.attack_type,
            severity: a.severity,
            timestamp: dateObj,
            blocked: a.severity !== "high",
            damage: a.damage,
          };
        });

        setAttackLogs(formatted);
      }
    } catch (err) {
      console.error("Failed to fetch attack history:", err);
    }
  };

  useEffect(() => {
    fetchStatus();
    fetchHistory();
    const interval = setInterval(fetchStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  // ================= REAL ATTACK =================
  const handleAttack = useCallback(async (specificType?: string) => {
    if (isAttacking) return;

    setIsAttacking(true);
    const chosenType = specificType || defaultAttackTypes[Math.floor(Math.random() * defaultAttackTypes.length)];

    try {
      const res = await fetch(`${BACKEND_URL}/attack/${chosenType}`);
      if (res.ok) {
        const data = await res.json();
        setLastAttackResult(data);
        if (data.blockchain_tx) {
          setLastTx(data.blockchain_tx);
        }
        setIsHit(true);
        setTimeout(() => setIsHit(false), 600);
      }
    } catch (err) {
      console.error("Attack simulation failed:", err);
    } finally {
      setIsAttacking(false);
      fetchStatus();
      fetchHistory();
    }
  }, [isAttacking]);

  // ================= REINFORCE =================
  const handleResetHealth = useCallback(async () => {
    try {
      const res = await fetch(`${BACKEND_URL}/add_firewall`, { method: "POST" });
      if (res.ok) {
        const data = await res.json();
        if (data.blockchain_tx) {
          setLastTx(data.blockchain_tx);
        }
      }
    } catch (err) {
      console.error("Reinforce failed:", err);
    } finally {
      fetchStatus();
      fetchHistory();
    }
  }, []);

  const blockedCount = attackLogs.filter(l => l.blocked).length;
  const threatLevel = health > 70 ? "Low" : health > 40 ? "Medium" : "Critical";

  return (
    <div className="min-h-screen bg-background relative flex flex-col">
      
      {/* HEADER */}
      <header className="border-b border-border bg-card/80 backdrop-blur-md sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-3.5">
          <div className="flex items-center justify-between">
            
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-cyan-500/10 border border-cyan-500/20 rounded-xl glow-subtle-cyan">
                <Shield className="w-6 h-6 text-cyan-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-lg font-bold tracking-tight text-white">AI FireGuard</h1>
                  <span className="px-2 py-0.5 text-[10px] font-mono bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 rounded">
                    SEP-V2
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">Machine Learning Firewall & Blockchain Ledger</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs font-mono">
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900 border border-border">
                {backendOnline ? (
                  <>
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-slate-300">Backend Connected</span>
                  </>
                ) : (
                  <>
                    <WifiOff className="w-3.5 h-3.5 text-rose-400" />
                    <span className="text-rose-400">Backend Offline</span>
                  </>
                )}
              </div>

              <div className="flex items-center gap-2">
                <span className={`status-indicator ${isAttacking ? "status-warning" : "status-success"}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isAttacking ? "bg-amber-400" : "bg-emerald-400"} animate-pulse`} />
                  {isAttacking ? "Under Attack" : "Protected"}
                </span>
              </div>
            </div>

          </div>
        </div>
      </header>

      {/* MAIN CONTAINER */}
      <main className="max-w-7xl mx-auto px-4 md:px-8 py-8 flex-1 w-full">
        
        {/* STATS METRICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="card-professional p-5 border-glow-cyan">
            <p className="metric-label">System Integrity</p>
            <p className="metric-value text-cyan-400">{health}%</p>
          </div>

          <div className="card-professional p-5">
            <p className="metric-label">Threats Mitigated</p>
            <p className="metric-value text-emerald-400">{blockedCount}</p>
          </div>

          <div className="card-professional p-5">
            <p className="metric-label">Total Security Events</p>
            <p className="metric-value text-slate-100">{attackLogs.length}</p>
          </div>

          <div className="card-professional p-5">
            <p className="metric-label">Real-time Threat Level</p>
            <p className={`metric-value ${
              threatLevel === "Low" ? "text-emerald-400" : threatLevel === "Medium" ? "text-yellow-400" : "text-rose-500"
            }`}>
              {threatLevel}
            </p>
          </div>
        </div>

        {/* THREE CORE PANELS */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">
          <DatabasePanel 
            isUnderAttack={isAttacking} 
            onOpenLog={() => {
              fetchHistory();
              setIsLogOpen(true);
            }} 
            attackCount={attackLogs.length} 
          />

          <FirewallPanel 
            health={health} 
            isUnderAttack={isAttacking} 
            isHit={isHit} 
            onResetHealth={handleResetHealth} 
          />

          <AttackPanel 
            isAttacking={isAttacking} 
            onStartAttack={handleAttack} 
          />
        </div>

        {/* LATEST EVENT TELEMETRY */}
        {lastAttackResult && (
          <div className="mt-8 card-professional p-5 border border-border/80">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-cyan-400" />
                <h3 className="text-sm font-semibold uppercase tracking-wider text-slate-200">Latest Threat Telemetry</h3>
              </div>
              <span className="text-xs font-mono text-muted-foreground">AI Classifier: DecisionTree</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
              <div className="p-3 bg-slate-900/60 rounded-lg border border-border/40">
                <span className="text-muted-foreground block text-[11px]">ATTACK TYPE</span>
                <span className="text-slate-100 font-bold uppercase">{lastAttackResult.attack}</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-lg border border-border/40">
                <span className="text-muted-foreground block text-[11px]">PREDICTED SEVERITY</span>
                <span className={`font-bold uppercase ${
                  lastAttackResult.predicted_severity === "high" ? "text-red-400" : lastAttackResult.predicted_severity === "medium" ? "text-yellow-400" : "text-emerald-400"
                }`}>
                  {lastAttackResult.predicted_severity}
                </span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-lg border border-border/40">
                <span className="text-muted-foreground block text-[11px]">SHIELD DAMAGE</span>
                <span className="text-rose-400 font-bold">-{lastAttackResult.damage}%</span>
              </div>
              <div className="p-3 bg-slate-900/60 rounded-lg border border-border/40">
                <span className="text-muted-foreground block text-[11px]">BLOCKCHAIN AUDIT</span>
                <span className="text-emerald-400 font-bold flex items-center gap-1">
                  <CheckCircle className="w-3.5 h-3.5 inline" />
                  {lastAttackResult.blockchain_tx ? "Logged On-Chain" : "Stored Locally"}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* FOOTER */}
      <footer className="border-t border-border/60 py-4 px-4 text-center text-xs text-muted-foreground font-mono">
        AI FireGuard &bull; Ethereum Sepolia Testnet Contract: 0x82a0...2f7C &bull; SQLite v3
      </footer>

      {/* HISTORY AUDIT MODAL */}
      <AttackLogModal open={isLogOpen} onOpenChange={setIsLogOpen} logs={attackLogs} />

      {/* BLOCKCHAIN TX FLOATING TOAST */}
      {lastTx && (
        <div className="fixed bottom-6 right-6 z-30 bg-card/95 border border-cyan-500/40 p-4 rounded-xl shadow-2xl backdrop-blur-md max-w-sm border-glow-cyan animate-in fade-in slide-in-from-bottom-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-semibold uppercase text-cyan-400 tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
              On-Chain Log Confirmed
            </span>
            <button 
              onClick={() => setLastTx(null)}
              className="text-muted-foreground hover:text-white text-xs px-1"
            >
              ✕
            </button>
          </div>
          <p className="text-xs text-slate-300 font-mono truncate mb-2">Tx: {lastTx}</p>
          <a
            className="inline-flex items-center gap-1 text-xs text-cyan-400 hover:text-cyan-300 hover:underline font-mono"
            target="_blank"
            rel="noreferrer"
            href={`https://sepolia.etherscan.io/tx/${lastTx}`}
          >
            <span>Verify on Etherscan</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      )}
    </div>
  );
};

export default CyberSecurityDashboard;
