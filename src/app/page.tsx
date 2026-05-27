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
    isUnlocked, userName, hairStyle, setHairStyle, nameDecoration, streakCount, circles, 
    notifications, isMenuOpen, setIsMenuOpen, lockSession, clearNotifications, 
    unlockSession, activeTab, kycVerified, bvnMock, setBvnMock, setKycVerified, 
    joinCircleByCode, createNewCircle
  } = useApp();

  const [pinInput, setPinInput] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [actionGlow, setActionGlow] = useState(false);
  
  // New Extended Form Inputs
  const [cName, setCName] = useState("");
  const [cPurpose, setCPurpose] = useState("");
  const [cAmt, setCAmt] = useState("");
  const [cDuration, setCDuration] = useState("12 Weeks");
  const [cMaturity, setCMaturity] = useState("2026-08-15");
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
      // Integrated extended fields: name, purpose, target, duration, maturity, and default turn order
      createNewCircle(cName, cPurpose, parseFloat(cAmt), cDuration, cMaturity, ["OYEFUNKE", "Staff A"]); 
      setCName(""); setCPurpose(""); setCAmt(""); 
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

  const button3DPrimary = "w-full bg-gradient-to-b from-[#9D33FF] to-[#6A0DAD] shadow-[0_6px_12px_rgba(157,51,255,0.4),inset_0_2px_2px_rgba(255,255,255,0.3),inset_0_-4px_4px_rgba(0,0,0,0.2)] text-white font-bold py-4 rounded-2xl transition-all active:translate-y-1";
  const button3DSecondary = "w-full bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-[0_6px_12px_rgba(0,0,0,0.6),inset_0_2px_2px_rgba(255,255,255,0.1),inset_0_-4px_4px_rgba(0,0,0,0.4)] text-zinc-300 font-bold py-4 rounded-2xl transition-all active:translate-y-1";
  const input3D = "w-full bg-[#050208] border border-white/5 shadow-[inset_0_4px_8px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)] rounded-2xl px-4 py-4 text-xs font-mono text-white";
  const card3D = "bg-gradient-to-b from-[#1c1326] to-[#0d0714] border border-purple-900/30 shadow-[0_12px_24px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[2rem]";

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#030005] flex items-center justify-center p-4">
        <form onSubmit={(e) => { e.preventDefault(); unlockSession(pinInput); }} className={`${card3D} p-8 w-full max-w-sm space-y-6 text-center`}>
          <h1 className="text-white font-mono uppercase tracking-widest">Vault Locked</h1>
          <input type="password" maxLength={6} placeholder="••••" onChange={(e) => setPinInput(e.target.value)} className={input3D} />
          <button type="submit" className={button3DPrimary}>LOG IN</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030005] text-zinc-200 pb-12 relative overflow-x-hidden">
      {actionGlow && <div className="fixed inset-4 z-[100] border-[6px] border-purple-500/50 rounded-[2rem] pointer-events-none animate-pulse" />}
      
      <main className="max-w-md mx-auto px-4 mt-8 space-y-6">
        {/* Restored Registry View with Metadata */}
        {activeTab === "circles" && (
          <div className="space-y-4 animate-fade-in">
            {circles.map((c: any) => (
              <div key={c.id} className={`${card3D} p-6 space-y-4`}>
                <h3 className="text-lg font-bold text-white">{c.name}</h3>
                <div className="flex justify-between text-[10px] text-zinc-400 font-mono uppercase tracking-widest">
                  <span>Duration: {c.duration}</span>
                  <span>Maturity: {c.maturityDate}</span>
                </div>
                <div className="bg-black/40 p-3 rounded-xl border border-white/5">
                  <p className="text-[9px] text-zinc-500 font-bold uppercase">Next Turn</p>
                  <p className="text-sm text-purple-300 font-mono">{c.nextTurn}</p>
                </div>
                <button onClick={triggerSuccessGlow} className={button3DPrimary}>CONTRIBUTE</button>
              </div>
            ))}
          </div>
        )}

        {/* Modal for Extended Creation */}
        {activeModal && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 z-50">
            <form onSubmit={handleCreateCircle} className={`${card3D} w-full max-w-sm p-8 space-y-4`}>
              <h3 className="text-purple-400 font-bold uppercase tracking-wider">Create Savings</h3>
              <input placeholder="Plan Name" value={cName} onChange={(e) => setCName(e.target.value)} className={input3D} />
              <input type="number" placeholder="Target Amount" value={cAmt} onChange={(e) => setCAmt(e.target.value)} className={input3D} />
              <input placeholder="Duration (e.g. 12 Weeks)" value={cDuration} onChange={(e) => setCDuration(e.target.value)} className={input3D} />
              <input type="date" value={cMaturity} onChange={(e) => setCMaturity(e.target.value)} className={input3D} />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setActiveModal(null)} className={button3DSecondary}>CANCEL</button>
                <button type="submit" className={button3DPrimary}>CREATE</button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}
