"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";
import DrawerMenu from "@/components/DrawerMenu";
import SilhouetteAvatar from "@/components/SilhouetteAvatar";
import DecoratedName from "@/components/DecoratedName";
import { 
  ShieldCheck, PiggyBank, Users, UserPlus, Calculator, 
  Search, Bell, Flame, Wallet, Lock 
} from "lucide-react";

export default function AppEngine() {
  const { 
    hasDeviceAccount, isUnlocked, userName, hairStyle, nameDecoration, 
    streakCount, totalSavedThisMonth, lockSession, notifications
  } = useApp();

  // Chime Logic
  const playChime = () => {
    const audio = new Audio('/sounds/chime.mp3'); // Ensure this file exists in your public/sounds folder
    audio.play().catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#030008] text-zinc-200 font-sans pb-24">
      {/* 1. Header: Name with Streak Next to it */}
      <header className="max-w-md mx-auto px-6 pt-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <SilhouetteAvatar style={hairStyle} className="w-10 h-10" />
          <div className="flex flex-col">
            <span className="text-[10px] text-zinc-500 uppercase">Welcome back</span>
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

      <main className="max-w-md mx-auto px-6 mt-6 space-y-6">
        
        {/* 2. Notification Banner (Shows if < 24h) */}
        {notifications.filter(n => n.type === 'urgent').map((n, i) => (
          <div key={i} className="bg-amber-950/20 border border-amber-500/20 rounded-xl p-4 flex gap-3 animate-pulse">
            <Bell className="w-5 h-5 text-amber-400 shrink-0" />
            <p className="text-xs text-amber-200">{n.text}</p>
          </div>
        ))}

        {/* 3. Big Box: Total Savings Only */}
        <div className="bg-[#16161f] border border-gray-800 rounded-3xl p-8 shadow-2xl">
          <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Total Savings Balance</span>
          <div className="text-4xl font-extrabold text-white mt-2">₦{totalSavedThisMonth.toLocaleString()}</div>
        </div>

        {/* 4. 3x2 Grid Action Matrix */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: ShieldCheck, label: "Protect Savings" },
            { icon: PiggyBank, label: "Regular Save" },
            { icon: Users, label: "Group Save" },
            { icon: UserPlus, label: "Join Group" },
            { icon: Calculator, label: "Goal Planner" },
            { icon: Search, label: "Find Groups" }
          ].map((item, i) => (
            <button 
              key={i} 
              onClick={playChime}
              className="bg-[#12121a] border border-gray-800 p-4 rounded-2xl flex flex-col items-center gap-3 hover:border-purple-500/50 transition-all active:scale-95"
            >
              <item.icon className="w-6 h-6 text-purple-400" />
              <span className="text-[10px] font-medium text-zinc-400 text-center leading-tight">{item.label}</span>
            </button>
          ))}
        </div>
      </main>
    </div>
  );
}
