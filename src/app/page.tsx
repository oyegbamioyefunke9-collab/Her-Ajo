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
    notifications, isMenuOpen, setIsMenuOpen, lockSession, executeContribution, 
    clearNotifications, unlockSession, activeTab, ledger, kycVerified, bvnMock, 
    setBvnMock, setKycVerified, joinCircleByCode, createNewCircle
  } = useApp();

  const [pinInput, setPinInput] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [urgentNotification, setUrgentNotification] = useState<string | null>(null);

  // Unified Modal & Success State
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [actionGlow, setActionGlow] = useState(false);
  
  // Form Inputs
  const [cName, setCName] = useState("");
  const [cPurpose, setCPurpose] = useState("");
  const [cAmt, setCAmt] = useState("");
  const [cDuration, setCDuration] = useState("weekly");
  const [isInflationProof, setIsInflationProof] = useState(false);
  const [joinCodeIn, setJoinCodeIn] = useState("");

  const globalUSD = circles.reduce((acc, c) => acc + c.current, 0);
  const globalNGN = Math.round(globalUSD * 1370);

  const playChime = () => {
    const audio = new Audio('/sounds/chime.mp3');
    audio.play().catch(() => {});
  };

  const triggerSuccessGlow = () => {
    playChime();
    setActionGlow(true);
    setTimeout(() => setActionGlow(false), 1500);
  };

  useEffect(() => {
    const needsUrgentPayment = circles.some(c => !c.hasPaidThisRound.includes(userName));
    if (needsUrgentPayment) {
      setUrgentNotification("Urgent: You have a circle contribution due in less than 24 hours.");
    } else {
      setUrgentNotification(null);
    }
  }, [circles, userName]);

  const handleCreateCircle = (e: React.FormEvent) => {
    e.preventDefault();
    if (cName && cAmt) { 
      createNewCircle(cName, cPurpose || "Personal Savings", parseFloat(cAmt), cDuration, isInflationProof); 
      // Reset form
      setCName(""); setCPurpose(""); setCAmt(""); setIsInflationProof(false); setCDuration("weekly");
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

  // 3D Button Utility Classes
  const button3DPrimary = "w-full bg-gradient-to-b from-[#9D33FF] to-[#6A0DAD] shadow-[0_6px_12px_rgba(157,51,255,0.4),inset_0_2px_2px_rgba(255,255,255,0.3),inset_0_-4px_4px_rgba(0,0,0,0.2)] text-white font-mono text-xs py-4 rounded-2xl font-bold tracking-widest transition-all active:translate-y-1 active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.5),0_0px_0px_rgba(157,51,255,0)] border border-purple-400/30";
  const button3DSecondary = "w-full bg-gradient-to-b from-zinc-700 to-zinc-900 shadow-[0_6px_12px_rgba(0,0,0,0.6),inset_0_2px_2px_rgba(255,255,255,0.1),inset_0_-4px_4px_rgba(0,0,0,0.4)] text-zinc-300 font-mono text-xs py-4 rounded-2xl font-bold tracking-widest transition-all active:translate-y-1 active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.6)] border border-zinc-600/30";
  const input3D = "w-full bg-[#050208] border border-white/5 shadow-[inset_0_4px_8px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)] rounded-2xl px-4 py-4 text-xs font-mono text-white focus:outline-none focus:border-purple-500/50 transition-colors";

  const card3D = "bg-gradient-to-b from-[#1c1326] to-[#0d0714] border border-purple-900/30 shadow-[0_12px_24px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)] rounded-[2rem]";

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#030005] text-zinc-100 flex items-center justify-center p-4">
        <form onSubmit={(e) => { e.preventDefault(); unlockSession(pinInput); }} className={`${card3D} w-full max-w-sm p-8 text-center space-y-6`}>
          <h1 className="text-sm font-bold text-zinc-300 uppercase tracking-widest drop-shadow-md">Vault Locked</h1>
          <input type="password" maxLength={6} placeholder="••••" value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))} className={`${input3D} text-center tracking-[0.6em] text-lg text-purple-400`} />
          <button type="submit" className={button3DPrimary}>AUTHORIZE ENTRY</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030005] text-zinc-200 font-sans pb-12 relative overflow-x-hidden">
      
      {/* Success Glow Overlay */}
      {actionGlow && (
        <div className="fixed inset-0 pointer-events-none z-[100] animate-fade-in shadow-[inset_0_0_100px_rgba(157,51,255,0.5)] border-[4px] border-purple-500/50 rounded-3xl m-2 transition-all duration-300" />
      )}

      <DrawerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* HEADER */}
      <header className="max-w-md mx-auto px-4 pt-6 flex items-center justify-between relative z-30">
        {/* ... (Header unchanged) */}
        <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-3 text-left focus:outline-none active:scale-95 transition-transform">
          <div className="p-0.5 bg-gradient-to-b from-purple-500 to-[#030005] rounded-full shadow-[0_4px_10px_rgba(157,51,255,0.3)]">
            <SilhouetteAvatar style={hairStyle} className="w-10 h-10 rounded-full bg-[#110a1c]" />
          </div>
          <div className="flex items-center gap-2">
            <div className="text-sm text-zinc-100 font-bold drop-shadow-md"><DecoratedName name={userName} decoration={nameDecoration} /></div>
            <div className="flex items-center gap-1 bg-gradient-to-b from-orange-900/80 to-black border border-orange-500/30 shadow-[0_2px_4px_rgba(0,0,0,0.5)] px-2 py-0.5 rounded-full text-[10px] text-orange-400 font-mono">
              <Flame className="w-3 h-3" /> {streakCount}
            </div>
          </div>
        </button>

        <div className="flex items-center gap-4 relative">
          <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="relative text-zinc-400 hover:text-purple-400 transition-colors drop-shadow-md active:translate-y-0.5">
            <Bell className="w-6 h-6" />
            {notifications.length > 0 && <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-[#030005] rounded-full shadow-[0_0_8px_rgba(239,68,68,0.6)]" />}
          </button>
          
          {showNotifDropdown && (
            <div className="absolute right-0 top-10 w-64 bg-gradient-to-b from-[#1a1025] to-[#0a0514] border border-purple-500/30 p-3 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.9),inset_0_1px_1px_rgba(255,255,255,0.1)] space-y-2 text-xs z-50">
              <div className="flex justify-between items-center border-b border-purple-900/30 pb-1.5"><span className="font-mono text-[10px] text-purple-400 font-bold tracking-wider">ALERTS</span><button onClick={clearNotifications} className="text-[9px] text-zinc-500 hover:text-zinc-300">[ Clear ]</button></div>
              {notifications.length === 0 ? <p className="text-zinc-600 text-[11px] py-1">No alerts active.</p> : notifications.map((n: any, i: number) => (
                <div key={i} className="border-b border-purple-900/10 pb-1.5 last:border-0 pt-1"><p className="text-zinc-300 text-[11px] leading-tight drop-shadow-sm">{n.text}</p></div>
              ))}
            </div>
          )}
          <button onClick={lockSession} className="text-zinc-500 hover:text-purple-400 active:translate-y-0.5 drop-shadow-md"><Lock className="w-5 h-5" /></button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-8 space-y-6">
        
        {/* TAB 1: DASHBOARD - Enhanced with Clear Ajo Creation */}
        {activeTab === "home" && (
          <div className="space-y-6 animate-fade-in">
            {urgentNotification && (
              <div className="bg-gradient-to-r from-amber-900/40 to-black border border-amber-500/40 p-4 rounded-2xl flex items-start gap-3 shadow-[0_8px_16px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.1)]">
                <Bell className="w-5 h-5 text-amber-400 shrink-0 mt-0.5 drop-shadow-md" />
                <p className="text-xs text-amber-100 leading-relaxed font-medium">{urgentNotification}</p>
              </div>
            )}

            <div className={`${card3D} p-8 text-center relative overflow-hidden`}>
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-400 via-purple-600 to-[#0d0714]" />
              <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-widest block mb-3 drop-shadow-sm">Total Savings Balance</span>
              <div className="text-5xl font-extrabold text-white tracking-tight drop-shadow-[0_4px_4px_rgba(0,0,0,0.5)]">₦{globalNGN.toLocaleString()}</div>
            </div>

            {/* Prominent Create Ajo Circle Button */}
            <button 
              onClick={() => setActiveModal('create-ajo')} 
              className="w-full bg-gradient-to-r from-purple-600 to-violet-600 py-5 rounded-3xl font-bold text-lg shadow-[0_8px_20px_rgba(157,51,255,0.4)] active:translate-y-1 transition-all flex items-center justify-center gap-3"
            >
              <Users className="w-6 h-6" />
              CREATE NEW AJO CIRCLE
            </button>

            <div className="grid grid-cols-3 gap-4 pt-2">
              {/* Other quick actions remain */}
              {[
                { id: 'create-regular', icon: PiggyBank, label: "Regular Savings", color: "text-emerald-400" },
                { id: 'join-group', icon: UserPlus, label: "Join Group", color: "text-pink-400" },
                { id: 'calc-goal', icon: Calculator, label: "Goal Calculator", color: "text-amber-400" },
              ].map((item, i) => (
                <button key={i} onClick={() => { playChime(); setActiveModal(item.id); }} className="bg-gradient-to-b from-[#181024] to-[#0a0510] border border-white/5 shadow-[0_8px_16px_rgba(0,0,0,0.6),inset_0_1px_1px_rgba(255,255,255,0.05)] p-4 rounded-[1.5rem] flex flex-col items-center justify-center gap-3 transition-all active:translate-y-1 active:shadow-[inset_0_4px_8px_rgba(0,0,0,0.8)]">
                  <div className="bg-[#050208] p-3 rounded-full shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)]">
                    <item.icon className={`w-6 h-6 ${item.color} drop-shadow-[0_0_8px_currentColor]`} strokeWidth={1.5} />
                  </div>
                  <span className="text-[9px] font-bold text-zinc-300 text-center leading-tight px-1 tracking-wide">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: CIRCLES - unchanged for now */}
        {activeTab === "circles" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-purple-900/30 pb-2">
              <h2 className="text-sm font-mono text-purple-400 font-bold uppercase tracking-wider drop-shadow-md">My Active Circles</h2>
            </div>
            {circles.map(c => {
              const progPercent = (c.current / c.target) * 100;
              return (
                <div key={c.id} className={`${card3D} p-6 space-y-5`}>
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-bold text-white tracking-tight drop-shadow-md">{c.name}</h3>
                      <span className="text-[10px] font-mono text-zinc-500 block mt-1">Invite Code: <strong className="text-purple-400 select-all">{c.inviteCode}</strong></span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="w-full bg-[#050208] h-3 rounded-full overflow-hidden shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)] border border-white/5">
                      <div className="bg-gradient-to-r from-purple-600 to-[#b259ff] h-full transition-all duration-300 shadow-[0_0_10px_rgba(157,51,255,0.6)]" style={{ width: `${Math.min(progPercent, 100)}%` }} />
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-zinc-400 font-bold"><span>Saved: ${c.current}</span><span>Target: ${c.target}</span></div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 4: PROFILE - unchanged */}
        {activeTab === "profile" && (
          <div className="space-y-6 animate-fade-in">
            {/* ... Profile content unchanged ... */}
            <div className={`${card3D} p-8 text-center space-y-4`}>
              <button 
                onClick={() => setHairStyle(hairStyle === 'locs' ? 'fade' : hairStyle === 'fade' ? 'afro' : 'locs')}
                className="mx-auto block p-1 bg-gradient-to-b from-purple-500 to-[#050208] rounded-full shadow-[0_8px_16px_rgba(157,51,255,0.3)] active:scale-95 transition-transform"
              >
                <SilhouetteAvatar style={hairStyle} className="w-24 h-24 rounded-full bg-[#110a1c]" />
              </button>
              <h2 className="text-xl font-bold text-white drop-shadow-lg"><DecoratedName name={userName} decoration={nameDecoration} /></h2>
              <p className="text-xs text-zinc-500 font-mono">Tap avatar to change</p>
            </div>
            
            <div className={`${card3D} p-6 space-y-5`}>
              <h3 className="text-xs font-mono uppercase text-purple-400 font-bold tracking-wider drop-shadow-md">Identity Verification</h3>
              {kycVerified ? (
                <div className="bg-gradient-to-b from-emerald-900/40 to-black border border-emerald-500/30 p-4 rounded-2xl text-center font-mono text-xs text-emerald-400 font-bold shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">✓ IDENTITY VERIFIED</div>
              ) : (
                <div className="space-y-3">
                  <input type="text" maxLength={11} placeholder="Enter 11-Digit BVN/NIN" value={bvnMock} onChange={(e) => setBvnMock(e.target.value.replace(/\D/g, ""))} className={input3D} />
                  <button type="button" onClick={() => { if (bvnMock.length >= 10) setKycVerified(true); }} className={button3DPrimary}>VERIFY IDENTITY</button>
                </div>
              )}
            </div>
          </div>
        )}
      </main>

      {/* --- UNIFIED MODAL RENDERER with Inflation Toggle --- */}
      {activeModal && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 z-50 animate-fade-in">
          
          {/* Main Ajo Circle Creation Modal */}
          {activeModal === 'create-ajo' && (
            <form onSubmit={handleCreateCircle} className={`${card3D} w-full max-w-sm p-8 space-y-6`}>
              <h3 className="text-lg font-bold text-white text-center">Create New Ajo Circle</h3>
              
              <input type="text" required placeholder="Circle Name (e.g. Market Trade)" value={cName} onChange={(e) => setCName(e.target.value)} className={input3D} />
              <input type="text" placeholder="Purpose (e.g. School Fees, Business)" value={cPurpose} onChange={(e) => setCPurpose(e.target.value)} className={input3D} />
              
              <input type="number" required placeholder="Contribution Amount (₦)" value={cAmt} onChange={(e) => setCAmt(e.target.value)} className={input3D} />
              
              <div className="space-y-2">
                <label className="text-xs font-mono text-zinc-400 block">Cycle Duration</label>
                <select value={cDuration} onChange={(e) => setCDuration(e.target.value)} className={input3D}>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              </div>

              {/* Inflation Proof Toggle */}
              <div className="flex items-center justify-between bg-[#050208] p-4 rounded-2xl border border-white/5">
                <div>
                  <p className="text-white text-sm">Inflation-Protected</p>
                  <p className="text-[10px] text-zinc-500">Convert to stable value</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isInflationProof} 
                    onChange={(e) => setIsInflationProof(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-zinc-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-500 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-gradient-to-r peer-checked:from-purple-500 peer-checked:to-violet-500"></div>
                </label>
              </div>

              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setActiveModal(null)} className={button3DSecondary}>CANCEL</button>
                <button type="submit" className={button3DPrimary}>CREATE AJO CIRCLE</button>
              </div>
            </form>
          )}

          {/* Other existing modals (Regular Savings, Join, etc.) */}
          {(activeModal === 'create-regular' || activeModal === 'create-usd') && (
            <form onSubmit={(e) => handleCreateCircle(e)} className={`${card3D} w-full max-w-sm p-8 space-y-5`}>
              <h3 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-wider drop-shadow-md">
                Regular Savings
              </h3>
              <input type="text" required placeholder="Plan Name" value={cName} onChange={(e) => setCName(e.target.value)} className={input3D} />
              <input type="number" required placeholder="Target Amount" value={cAmt} onChange={(e) => setCAmt(e.target.value)} className={input3D} />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setActiveModal(null)} className={button3DSecondary}>CANCEL</button>
                <button type="submit" className={button3DPrimary}>CREATE</button>
              </div>
            </form>
          )}

          {/* Join Group Modal - unchanged */}
          {activeModal === 'join-group' && (
            <div className={`${card3D} w-full max-w-sm p-8 space-y-5`}>
              <h3 className="text-sm font-bold font-mono text-purple-400 uppercase tracking-wider drop-shadow-md">Join Group</h3>
              <input type="text" placeholder="Enter Invite Code" value={joinCodeIn} onChange={(e) => setJoinCodeIn(e.target.value)} className={`${input3D} uppercase tracking-widest`} />
              <div className="flex gap-3 pt-4">
                <button type="button" onClick={() => setActiveModal(null)} className={button3DSecondary}>CANCEL</button>
                <button type="button" onClick={handleJoinCircle} className={button3DPrimary}>JOIN</button>
              </div>
            </div>
          )}

          {/* Placeholder Modals */}
          {(activeModal === 'calc-goal' || activeModal === 'find-group') && (
            <div className={`${card3D} w-full max-w-sm p-8 text-center space-y-5`}>
              <div className="w-16 h-16 bg-gradient-to-b from-[#1a1025] to-[#0a0514] shadow-[inset_0_2px_4px_rgba(0,0,0,0.8),0_1px_0_rgba(255,255,255,0.05)] border border-white/5 rounded-full flex items-center justify-center mx-auto text-purple-400">
                {activeModal === 'calc-goal' ? <Calculator className="drop-shadow-[0_0_8px_currentColor]" /> : <Search className="drop-shadow-[0_0_8px_currentColor]" />}
              </div>
              <h3 className="text-sm font-bold font-mono text-zinc-100 drop-shadow-md">Coming Soon</h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-medium">This feature is currently being mapped and will be available in the next layout update.</p>
              <button type="button" onClick={() => setActiveModal(null)} className={`${button3DSecondary} mt-4`}>CLOSE</button>
            </div>
          )}

        </div>
      )}
    </div>
  );
}