"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import SilhouetteAvatar from "@/components/SilhouetteAvatar";
import DecoratedName from "@/components/DecoratedName";
import { 
  ShieldCheck, PiggyBank, Users, UserPlus, 
  Calculator, Search, Bell, Lock, Flame 
} from "lucide-react";

export default function AppEngine() {
  const { 
    isUnlocked, lockSession, userName, hairStyle, nameDecoration, 
    streakCount, totalSavedThisMonth, notifications, unlockSession, pinInput, setPinInput 
  } = useApp();

  const playChime = () => {
    const audio = new Audio('/sounds/chime.mp3');
    audio.play().catch(() => {});
  };

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#030008] text-zinc-100 flex items-center justify-center p-4">
        <form onSubmit={(e) => { e.preventDefault(); unlockSession(pinInput); }} className="w-full max-w-sm bg-zinc-900/40 border border-purple-950/40 p-8 rounded-3xl text-center space-y-4">
          <h1 className="text-md font-bold text-zinc-200 uppercase">Vault Locked</h1>
          <input type="password" maxLength={6} placeholder="••••" value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))} className="w-full bg-black border border-purple-500/30 rounded-xl py-3 text-center tracking-[0.6em] font-mono text-xl text-purple-400 focus:outline-none" />
          <button type="submit" className="w-full bg-purple-800 text-white font-mono text-xs py-3 rounded-xl font-bold">Authorize Entry</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030008] text-zinc-200 p-6 pb-12">
      {/* Header: Name + Streak */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <SilhouetteAvatar style={hairStyle} className="w-10 h-10" />
          <div>
            <div className="text-sm font-bold flex items-center gap-2">
              <DecoratedName name={userName} decoration={nameDecoration} />
              <div className="flex items-center gap-1 bg-orange-950/30 border border-orange-500/20 px-2 py-0.5 rounded-full text-[10px] text-orange-400">
                <Flame className="w-3 h-3" /> {streakCount}
              </div>
            </div>
          </div>
        </div>
        <button onClick={lockSession} className="text-zinc-600 hover:text-white"><Lock className="w-5 h-5" /></button>
      </header>

      {/* Urgent Notification Banner */}
      {notifications.filter(n => n.type === 'urgent').map((n, i) => (
        <div key={i} className="mb-6 bg-amber-950/20 border border-amber-500/20 rounded-2xl p-4 flex gap-3 items-center animate-pulse">
          <Bell className="w-5 h-5 text-amber-400" />
          <p className="text-xs text-amber-200">{n.text}</p>
        </div>
      ))}

      {/* Savings Balance Box */}
      <div className="bg-[#16161f] border border-gray-800 rounded-3xl p-8 shadow-2xl mb-8">
        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Savings Balance</span>
        <div className="text-4xl font-extrabold text-white mt-2">₦{totalSavedThisMonth.toLocaleString()}</div>
      </div>

      {/* 3x2 Grid Action Matrix */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: ShieldCheck, label: "Inflation Proof" },
          { icon: PiggyBank, label: "Regular Save" },
          { icon: Users, label: "Group Save" },
          { icon: UserPlus, label: "Join Group" },
          { icon: Calculator, label: "Goal Planner" },
          { icon: Search, label: "Find Groups" }
        ].map((item, i) => (
          <button 
            key={i} 
            onClick={playChime}
            className="bg-[#12121a] border border-gray-800 p-4 rounded-3xl flex flex-col items-center gap-3 hover:border-purple-500/50 transition-all active:scale-95"
          >
            <item.icon className="w-6 h-6 text-purple-400" />
            <span className="text-[9px] font-medium text-zinc-400 text-center leading-tight">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
