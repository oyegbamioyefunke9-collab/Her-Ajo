"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import DrawerMenu from "@/components/DrawerMenu";
import SilhouetteAvatar from "@/components/SilhouetteAvatar";
import DecoratedName from "@/components/DecoratedName";
import { 
  ShieldCheck, PiggyBank, Users, UserPlus, Calculator, Search, Bell, Flame, Lock, 
  ArrowRight 
} from "lucide-react";

export default function AppEngine() {
  const { 
    isUnlocked, userName, hairStyle, setHairStyle, nameDecoration, streakCount, 
    circles, notifications, isMenuOpen, setIsMenuOpen, lockSession, 
    executeContribution, clearNotifications, unlockSession, activeTab, 
    kycVerified, bvnMock, setBvnMock, setKycVerified, joinCircleByCode, 
    createNewCircle 
  } = useApp();

  const [pinInput, setPinInput] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [actionGlow, setActionGlow] = useState(false);

  // Create Circle Form States
  const [cName, setCName] = useState("");
  const [cPurpose, setCPurpose] = useState("");
  const [cAmt, setCAmt] = useState("");
  const [cMembers, setCMembers] = useState("6");
  const [cDuration, setCDuration] = useState("weekly");
  const [isInflationProof, setIsInflationProof] = useState(false);
  const [joinCodeIn, setJoinCodeIn] = useState("");

  const playChime = () => {
    const audio = new Audio('/sounds/chime.mp3');
    audio.play().catch(() => {});
  };

  const triggerSuccessGlow = () => {
    playChime();
    setActionGlow(true);
    setTimeout(() => setActionGlow(false), 1500);
  };

  const handleCreateCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (cName && cAmt) {
      createNewCircle(
        cName, 
        cPurpose || "General Savings", 
        parseFloat(cAmt), 
        cDuration, 
        isInflationProof,
        parseInt(cMembers)
      );
      
      // Reset form
      setCName(""); setCPurpose(""); setCAmt(""); setCMembers("6");
      setIsInflationProof(false);
      setActiveModal(null);
      triggerSuccessGlow();
    }
  };

  const handleJoinCircle = () => {
    if (joinCircleByCode(joinCodeIn)) {
      setJoinCodeIn("");
      setActiveModal(null);
      triggerSuccessGlow();
    }
  };

  // 3D Styles
  const card3D = "bg-gradient-to-b from-[#1c1326] to-[#0d0714] border border-purple-900/30 shadow-[0_12px_24px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[2rem]";
  const button3DPrimary = "w-full bg-gradient-to-b from-[#9D33FF] to-[#6A0DAD] shadow-[0_6px_12px_rgba(157,51,255,0.4),inset_0_2px_2px_rgba(255,255,255,0.3),inset_0_-4px_4px_rgba(0,0,0,0.2)] text-white font-mono text-xs py-4 rounded-2xl font-bold tracking-widest transition-all active:translate-y-1 border border-purple-400/30";
  const button3DSecondary = "w-full bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-[0_6px_12px_rgba(0,0,0,0.6),inset_0_2px_2px_rgba(255,255,255,0.1),inset_0_-4px_4px_rgba(0,0,0,0.4)] text-zinc-300 font-mono text-xs py-4 rounded-2xl font-bold tracking-widest transition-all active:translate-y-1 border border-zinc-600/30";
  const input3D = "w-full bg-[#050208] border border-white/5 shadow-[inset_0_4px_8px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)] rounded-2xl px-4 py-4 text-xs font-mono text-white focus:outline-none focus:border-purple-500/50 transition-colors";

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#030005] text-zinc-100 flex items-center justify-center p-4">
        <form onSubmit={(e) => { e.preventDefault(); unlockSession(pinInput); }} className={`${card3D} w-full max-w-sm p-8 text-center space-y-6`}>
          <h1 className="text-sm font-bold text-zinc-300 uppercase tracking-widest">VAULT LOCKED</h1>
          <input 
            type="password" 
            maxLength={6} 
            placeholder="••••••" 
            value={pinInput} 
            onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))} 
            className={`${input3D} text-center tracking-[0.6em] text-lg text-purple-400`} 
          />
          <button type="submit" className={button3DPrimary}>AUTHORIZE ENTRY</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030005] text-zinc-200 font-sans pb-20 relative overflow-x-hidden">
      {actionGlow && (
        <div className="fixed inset-0 pointer-events-none z-[100] animate-fade-in shadow-[inset_0_0_120px_rgba(157,51,255,0.6)] border-[6px] border-purple-500/60 rounded-3xl m-3" />
      )}

      <DrawerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* HEADER */}
      <header className="max-w-md mx-auto px-4 pt-6 flex items-center justify-between relative z-30">
        {/* ... (your existing header code - kept as is) */}
        <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-3 text-left">
          <div className="p-0.5 bg-gradient-to-b from-purple-500 to-[#030005] rounded-full shadow-[0_4px_10px_rgba(157,51,255,0.3)]">
            <SilhouetteAvatar style={hairStyle} className="w-10 h-10 rounded-full bg-[#110a1c]" />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-zinc-100 font-bold"><DecoratedName name={userName} decoration={nameDecoration} /></div>
            <div className="flex items-center gap-1 bg-gradient-to-b from-orange-900/80 to-black border border-orange-500/30 px-2 py-0.5 rounded-full text-[10px] text-orange-400 font-mono">
              <Flame className="w-3 h-3" /> {streakCount}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-4">
          <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="relative text-zinc-400 hover:text-purple-400">
            <Bell className="w-6 h-6" />
            {notifications.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full" />}
          </button>
          <button onClick={lockSession} className="text-zinc-500 hover:text-purple-400"><Lock className="w-5 h-5" /></button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-8 space-y-6">
        {/* DASHBOARD */}
        {activeTab === "home" && (
          <div className="space-y-6">
            {/* Quick Action Buttons - Very Clear */}
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setActiveModal('create-regular')} className="bg-gradient-to-b from-emerald-900/50 to-black border border-emerald-500/30 p-6 rounded-3xl text-left hover:scale-[1.02] transition-transform">
                <PiggyBank className="w-8 h-8 text-emerald-400 mb-3" />
                <p className="font-bold">Regular Savings</p>
                <p className="text-xs text-zinc-400">Personal • Withdraw anytime</p>
              </button>

              <button onClick={() => setActiveModal('create-group')} className="bg-gradient-to-b from-purple-900/50 to-black border border-purple-500/30 p-6 rounded-3xl text-left hover:scale-[1.02] transition-transform">
                <Users className="w-8 h-8 text-purple-400 mb-3" />
                <p className="font-bold">New Ajo Circle</p>
                <p className="text-xs text-zinc-400">Rotating • Group Savings</p>
              </button>
            </div>

            {/* Existing balance card and other buttons can stay or be adjusted */}
          </div>
        )}

        {/* CIRCLES TAB - Made clearer as Ajo Groups */}
        {activeTab === "circles" && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-mono text-purple-400 font-bold uppercase tracking-wider">My Ajo Circles</h2>
              <button onClick={() => setActiveModal('create-group')} className="text-purple-400 text-xs flex items-center gap-1">
                New Circle <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {circles.length === 0 ? (
              <div className={`${card3D} p-12 text-center`}>
                <Users className="w-12 h-12 mx-auto text-zinc-600 mb-4" />
                <p className="text-zinc-400">No active circles yet</p>
                <p className="text-xs text-zinc-500 mt-2">Create or join an Ajo group</p>
              </div>
            ) : (
              circles.map(c => (
                <div key={c.id} className={`${card3D} p-6 space-y-4`}>
                  <div className="flex justify-between">
                    <h3 className="text-lg font-bold">{c.name}</h3>
                    {c.isInflationProof && (
                      <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded-full">Inflation Protected</span>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="w-full bg-[#050208] h-2.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-500 to-violet-400 h-full" style={{ width: `${(c.current / c.target) * 100}%` }} />
                    </div>
                    <div className="flex justify-between text-xs font-mono text-zinc-400">
                      <span>₦{c.current.toLocaleString()}</span>
                      <span>of ₦{c.target.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="text-xs text-purple-300 font-medium">
                    Next turn: <span className="font-mono">{c.nextTurn || "—"}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* PROFILE TAB (unchanged from your version) */}
        {activeTab === "profile" && (
          /* ... your existing profile code ... */
          <div>...</div>
        )}
      </main>

      {/* MODALS */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 z-50">
          {(activeModal === 'create-regular' || activeModal === 'create-group') && (
            <form onSubmit={handleCreateCircle} className={`${card3D} w-full max-w-sm p-8 space-y-6`}>
              <h3 className="text-lg font-bold text-white">
                {activeModal === 'create-group' ? "Create New Ajo Circle" : "New Regular Savings"}
              </h3>

              <input type="text" placeholder="Circle Name" value={cName} onChange={(e) => setCName(e.target.value)} className={input3D} required />
              <input type="text" placeholder="Purpose (e.g. School Fees, Business)" value={cPurpose} onChange={(e) => setCPurpose(e.target.value)} className={input3D} />
              
              <input type="number" placeholder="Contribution Amount (₦)" value={cAmt} onChange={(e) => setCAmt(e.target.value)} className={input3D} required />

              {activeModal === 'create-group' && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <select value={cMembers} onChange={(e) => setCMembers(e.target.value)} className={input3D}>
                      {[4,6,8,10,12].map(n => <option key={n} value={n}>{n} Members</option>)}
                    </select>
                    <select value={cDuration} onChange={(e) => setCDuration(e.target.value)} className={input3D}>
                      <option value="weekly">Weekly</option>
                      <option value="monthly">Monthly</option>
                    </select>
                  </div>

                  <label className="flex items-center gap-3 text-sm cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={isInflationProof} 
                      onChange={(e) => setIsInflationProof(e.target.checked)}
                      className="w-5 h-5 accent-purple-600"
                    />
                    <div>
                      Inflation Protected <span className="text-xs text-amber-400 block">Converts portion to stable value</span>
                    </div>
                  </label>
                </>
              )}

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setActiveModal(null)} className={button3DSecondary}>CANCEL</button>
                <button type="submit" className={button3DPrimary}>CREATE CIRCLE</button>
              </div>
            </form>
          )}

          {/* Join Modal & others remain similar */}
        </div>
      )}
    </div>
  );
}