"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import DrawerMenu from "@/components/DrawerMenu";
import SilhouetteAvatar from "@/components/SilhouetteAvatar";
import DecoratedName from "@/components/DecoratedName";
import { 
  ShieldCheck, PiggyBank, Users, UserPlus, Calculator, Search, Bell, Flame, Lock, ArrowRightLeft, TrendingUp
} from "lucide-react";

/**
 * HER-AJO: ADVANCED 3D SKEUOMORPHIC ENGINE
 * This file handles the entire UI logic for the dashboard, registry, ledger, and identity vault.
 */

export default function AppEngine() {
  const { 
    isUnlocked, userName, hairStyle, setHairStyle, nameDecoration, streakCount, circles, 
    notifications, isMenuOpen, setIsMenuOpen, lockSession, clearNotifications, 
    unlockSession, activeTab, ledger, kycVerified, bvnMock, setBvnMock, setKycVerified, 
    joinCircleByCode, createNewCircle
  } = useApp();

  // Navigation & UI States
  const [pinInput, setPinInput] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [urgentNotification, setUrgentNotification] = useState<string | null>(null);

  // Unified Modal & Feedback States
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [actionGlow, setActionGlow] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Savings Creation / Interaction Form Inputs
  const [cName, setCName] = useState("");
  const [cPurpose, setCPurpose] = useState("");
  const [cAmt, setCAmt] = useState("");
  const [cDuration, setCDuration] = useState("12 Weeks");
  const [cMaturity, setCMaturity] = useState("2026-12-15");
  const [joinCodeIn, setJoinCodeIn] = useState("");

  // Derived Financial Metrics
  const globalUSD = circles?.reduce((acc: any, c: any) => acc + (c.current || 0), 0) || 0;
  const globalNGN = Math.round(globalUSD * 1370);

  // 3D Skeuomorphic Style Constants
  const card3D = "bg-gradient-to-b from-[#1c1326] to-[#0d0714] border border-purple-900/30 shadow-[0_12px_24px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[2rem]";
  const button3DPrimary = "w-full bg-gradient-to-b from-[#9D33FF] to-[#6A0DAD] shadow-[0_6px_12px_rgba(157,51,255,0.4),inset_0_2px_2px_rgba(255,255,255,0.3),inset_0_-4px_4px_rgba(0,0,0,0.2)] text-white font-mono text-xs py-4 rounded-2xl font-bold tracking-widest transition-all active:translate-y-1 active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.5)] border border-purple-400/30";
  const button3DSecondary = "w-full bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-[0_6px_12px_rgba(0,0,0,0.6),inset_0_2px_2px_rgba(255,255,255,0.1),inset_0_-4px_4px_rgba(0,0,0,0.4)] text-zinc-300 font-mono text-xs py-4 rounded-2xl font-bold tracking-widest transition-all active:translate-y-1 active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)] border border-zinc-600/30";
  const input3D = "w-full bg-[#050208] border border-white/5 shadow-[inset_0_4px_8px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)] rounded-2xl px-4 py-4 text-xs font-mono text-white focus:outline-none focus:border-purple-500/50 transition-all";

  const triggerSuccessGlow = () => {
    const audio = new Audio('/sounds/chime.mp3');
    audio.play().catch(() => {});
    setActionGlow(true);
    setTimeout(() => setActionGlow(false), 1500);
  };

  useEffect(() => {
    if (!circles) return;
    const needsUrgentPayment = circles.some((c: any) => c.hasPaidThisRound && !c.hasPaidThisRound.includes(userName));
    if (needsUrgentPayment) {
      setUrgentNotification("Alert: Circle contribution due in less than 24 hours.");
    } else {
      setUrgentNotification(null);
    }
  }, [circles, userName]);

  const handleCreateAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (cName && cAmt) { 
      setIsProcessing(true);
      setTimeout(() => {
        createNewCircle(cName, cPurpose, parseFloat(cAmt), cDuration, cMaturity, [userName, "Amina", "Bolu"]); 
        setCName(""); setCPurpose(""); setCAmt(""); 
        setActiveModal(null);
        setIsProcessing(false);
        triggerSuccessGlow();
      }, 800);
    }
  };

  const handleJoinAction = () => {
    if (joinCodeIn) {
      setIsProcessing(true);
      setTimeout(() => {
        joinCircleByCode(joinCodeIn);
        setJoinCodeIn("");
        setActiveModal(null);
        setIsProcessing(false);
        triggerSuccessGlow();
      }, 800);
    }
  };

  // --- SECURITY GATEWAY (LOCKED STATE) ---
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#030005] flex items-center justify-center p-4">
        <form onSubmit={(e) => { e.preventDefault(); unlockSession(pinInput); }} className={`${card3D} w-full max-w-sm p-8 text-center space-y-8`}>
          <div className="space-y-2">
            <h1 className="text-sm font-bold text-zinc-300 uppercase tracking-[0.2em] drop-shadow-md">Hardware Vault</h1>
            <p className="text-[10px] text-zinc-500 font-mono tracking-widest uppercase">System Locked</p>
          </div>
          <input 
            type="password" 
            maxLength={6} 
            placeholder="••••" 
            value={pinInput} 
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))} 
            className={`${input3D} text-center tracking-[0.6em] text-lg text-purple-400`} 
          />
          <button type="submit" className={button3DPrimary}>LOG IN</button>
        </form>
      </div>
    );
  }

  // --- MAIN APPLICATION INTERFACE ---
  return (
    <div className="min-h-screen w-full bg-[#030005] text-zinc-200 font-sans pb-12 relative overflow-x-hidden">
      
      {/* Visual Feedback: 1.5s Glow */}
      {actionGlow && (
        <div className="fixed inset-0 pointer-events-none z-[100] animate-pulse shadow-[inset_0_0_100px_rgba(157,51,255,0.4)] border-[8px] border-purple-500/30 rounded-3xl m-2 transition-all duration-300" />
      )}

      <DrawerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* FIXED HEADER ENGINE */}
      <header className="max-w-md mx-auto px-4 pt-6 flex items-center justify-between relative z-30">
        <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-3 text-left focus:outline-none active:scale-95 transition-transform">
          <div className="p-0.5 bg-gradient-to-b from-purple-500 to-[#030005] rounded-full shadow-[0_4px_10px_rgba(157,51,255,0.3)]">
            <SilhouetteAvatar style={hairStyle} className="w-10 h-10 rounded-full bg-[#110a1c]" />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-zinc-100 font-bold drop-shadow-md"><DecoratedName name={userName} decoration={nameDecoration} /></div>
            <div className="flex items-center gap-1 bg-gradient-to-b from-orange-950 to-black border border-orange-500/30 shadow-[0_2px_4px_rgba(0,0,0,0.5)] px-2 py-0.5 rounded-full text-[10px] text-orange-400 font-mono">
              <Flame className="w-3 h-3" /> {streakCount}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-4 relative">
          <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="relative text-zinc-400 hover:text-purple-400 transition-colors active:translate-y-0.5">
            <Bell className="w-6 h-6" />
            {notifications?.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-[#030005] rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />}
          </button>
          
          {showNotifDropdown && (
            <div className="absolute right-0 top-10 w-64 bg-gradient-to-b from-[#1a1025] to-[#0a0514] border border-purple-500/30 p-3 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.9)] space-y-2 text-xs z-50">
              <div className="flex justify-between items-center border-b border-purple-900/30 pb-1.5"><span className="font-mono text-[10px] text-purple-400 font-bold uppercase">Alerts</span><button onClick={clearNotifications} className="text-[9px] text-zinc-500 hover:text-zinc-300">[ Clear ]</button></div>
              {!notifications || notifications.length === 0 ? <p className="text-zinc-600 text-[11px] py-1">No alerts active.</p> : notifications.map((n: any, i: number) => (
                <div key={i} className="border-b border-purple-900/10 pb-1.5 last:border-0 pt-1"><p className="text-zinc-300 text-[11px] leading-tight drop-shadow-sm">{n.text}</p></div>
              ))}
            </div>
          )}
          <button onClick={lockSession} className="text-zinc-500 hover:text-purple-400 active:translate-y-0.5"><Lock className="w-5 h-5" /></button>
        </div>
      </header>

      {/* CORE VIEWPORT SCENE */}
      <main className="max-w-md mx-auto px-4 mt-8 flex flex-col flex-1 min-h-[65vh] space-y-6">
        
        {/* --- DASHBOARD VIEW (TAB: HOME) --- */}
        {(activeTab === "home" || !activeTab) && (
          <div className="space-y-6 animate-fade-in">
            {urgentNotification && (
              <div className="bg-gradient-to-r from-amber-900/40 to-black border border-amber-500/40 p-4 rounded-2xl flex items-start gap-3 shadow-lg">
                <Bell className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 drop-shadow-md" />
                <p className="text-xs text-amber-100 leading-relaxed font-medium">{urgentNotification}</p>
              </div>
            )}

            <div className={`${card3D} p-8 text-center relative overflow-hidden`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-purple-600 to-[#0d0714]" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-3 drop-shadow-sm">Total Combined Savings</span>
              <div className="text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">₦{globalNGN.toLocaleString()}</div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2">
              {[
                { id: 'create-usd', icon: ShieldCheck, label: "Save in USD", color: "text-purple-400" },
                { id: 'create-regular', icon: PiggyBank, label: "Regular Savings", color: "text-emerald-400" },
                { id: 'create-group', icon: Users, label: "Group Savings", color: "text-blue-400" },
                { id: 'join-group', icon: UserPlus, label: "Join Group", color: "text-pink-400" },
                { id: 'calc-goal', icon: Calculator, label: "Goal Tracker", color: "text-amber-400" },
                { id: 'find-group', icon: Search, label: "Marketplace", color: "text-cyan-400" }
              ].map((item, i) => (
                <button key={i} onClick={() => { setActiveModal(item.id); }} className="bg-gradient-to-b from-[#181024] to-[#0a0510] border border-white/5 shadow-[0_8px_16px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.05)] p-4 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 transition-all active:translate-y-1 active:shadow-inner">
                  <div className="bg-[#050208] p-3 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
                    <item.icon className={`w-6 h-6 ${item.color} drop-shadow-[0_0_8px_currentColor]`} strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] font-bold text-zinc-300 text-center leading-tight tracking-wide">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* --- REGISTRY VIEW (TAB: CIRCLES) --- */}
        {activeTab === "circles" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-purple-900/30 pb-2">
              <h2 className="text-sm font-mono text-purple-400 font-bold uppercase tracking-wider">Ajo Registry</h2>
            </div>
            
            {!circles || circles.length === 0 ? (
              <div className={`${card3D} p-12 text-center`}>
                <Users className="w-8 h-8 text-zinc-700 mx-auto mb-3" />
                <p className="text-zinc-600 font-mono text-xs">Registry is currently empty.</p>
              </div>
            ) : (
              circles.map((c: any) => {
                const progPercent = c.target ? (c.current / c.target) * 100 : 0;
                return (
                  <div key={c.id} className={`${card3D} p-6 space-y-5 relative overflow-hidden`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-lg font-bold text-white tracking-tight">{c.name}</h3>
                        <span className="text-[10px] font-mono text-zinc-500 block mt-1 tracking-tighter">Invite Token: <strong className="text-purple-400 select-all font-mono">{c.inviteCode}</strong></span>
                      </div>
                      {c.isInflationProof && <TrendingUp className="w-4 h-4 text-purple-400" />}
                    </div>
                    
                    {/* Granular Metadata Registry */}
                    <div className="flex justify-between text-[9px] text-zinc-400 font-mono uppercase tracking-[0.15em] bg-[#050208] p-4 rounded-2xl border border-white/5 shadow-inner">
                      <div className="flex flex-col gap-1">
                        <span className="text-zinc-600">CYCLE SPAN</span>
                        <span className="text-zinc-200 font-bold">{c.duration || "N/A"}</span>
                      </div>
                      <div className="flex flex-col gap-1 text-right">
                        <span className="text-zinc-600">TARGET MATURITY</span>
                        <span className="text-zinc-200 font-bold">{c.maturityDate || "N/A"}</span>
                      </div>
                    </div>

                    <div className="bg-gradient-to-r from-purple-900/30 to-black p-4 rounded-2xl border border-purple-500/20 flex items-center justify-between shadow-md">
                      <div>
                        <p className="text-[9px] text-purple-400/80 font-bold uppercase tracking-widest">Active Beneficiary</p>
                        <p className="text-xs text-purple-200 font-mono font-bold mt-0.5">{c.nextTurn || "TBD"}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-[9px] text-zinc-500 font-bold uppercase tracking-widest">Member Count</p>
                        <p className="text-xs text-zinc-300 font-mono font-bold mt-0.5">{c.numMembers || c.members?.length || 1}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="w-full bg-[#050208] h-3 rounded-full overflow-hidden shadow-inner border border-white/5">
                        <div className="bg-gradient-to-r from-purple-600 to-[#b259ff] h-full transition-all duration-300" style={{ width: `${Math.min(progPercent, 100)}%` }} />
                      </div>
                      <div className="flex justify-between font-mono text-[10px] text-zinc-400 font-bold uppercase tracking-wider">
                        <span>Stored: ${c.current || 0}</span>
                        <span>Goal: ${c.target || 0}</span>
                      </div>
                    </div>
                    
                    <button onClick={triggerSuccessGlow} className={button3DPrimary}>MAKE CONTRIBUTION</button>
                  </div>
                );
              })
            )}
          </div>
        )}

        {/* --- LEDGER VIEW (TAB: LEDGER) --- */}
        {activeTab === "ledger" && (
          <div className="space-y-4 animate-fade-in">
             <div className="flex justify-between items-center border-b border-purple-900/30 pb-2">
              <h2 className="text-sm font-mono text-purple-400 font-bold uppercase tracking-wider">Audit Ledger</h2>
            </div>
            <div className={`${card3D} p-4 space-y-3`}>
              {!ledger || ledger.length === 0 ? <p className="text-center text-zinc-600 py-6 font-mono text-xs">No records available.</p> : ledger.map((tx: any) => (
                <div key={tx.id} className="flex items-center justify-between p-4 bg-[#050208] rounded-2xl border border-white/5 shadow-inner">
                  <div className="flex items-center gap-4">
                    <div className="p-2.5 bg-zinc-900 rounded-full text-purple-400"><ArrowRightLeft className="w-4 h-4" /></div>
                    <div>
                      <p className="text-xs font-bold text-white">{tx.circleName}</p>
                      <p className="text-[9px] text-zinc-600 font-mono mt-0.5">{tx.date}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-400 font-mono">+${tx.amount}</p>
                    <p className="text-[9px] text-zinc-600 uppercase font-bold tracking-tighter">Verified</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* --- PROFILE VIEW (TAB: PROFILE) --- */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-fade-in">
            <div className={`${card3D} p-8 text-center space-y-5`}>
              <button 
                onClick={() => setHairStyle(hairStyle === 'locs' ? 'fade' : hairStyle === 'fade' ? 'afro' : 'locs')}
                className="mx-auto block p-1.5 bg-gradient-to-b from-purple-500 to-black rounded-full shadow-lg active:scale-95 transition-transform"
              >
                <SilhouetteAvatar style={hairStyle} className="w-24 h-24 rounded-full bg-[#110a1c]" />
              </button>
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white drop-shadow-md"><DecoratedName name={userName} decoration={nameDecoration} /></h2>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-[0.2em]">Hardware Safe: v1.0.4</p>
              </div>
            </div>
            
            <div className={`${card3D} p-6 space-y-5`}>
              <h3 className="text-xs font-mono uppercase text-purple-400 font-bold tracking-wider">Identity Vault</h3>
              {kycVerified ? (
                <div className="bg-gradient-to-b from-emerald-950/40 to-black border border-emerald-500/30 p-4 rounded-2xl text-center font-mono text-xs text-emerald-400 font-bold shadow-inner">✓ KYC COMPLIANT</div>
              ) : (
                <div className="space-y-4">
                  <input type="text" maxLength={11} placeholder="Enter 11-Digit BVN/NIN" value={bvnMock} onChange={(e) => setBvnMock(e.target.value.replace(/\D/g, ""))} className={input3D} />
                  <button type="button" onClick={() => { if (bvnMock.length >= 10) setKycVerified(true); }} className={button3DPrimary}>SUBMIT CREDENTIALS</button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- UNIFIED 3D MODAL WIZARD --- */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 z-50 animate-fade-in overflow-y-auto">
          
          {/* Savings Creation Modals (USD / Regular / Group) */}
          {(activeModal === 'create-usd' || activeModal === 'create-regular' || activeModal === 'create-group') && (
            <form onSubmit={handleCreateAction} className={`${card3D} w-full max-w-sm p-8 space-y-5 my-auto animate-fade-in`}>
              <div className="space-y-1">
                <h3 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-widest">
                  {activeModal === 'create-usd' ? 'Save in USD' : activeModal === 'create-regular' ? 'Regular Ajo' : 'Group Savings'}
                </h3>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Initialization Wizard</p>
              </div>
              
              <div className="space-y-4">
                <input type="text" required placeholder="Plan Name" value={cName} onChange={(e) => setCName(e.target.value)} className={input3D} />
                <input type="number" required placeholder="Target Amount ($)" value={cAmt} onChange={(e) => setCAmt(e.target.value)} className={input3D} />
                
                <div className="space-y-3 pt-3 border-t border-purple-900/30">
                  <p className="text-[9px] text-zinc-500 font-mono font-bold uppercase tracking-widest">Cycle Configuration</p>
                  <input type="text" required placeholder="Duration (e.g. 12 Weeks)" value={cDuration} onChange={(e) => setCDuration(e.target.value)} className={input3D} />
                  <div className="relative">
                    <input type="date" required value={cMaturity} onChange={(e) => setCMaturity(e.target.value)} className={input3D} />
                  </div>
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setActiveModal(null)} className={button3DSecondary}>ABORT</button>
                <button type="submit" disabled={isProcessing} className={button3DPrimary}>
                  {isProcessing ? "INITIALIZING..." : "CONFIRM"}
                </button>
              </div>
            </form>
          )}

          {/* Join Circle Modal */}
          {activeModal === 'join-group' && (
            <div className={`${card3D} w-full max-w-sm p-8 space-y-6 my-auto animate-fade-in`}>
               <div className="space-y-1">
                <h3 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-widest">Connect Group</h3>
                <p className="text-[10px] text-zinc-500 font-mono uppercase tracking-widest">Enter Access Token</p>
              </div>
              <input type="text" placeholder="TOKEN-1234" value={joinCodeIn} onChange={(e) => setJoinCodeIn(e.target.value.toUpperCase())} className={`${input3D} text-center uppercase tracking-widest font-bold`} />
              <div className="flex gap-4">
                <button type="button" onClick={() => setActiveModal(null)} className={button3DSecondary}>ABORT</button>
                <button type="button" onClick={handleJoinAction} disabled={isProcessing} className={button3DPrimary}>
                  {isProcessing ? "LINKING..." : "CONNECT"}
                </button>
              </div>
            </div>
          )}

          {/* Future Modules Placeholder */}
          {(activeModal === 'calc-goal' || activeModal === 'find-group') && (
            <div className={`${card3D} w-full max-w-sm p-8 text-center space-y-6 my-auto animate-fade-in`}>
              <div className="w-16 h-16 bg-gradient-to-b from-[#1a1025] to-[#050208] shadow-inner border border-white/5 rounded-full flex items-center justify-center mx-auto text-purple-500">
                {activeModal === 'calc-goal' ? <Calculator className="w-8 h-8" /> : <Search className="w-8 h-8" />}
              </div>
              <div className="space-y-2">
                <h3 className="text-sm font-bold text-white uppercase tracking-widest">Coming Soon</h3>
                <p className="text-[11px] text-zinc-500 leading-relaxed font-mono">This cryptographic module is being mapped. Estimated deployment: Q4 2026.</p>
              </div>
              <button type="button" onClick={() => setActiveModal(null)} className={button3DSecondary}>CLOSE</button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
