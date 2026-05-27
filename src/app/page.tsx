"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import DrawerMenu from "@/components/DrawerMenu";
import SilhouetteAvatar from "@/components/SilhouetteAvatar";
import DecoratedName from "@/components/DecoratedName";
import { 
  ShieldCheck, PiggyBank, Users, UserPlus, Calculator, Search, Bell, Flame, Lock 
} from "lucide-react";

export default function AppEngine() {
  const { 
    isUnlocked, userName, hairStyle, nameDecoration, streakCount, circles, 
    notifications, isMenuOpen, setIsMenuOpen, lockSession, executeContribution, 
    clearNotifications, unlockSession, activeTab, ledger, kycVerified, bvnMock, 
    setBvnMock, setKycVerified, joinCircleByCode, createNewCircle
  } = useApp();

  const [pinInput, setPinInput] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showSuccessConfetti, setShowSuccessConfetti] = useState(false);
  const [urgentNotification, setUrgentNotification] = useState<string | null>(null);

  // Unified Modal State Management
  const [activeModal, setActiveModal] = useState<string | null>(null);
  
  // Form Inputs
  const [cName, setCName] = useState("");
  const [cPurpose, setCPurpose] = useState("");
  const [cAmt, setCAmt] = useState("");
  const [joinCodeIn, setJoinCodeIn] = useState("");
  const [fiatPayInput, setFiatPayInput] = useState("");
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  const globalUSD = circles.reduce((acc, c) => acc + c.current, 0);
  const globalNGN = Math.round(globalUSD * 1370);

  const playChime = () => {
    const audio = new Audio('/sounds/chime.mp3');
    audio.play().catch(() => {});
  };

  useEffect(() => {
    // Check if any circle requires payment in < 24 hours (Mocking the timestamp check)
    const needsUrgentPayment = circles.some(c => !c.hasPaidThisRound.includes(userName));
    if (needsUrgentPayment) {
      setUrgentNotification("Urgent: You have a circle contribution due in less than 24 hours.");
    } else {
      setUrgentNotification(null);
    }
  }, [circles, userName]);

  const handleDepositSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fiatPayInput || parseFloat(fiatPayInput) <= 0) return;
    setIsProcessingPay(true);
    setTimeout(() => {
      setIsProcessingPay(false);
      executeContribution("global-deposit", parseFloat(fiatPayInput) / 1370);
      setFiatPayInput("");
      setActiveModal(null);
      playChime();
      setShowSuccessConfetti(true);
      setTimeout(() => setShowSuccessConfetti(false), 3000);
    }, 1200);
  };

  const handleCreateCircle = (e: React.FormEvent, isInflationProof: boolean) => {
    e.preventDefault();
    if (cName && cAmt) { 
      createNewCircle(cName, cPurpose, parseFloat(cAmt), "weekly", isInflationProof); 
      setCName(""); setCPurpose(""); setCAmt(""); setActiveModal(null); 
    }
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#030008] text-zinc-100 flex items-center justify-center p-4">
        <form onSubmit={(e) => { e.preventDefault(); unlockSession(pinInput); }} className="w-full max-w-sm bg-zinc-900/40 border border-purple-950/40 p-8 rounded-3xl text-center space-y-4 shadow-2xl">
          <h1 className="text-md font-bold text-zinc-200 uppercase tracking-widest">Vault Locked</h1>
          <input type="password" maxLength={6} placeholder="••••" value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))} className="w-full bg-black border border-purple-500/30 rounded-xl py-3 text-center tracking-[0.6em] font-mono text-xl text-purple-400 focus:outline-none" />
          <button type="submit" className="w-full bg-purple-800 text-white font-mono text-xs py-3 rounded-xl font-bold">Authorize Entry</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030008] text-zinc-200 font-sans pb-12 relative overflow-x-hidden">
      <DrawerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {showSuccessConfetti && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-emerald-600 border border-emerald-400 text-white px-6 py-3 rounded-full shadow-2xl z-50 font-mono text-xs tracking-wider animate-bounce flex items-center gap-2">
          ✨ TRANSACTION SUCCESSFUL ✨
        </div>
      )}

      {/* HEADER */}
      <header className="max-w-md mx-auto px-4 pt-6 flex items-center justify-between relative z-30">
        <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-3 text-left focus:outline-none">
          <SilhouetteAvatar style={hairStyle} className="w-10 h-10 shadow-lg shadow-purple-900/20" />
          <div className="flex items-center gap-2">
            <div className="text-sm text-zinc-100 font-bold"><DecoratedName name={userName} decoration={nameDecoration} /></div>
            <div className="flex items-center gap-1 bg-orange-950/40 border border-orange-500/30 px-2 py-0.5 rounded-full text-[10px] text-orange-400 font-mono">
              <Flame className="w-3 h-3" /> {streakCount}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-3 relative">
          <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="relative text-zinc-400 hover:text-purple-400 transition-colors">
            <Bell className="w-6 h-6" />
            {notifications.length > 0 && <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-red-500 border-2 border-[#030008] rounded-full" />}
          </button>
          
          {showNotifDropdown && (
            <div className="absolute right-0 top-10 w-64 bg-[#0a0418] border border-purple-900/60 p-3 rounded-xl shadow-2xl space-y-2 text-xs z-50">
              <div className="flex justify-between items-center border-b border-purple-900/30 pb-1.5"><span className="font-mono text-[10px] text-purple-400 font-bold">ALERTS</span><button onClick={clearNotifications} className="text-[9px] text-zinc-500">[ Clear ]</button></div>
              {notifications.length === 0 ? <p className="text-zinc-600 text-[11px] py-1">No alerts active.</p> : notifications.map((n: any, i: number) => (
                <div key={i} className="border-b border-purple-900/10 pb-1.5 last:border-0 pt-1"><p className="text-zinc-300 text-[11px] leading-tight">{n.text}</p></div>
              ))}
            </div>
          )}
          <button onClick={lockSession} className="text-zinc-500 hover:text-purple-400"><Lock className="w-5 h-5" /></button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-8 space-y-6">
        
        {/* TAB 1: DASHBOARD */}
        {activeTab === "home" && (
          <div className="space-y-6 animate-fade-in">
            {urgentNotification && (
              <div className="bg-amber-950/30 border border-amber-500/40 p-3.5 rounded-2xl flex items-start gap-3 shadow-lg shadow-amber-900/10">
                <Bell className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-200 leading-relaxed font-medium">{urgentNotification}</p>
              </div>
            )}

            <div className="bg-[#120a21] border border-purple-900/40 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-fuchsia-500" />
              <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Total Savings Balance</span>
              <div className="text-4xl font-extrabold text-white tracking-tight">₦{globalNGN.toLocaleString()}</div>
            </div>

            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { id: 'create-inflation', icon: ShieldCheck, label: "Inflation Proof Savings", color: "text-purple-400" },
                { id: 'create-regular', icon: PiggyBank, label: "Regular Savings", color: "text-emerald-400" },
                { id: 'create-group', icon: Users, label: "Group Savings", color: "text-blue-400" },
                { id: 'join-group', icon: UserPlus, label: "Join Savings Group", color: "text-pink-400" },
                { id: 'calc-goal', icon: Calculator, label: "Calculate Goal Target", color: "text-amber-400" },
                { id: 'find-group', icon: Search, label: "Find Savings Groups", color: "text-cyan-400" }
              ].map((item, i) => (
                <button key={i} onClick={() => { playChime(); setActiveModal(item.id); }} className="bg-zinc-900/40 border border-purple-950/30 hover:border-purple-500/50 hover:bg-zinc-800/60 p-4 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-lg">
                  <div className="bg-black/50 p-3 rounded-full shadow-inner"><item.icon className={`w-6 h-6 ${item.color}`} strokeWidth={1.5} /></div>
                  <span className="text-[9px] font-medium text-zinc-300 text-center leading-tight px-1">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CIRCLES */}
        {activeTab === "circles" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-purple-900/30 pb-2"><h2 className="text-sm font-mono text-purple-400 font-bold uppercase tracking-wider">My Active Circles</h2></div>
            {circles.map(c => {
              const progPercent = (c.current / c.target) * 100;
              return (
                <div key={c.id} className="bg-[#070312] border border-purple-900/40 p-5 rounded-3xl space-y-4 shadow-xl">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-bold text-white tracking-tight">{c.name}</h3>
                      <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">Invite Code: <strong className="text-purple-400 select-all">{c.inviteCode}</strong></span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="w-full bg-black h-2 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-fuchsia-500 h-full transition-all duration-300" style={{ width: `${Math.min(progPercent, 100)}%` }} />
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-zinc-500"><span>Saved: ${c.current}</span><span>Target: ${c.target}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: HISTORY */}
        {activeTab === "history" && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1 border-b border-purple-900/30 pb-2"><h2 className="text-sm font-mono text-purple-400 font-bold uppercase tracking-wider">Transaction Ledger</h2></div>
            <div className="space-y-2">
              {ledger.map(l => (
                <div key={l.id} className="bg-zinc-900/40 border border-purple-900/20 p-4 rounded-2xl flex justify-between items-center text-xs font-mono">
                  <div>
                    <span className="text-[9px] font-bold uppercase text-purple-400">{l.type}</span>
                    <p className="text-zinc-200 font-bold pt-1">{l.circleName}</p>
                    <span className="text-zinc-500 text-[10px] block">{l.date}</span>
                  </div>
                  <div className="text-right"><span className="text-sm font-bold text-zinc-100 block">${l.amount}</span></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: PROFILE */}
        {activeTab === "profile" && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-zinc-900/30 border border-purple-900/20 p-6 rounded-3xl text-center space-y-4">
              <SilhouetteAvatar style={hairStyle} className="w-20 h-20 mx-auto" />
              <h2 className="text-lg font-bold text-white"><DecoratedName name={userName} decoration={nameDecoration} /></h2>
            </div>
            <div className="bg-black/40 border border-purple-900/30 p-5 rounded-3xl space-y-4">
              <h3 className="text-xs font-mono uppercase text-purple-400 font-bold tracking-wider">Identity Verification</h3>
              {kycVerified ? (
                <div className="bg-emerald-950/30 border border-emerald-500/30 p-3 rounded-xl text-center font-mono text-xs text-emerald-400">✓ IDENTITY VERIFIED</div>
              ) : (
                <div className="space-y-2">
                  <input type="text" maxLength={11} placeholder="Enter 11-Digit BVN/NIN" value={bvnMock} onChange={(e) => setBvnMock(e.target.value.replace(/\D/g, ""))} className="w-full bg-black border border-purple-900/40 rounded-xl px-3 py-3 text-xs font-mono text-zinc-200 focus:outline-none" />
                  <button type="button" onClick={() => { if (bvnMock.length >= 10) setKycVerified(true); }} className="w-full bg-purple-800 text-white font-mono text-xs py-3 rounded-xl font-bold">Verify Identity</button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- UNIFIED MODAL RENDERER --- */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fade-in">
          
          {/* Creation Modals (Inflation Proof, Regular, Group) */}
          {(activeModal === 'create-inflation' || activeModal === 'create-regular' || activeModal === 'create-group') && (
            <form onSubmit={(e) => handleCreateCircle(e, activeModal === 'create-inflation')} className="bg-zinc-900 border border-purple-900/50 w-full max-w-xs p-6 rounded-3xl space-y-4 shadow-2xl">
              <h3 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-wider">
                {activeModal === 'create-inflation' ? 'Inflation Proof Plan' : activeModal === 'create-regular' ? 'Regular Plan' : 'Group Plan'}
              </h3>
              <input type="text" required placeholder="Plan Name" value={cName} onChange={(e) => setCName(e.target.value)} className="w-full bg-black border border-purple-900/30 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none" />
              <input type="number" required placeholder="Target Amount" value={cAmt} onChange={(e) => setCAmt(e.target.value)} className="w-full bg-black border border-purple-900/30 rounded-xl px-4 py-3 text-xs font-mono text-white focus:outline-none" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="w-1/2 bg-zinc-800 font-mono text-xs py-3 rounded-xl text-zinc-400 font-bold">Cancel</button>
                <button type="submit" className="w-1/2 bg-purple-700 text-white font-mono text-xs py-3 rounded-xl font-bold">Create</button>
              </div>
            </form>
          )}

          {/* Join Group Modal */}
          {activeModal === 'join-group' && (
            <div className="bg-zinc-900 border border-purple-900/50 w-full max-w-xs p-6 rounded-3xl space-y-4 shadow-2xl">
              <h3 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-wider">Join Group</h3>
              <input type="text" placeholder="Enter Invite Code" value={joinCodeIn} onChange={(e) => setJoinCodeIn(e.target.value)} className="w-full bg-black border border-purple-900/30 rounded-xl px-4 py-3 text-xs font-mono text-zinc-200 uppercase tracking-widest focus:outline-none" />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setActiveModal(null)} className="w-1/2 bg-zinc-800 font-mono text-xs py-3 rounded-xl text-zinc-400 font-bold">Cancel</button>
                <button type="button" onClick={() => { if (joinCircleByCode(joinCodeIn)) { setJoinCodeIn(""); setActiveModal(null); } }} className="w-1/2 bg-purple-700 text-white font-mono text-xs py-3 rounded-xl font-bold">Join</button>
              </div>
            </div>
          )}

          {/* Calculate Goal / Find Groups Placeholder Modals */}
          {(activeModal === 'calc-goal' || activeModal === 'find-group') && (
            <div className="bg-zinc-900 border border-purple-900/50 w-full max-w-xs p-6 rounded-3xl text-center space-y-4 shadow-2xl">
              <div className="w-12 h-12 bg-purple-900/20 rounded-full flex items-center justify-center mx-auto text-purple-400">
                {activeModal === 'calc-goal' ? <Calculator /> : <Search />}
              </div>
              <h3 className="text-sm font-bold font-mono text-zinc-100">Coming Soon</h3>
              <p className="text-xs text-zinc-400 leading-relaxed">This feature is currently being mapped and will be available in the next layout update.</p>
              <button type="button" onClick={() => setActiveModal(null)} className="w-full bg-zinc-800 font-mono text-xs py-3 rounded-xl text-zinc-300 font-bold mt-2">Close</button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}
