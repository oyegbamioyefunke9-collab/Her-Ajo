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
    clearNotifications, unlockSession
  } = useApp();

  const [pinInput, setPinInput] = useState("");
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showSuccessConfetti, setShowSuccessConfetti] = useState(false);
  const [urgentNotification, setUrgentNotification] = useState<string | null>(null);

  // Form modals state variables
  const [showDepositModal, setShowDepositModal] = useState<string | null>(null);
  const [fiatPayInput, setFiatPayInput] = useState("");
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  // Sound Effect Trigger
  const playChime = () => {
    const audio = new Audio('/sounds/chime.mp3');
    audio.play().catch(e => console.log("Audio play blocked until user interaction:", e));
  };

  // Calculations
  const globalUSD = circles.reduce((acc, c) => acc + c.current, 0);
  const globalNGN = Math.round(globalUSD * 1370); // Assuming a flat rate for the mockup

  // Check for contributions due in < 24 hours
  useEffect(() => {
    // In a real app, this would check timestamps. Mocking the logic here:
    const hasUrgent = true; 
    if (hasUrgent) {
      setUrgentNotification("Reminder: You have a contribution due in less than 24 hours.");
    }
  }, []);

  const handleDepositSubmit = (e: React.FormEvent, circleId: string) => {
    e.preventDefault();
    if (!fiatPayInput || parseFloat(fiatPayInput) <= 0) return;
    setIsProcessingPay(true);

    setTimeout(() => {
      setIsProcessingPay(false);
      executeContribution(circleId, parseFloat(fiatPayInput) / 1370);
      setFiatPayInput("");
      setShowDepositModal(null);
      playChime(); // Trigger chime on successful deposit
      setShowSuccessConfetti(true);
      setTimeout(() => setShowSuccessConfetti(false), 3000);
    }, 1200);
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#030008] text-zinc-100 flex items-center justify-center p-4">
        <form onSubmit={(e) => { e.preventDefault(); unlockSession(pinInput); }} className="w-full max-w-sm bg-zinc-900/40 border border-purple-950/40 p-8 rounded-3xl text-center space-y-4">
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

      {/* CONFETTI SUCCESS POP OVER */}
      {showSuccessConfetti && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-emerald-600 border border-emerald-400 text-white px-6 py-3 rounded-full shadow-2xl z-50 font-mono text-xs tracking-wider animate-bounce flex items-center gap-2">
          ✨ DEPOSIT SUCCESSFUL ✨
        </div>
      )}

      {/* HEADER WITH STREAK NEXT TO NAME */}
      <header className="max-w-md mx-auto px-4 pt-6 flex items-center justify-between relative z-30">
        <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-3 text-left focus:outline-none">
          <SilhouetteAvatar style={hairStyle} className="w-10 h-10" />
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
          
          <button onClick={lockSession} className="text-zinc-500 hover:text-purple-400"><Lock className="w-5 h-5" /></button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-8 space-y-6">
        
        {/* < 24HR URGENT NOTIFICATION BANNER */}
        {urgentNotification && (
          <div className="bg-amber-950/30 border border-amber-500/40 p-3.5 rounded-2xl flex items-start gap-3 animate-fade-in">
            <Bell className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-xs text-amber-200 leading-relaxed font-medium">{urgentNotification}</p>
          </div>
        )}

        {/* BIG LONG BOX: TOTAL SAVINGS ONLY */}
        <div className="bg-[#120a21] border border-purple-900/40 rounded-3xl p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-fuchsia-500" />
          <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block mb-2">Total Savings Balance</span>
          <div className="text-4xl font-extrabold text-white tracking-tight">
            ₦{globalNGN.toLocaleString()}
          </div>
        </div>

        {/* 3x2 ACTION GRID NAVIGATION */}
        <div className="grid grid-cols-3 gap-3 pt-2">
          {[
            { icon: ShieldCheck, label: "Inflation Proof Savings", color: "text-purple-400" },
            { icon: PiggyBank, label: "Regular Savings", color: "text-emerald-400" },
            { icon: Users, label: "Group Savings", color: "text-blue-400" },
            { icon: UserPlus, label: "Join Savings Group", color: "text-pink-400" },
            { icon: Calculator, label: "Calculate Goal Target", color: "text-amber-400" },
            { icon: Search, label: "Find Savings Groups", color: "text-cyan-400" }
          ].map((item, i) => (
            <button key={i} onClick={playChime} className="bg-zinc-900/40 border border-purple-950/30 hover:border-purple-500/50 hover:bg-zinc-800/60 p-4 rounded-3xl flex flex-col items-center justify-center gap-3 transition-all active:scale-95 shadow-lg">
              <div className="bg-black/50 p-3 rounded-full shadow-inner">
                <item.icon className={`w-6 h-6 ${item.color}`} strokeWidth={1.5} />
              </div>
              <span className="text-[9px] font-medium text-zinc-300 text-center leading-tight px-1">
                {item.label}
              </span>
            </button>
          ))}
        </div>

      </main>

      {/* DEPOSIT MODAL WITH CHIME INTEGRATION */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <form onSubmit={(e) => handleDepositSubmit(e, showDepositModal)} className="bg-zinc-900 border border-purple-950/50 w-full max-w-xs p-5 rounded-2xl space-y-4 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">Deposit Funds</h3>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm font-bold text-zinc-500">₦</span>
                <input type="number" required placeholder="Amount in Naira" value={fiatPayInput} onChange={(e) => setFiatPayInput(e.target.value)} className="w-full bg-black border border-purple-950/20 rounded-xl pl-8 pr-3 py-3 text-sm font-bold text-white focus:outline-none" />
              </div>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setShowDepositModal(null)} className="w-1/2 bg-zinc-800 text-xs py-3 rounded-xl text-zinc-400 font-bold">Cancel</button>
              <button type="submit" disabled={isProcessingPay} className="w-1/2 bg-purple-700 hover:bg-purple-600 text-white text-xs py-3 rounded-xl font-bold transition-colors">
                {isProcessingPay ? "Processing..." : "Confirm Pay"}
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
}
