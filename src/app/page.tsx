"use client";

import React, { useState } from "react";
import { 
  ShieldCheck, 
  PiggyBank, 
  Users, 
  UserPlus, 
  Calculator, 
  Bell, 
  Flame, 
  Coins,
  X,
  TrendingUp,
  Calendar,
  CheckCircle2,
  ArrowRight
} from "lucide-react";

export default function SavingsDashboard() {
  // App Core States
  const [userName] = useState("Blessed");
  const [totalSavings, setTotalSavings] = useState(150000); 
  const [streakCount] = useState(12);
  const [activeModal, setActiveModal] = useState<string | null>(null);

  // Form states for workflows
  const [calcTarget, setCalcTarget] = useState("");
  const [calcMonths, setCalcMonths] = useState("");
  const [calcResult, setCalcResult] = useState<number | null>(null);
  const [successMsg, setSuccessMsg] = useState("");

  // Sound Engine (Web Audio API Chime)
  const playDepositChime = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const playTone = (time: number, freq: number, duration: number) => {
      const osc = audioContext.createOscillator();
      const gain = audioContext.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + duration);
      osc.connect(gain);
      gain.connect(audioContext.destination);
      osc.start(time);
      osc.stop(time + duration);
    };
    const now = audioContext.currentTime;
    playTone(now, 523.25, 0.15); // C5
    playTone(now + 0.12, 659.25, 0.3); // E5
  };

  const handleQuickDeposit = () => {
    setTotalSavings(prev => prev + 10000);
    playDepositChime();
    triggerToast("Quick deposited ₦10,000 successfully!");
  };

  const triggerToast = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(""), 4000);
  };

  // Workflow submission simulations
  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const target = parseFloat(calcTarget);
    const months = parseFloat(calcMonths);
    if (target && months) {
      setCalcResult(Math.ceil(target / months));
    }
  };

  const handleActionSubmit = (title: string, amount?: number) => {
    if (amount) {
      setTotalSavings(prev => prev + amount);
      playDepositChime();
    }
    setActiveModal(null);
    triggerToast(`Action successfully updated: ${title}`);
  };

  return (
    <div className="min-h-screen bg-[#0d0d12] text-[#f3f4f6] font-sans antialiased pb-16 relative">
      
      {/* SUCCESS TOAST NOTIFICATION */}
      {successMsg && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-950 border border-emerald-500/40 text-emerald-300 px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-medium">{successMsg}</span>
        </div>
      )}

      {/* HEADER SECTION */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between border-b border-gray-900/60">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">Hello, {userName}!</h1>
          <div className="flex items-center gap-1 bg-orange-950/40 border border-orange-500/30 px-2 py-0.5 rounded-full text-xs text-orange-400 font-medium animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-orange-500" />
            <span>{streakCount} days</span>
          </div>
        </div>
        <div className="w-9 h-9 rounded-full bg-purple-950/30 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold font-mono">
          B
        </div>
      </header>

      <main className="px-5 pt-4 space-y-6">
        
        {/* 24-HOUR NOTIFICATION BANNER */}
        <div className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4 flex gap-3 items-start">
          <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400 shrink-0">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-300">Contribution Window Closing</h4>
            <p className="text-xs text-gray-400 mt-0.5">
              Your cycle savings deadline is in <span className="text-amber-400 font-medium">21 hours</span>. Top up now to protect your streak.
            </p>
          </div>
        </div>

        {/* ACCOUNT TOTAL SAVINGS CARD */}
        <div className="bg-[#16161f] border border-gray-800/80 rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-1">
            <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
              Total Balance in Savings
            </span>
            <div>
              <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                ₦{totalSavings.toLocaleString()}
              </span>
            </div>
          </div>
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-purple-500/5 to-transparent pointer-events-none" />
          <button 
            onClick={handleQuickDeposit}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-[#222230] hover:bg-[#2b2b3d] active:scale-95 transition-all px-4 py-2 rounded-xl text-xs font-medium border border-gray-700 flex items-center gap-2 text-white"
          >
            <Coins className="w-3.5 h-3.5 text-purple-400" />
            Quick Save (+₦10k)
          </button>
        </div>

        {/* 3x2 ACTION GRID FOOTPRINT */}
        <div>
          <h2 className="text-xs font-bold tracking-wide text-gray-500 uppercase mb-3">
            Quick Actions
          </h2>

          <div className="grid grid-cols-3 gap-3">
            
            {/* Box 1: Create Inflation Proof Savings */}
            <button 
              onClick={() => setActiveModal("inflation")}
              className="bg-[#12121a] hover:bg-[#161622] border border-gray-800/60 p-4 rounded-xl flex flex-col items-center text-center justify-between min-h-[110px] transition-all group active:scale-95 shadow-sm"
            >
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-gray-300 leading-tight mt-2">
                Inflation Proof Savings
              </span>
            </button>

            {/* Box 2: Create Regular Savings */}
            <button 
              onClick={() => { setActiveModal("regular"); }}
              className="bg-[#12121a] hover:bg-[#161622] border border-gray-800/60 p-4 rounded-xl flex flex-col items-center text-center justify-between min-h-[110px] transition-all group active:scale-95 shadow-sm"
            >
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                <PiggyBank className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-gray-300 leading-tight mt-2">
                Regular Savings
              </span>
            </button>

            {/* Box 3: Create Group Savings */}
            <button 
              onClick={() => setActiveModal("create-group")}
              className="bg-[#12121a] hover:bg-[#161622] border border-gray-800/60 p-4 rounded-xl flex flex-col items-center text-center justify-between min-h-[110px] transition-all group active:scale-95 shadow-sm"
            >
              <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-gray-300 leading-tight mt-2">
                Create Group
              </span>
            </button>

            {/* Box 4: Join a Savings Group */}
            <button 
              onClick={() => setActiveModal("join-group")}
              className="bg-[#12121a] hover:bg-[#161622] border border-gray-800/60 p-4 rounded-xl flex flex-col items-center text-center justify-between min-h-[110px] transition-all group active:scale-95 shadow-sm"
            >
              <div className="p-2.5 bg-pink-500/10 text-pink-400 rounded-xl group-hover:bg-pink-500/20 transition-colors">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-gray-300 leading-tight mt-2">
                Join Group
              </span>
            </button>

            {/* Box 5: Goal Calculator & Timeline Planner */}
            <button 
              onClick={() => {
                setCalcResult(null);
                setActiveModal("calculator");
              }}
              className="bg-[#12121a] hover:bg-[#161622] border border-gray-800/60 p-4 rounded-xl flex flex-col items-center text-center justify-between min-h-[110px] transition-all group active:scale-95 shadow-sm"
            >
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl group-hover:bg-amber-500/20 transition-colors">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-gray-300 leading-tight mt-2">
                Savings Target Planner
              </span>
            </button>

            {/* Box 6: Alternative Join Group Gate / Dynamic Action */}
            <button 
              onClick={() => setActiveModal("explore")}
              className="bg-[#12121a] hover:bg-[#161622] border border-gray-800/60 p-4 rounded-xl flex flex-col items-center text-center justify-between min-h-[110px] transition-all group active:scale-95 shadow-sm"
            >
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
                <TrendingUp className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-gray-300 leading-tight mt-2">
                Explore Groups
              </span>
            </button>

          </div>
        </div>
      </main>

      {/* DYNAMIC MODAL CONTAINER ENGINE */}
      {activeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="bg-[#121218] border-t sm:border border-gray-800 w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl p-6 space-y-6 max-h-[85vh] overflow-y-auto animate-in slide-in-from-bottom duration-200">
            
            {/* Modal Top Bar Control */}
            <div className="flex items-center justify-between pb-2 border-b border-gray-900">
              <h3 className="text-base font-bold text-white capitalize flex items-center gap-2">
                {activeModal.replace("-", " ")} Workspace
              </h3>
              <button 
                onClick={() => setActiveModal(null)}
                className="p-1 rounded-lg hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL WORKFLOW CONTENT MODULES */}
            {activeModal === "inflation" && (
              <div className="space-y-4">
                <p className="text-xs text-gray-400 leading-relaxed">
                  Lock capital into yielding corridors hedged cleanly against asset degradation.
                </p>
                <div className="bg-blue-950/20 border border-blue-500/10 p-3 rounded-xl text-xs text-blue-400">
                  ⚡ Current Shield yield parameter: **14.2% APY**
                </div>
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-gray-400">Lock Amount (₦)</label>
                  <input type="number" placeholder="e.g. 50000" className="w-full bg-[#181824] border border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 text-white font-mono" id="infAmount" />
                </div>
                <button 
                  onClick={() => {
                    const val = (document.getElementById("infAmount") as HTMLInputElement)?.value;
                    handleActionSubmit("Inflation Shield Lock", val ? parseFloat(val) : 0);
                  }}
                  className="w-full bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs py-3.5 rounded-xl transition-all"
                >
                  Deploy Protected Capital
                </button>
              </div>
            )}

            {activeModal === "regular" && (
              <div className="space-y-4">
                <p className="text-xs text-gray-400">
                  Set aside direct fluid reserves with flexible instant liquidation permissions.
                </p>
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-gray-400">Deposit Amount (₦)</label>
                  <input type="number" placeholder="e.g. 20000" className="w-full bg-[#181824] border border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:border-emerald-500 text-white font-mono" id="regAmount" />
                </div>
                <button 
                  onClick={() => {
                    const val = (document.getElementById("regAmount") as HTMLInputElement)?.value;
                    handleActionSubmit("Regular Savings Increment", val ? parseFloat(val) : 0);
                  }}
                  className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-medium text-xs py-3.5 rounded-xl transition-all"
                >
                  Commit Regular Reserves
                </button>
              </div>
            )}

            {activeModal === "create-group" && (
              <div className="space-y-4">
                <p className="text-xs text-gray-400">
                  Launch a decentralized group peer-pool. Set custom rotation targets and frequencies.
                </p>
                <div className="space-y-3">
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Group Identifier Tag</label>
                    <input type="text" placeholder="e.g. Lagos Legal Crew" className="w-full bg-[#181824] border border-gray-800 rounded-xl p-3 text-xs focus:outline-none text-white" />
                  </div>
                  <div>
                    <label className="text-[11px] uppercase tracking-wider font-bold text-gray-400 block mb-1">Cycle Contribution (₦)</label>
                    <input type="number" placeholder="50000" className="w-full bg-[#181824] border border-gray-800 rounded-xl p-3 text-xs focus:outline-none text-white font-mono" />
                  </div>
                </div>
                <button 
                  onClick={() => handleActionSubmit("Group Generation Initiated")}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white font-medium text-xs py-3.5 rounded-xl transition-all"
                >
                  Initialize Contributor Pool
                </button>
              </div>
            )}

            {activeModal === "join-group" && (
              <div className="space-y-4">
                <p className="text-xs text-gray-400">
                  Input a shared access code key to enter an active private contributor circle.
                </p>
                <div className="space-y-2">
                  <label className="text-[11px] uppercase tracking-wider font-bold text-gray-400">Access Hash / Invitation Key</label>
                  <input type="text" placeholder="e.g. POOL-9482-A3" className="w-full bg-[#181824] border border-gray-800 rounded-xl p-3 text-sm focus:outline-none focus:border-pink-500 text-white font-mono uppercase" />
                </div>
                <button 
                  onClick={() => handleActionSubmit("Circle Membership Granted")}
                  className="w-full bg-pink-600 hover:bg-pink-500 text-white font-medium text-xs py-3.5 rounded-xl transition-all"
                >
                  Validate & Mount Pool
                </button>
              </div>
            )}

            {activeModal === "calculator" && (
              <form onSubmit={handleCalculate} className="space-y-4">
                <p className="text-xs text-gray-400">
                  Input target metrics to accurately project needed milestone contributions.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Target Goal (₦)</label>
                    <input 
                      type="number" 
                      required 
                      value={calcTarget}
                      onChange={(e) => setCalcTarget(e.target.value)}
                      placeholder="1200000" 
                      className="w-full bg-[#181824] border border-gray-800 rounded-xl p-3 text-xs focus:outline-none text-white font-mono" 
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] uppercase tracking-wider font-bold text-gray-400">Timeline (Months)</label>
                    <input 
                      type="number" 
                      required 
                      value={calcMonths}
                      onChange={(e) => setCalcMonths(e.target.value)}
                      placeholder="12" 
                      className="w-full bg-[#181824] border border-gray-800 rounded-xl p-3 text-xs focus:outline-none text-white font-mono" 
                    />
                  </div>
                </div>

                <button 
                  type="submit" 
                  className="w-full bg-amber-600 hover:bg-amber-500 text-white font-medium text-xs py-3 rounded-xl transition-all flex items-center justify-center gap-2"
                >
                  <Calendar className="w-4 h-4" />
                  Evaluate Strategy Blueprint
                </button>

                {calcResult !== null && (
                  <div className="p-4 bg-amber-950/20 border border-amber-500/20 rounded-xl text-center space-y-1 animate-in fade-in">
                    <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider">Required Contribution Rate</span>
                    <div className="text-xl font-black text-amber-400 font-mono">₦{calcResult.toLocaleString()}<span className="text-xs font-normal text-gray-400"> / month</span></div>
                  </div>
                )}
              </form>
            )}

            {activeModal === "explore" && (
              <div className="space-y-4">
                <p className="text-xs text-gray-400">
                  Public, vetted pools searching for active rotation partners.
                </p>
                <div className="space-y-2 max-h-[200px] overflow-y-auto pr-1">
                  {[
                    { name: "SME Boost Alpha", members: "7/10", amount: "₦100k/mo" },
                    { name: "Tech Core Accumulator", members: "4/6", amount: "₦250k/mo" }
                  ].map((group, idx) => (
                    <div key={idx} className="bg-[#181824] border border-gray-800 p-3 rounded-xl flex items-center justify-between text-xs">
                      <div>
                        <div className="font-semibold text-white">{group.name}</div>
                        <div className="text-[10px] text-gray-500">Slots Filled: {group.members}</div>
                      </div>
                      <button 
                        onClick={() => handleActionSubmit(`Joined Public Pool: ${group.name}`)}
                        className="p-2 bg-indigo-600/20 text-indigo-400 border border-indigo-500/20 rounded-lg font-medium hover:bg-indigo-600 hover:text-white transition-all flex items-center gap-1 text-[10px]"
                      >
                        Join Circle <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
