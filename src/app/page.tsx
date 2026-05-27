"use client";

import React, { useState, useEffect } from "react";
import { 
  ShieldCheck, 
  PiggyBank, 
  Users, 
  UserPlus, 
  Calculator, 
  Bell, 
  Flame, 
  Wallet,
  Coins
} from "lucide-react";

export default function SavingsDashboard() {
  // State for user details and balance
  const [userName] = useState("Blessed");
  const [totalSavings, setTotalSavings] = useState(150000); // Example base balance
  const [streakCount] = useState(12); // Days active streak
  
  // Audio state for deposit chime
  const playDepositChime = () => {
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    
    // Simple synthesized double-chime (success notification sound)
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
    playTone(now, 523.25, 0.15); // C5 note
    playTone(now + 0.12, 659.25, 0.3); // E5 note
  };

  const handleQuickDeposit = () => {
    setTotalSavings(prev => prev + 10000);
    playDepositChime();
  };

  return (
    <div className="min-h-screen bg-[#0d0d12] text-[#f3f4f6] font-sans antialiased pb-12">
      
      {/* 1. Header Section with Streaks Next to Name */}
      <header className="px-6 pt-8 pb-4 flex items-center justify-between border-b border-gray-900">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold tracking-tight">Hello, {userName}!</h1>
          {/* Streak indicator moved immediately adjacent to the name */}
          <div className="flex items-center gap-1 bg-orange-950/40 border border-orange-500/30 px-2 py-0.5 rounded-full text-xs text-orange-400 font-medium animate-pulse">
            <Flame className="w-3.5 h-3.5 fill-orange-500" />
            <span>{streakCount} days</span>
          </div>
        </div>
        
        {/* Profile Avatar / Settings Area */}
        <div className="w-9 h-9 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center text-gray-400">
          <span className="text-xs font-bold font-mono">B</span>
        </div>
      </header>

      <main className="px-5 pt-4 space-y-6">
        
        {/* 2. Urgent Contribution Notification Banner (Less than 24h) */}
        <div className="bg-amber-950/30 border border-amber-500/20 rounded-xl p-4 flex gap-3 items-start">
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

        {/* 3. Big Long Box - Shows ONLY Total Money in Savings */}
        <div className="bg-[#16161f] border border-gray-800/80 rounded-2xl p-6 relative overflow-hidden shadow-xl">
          <div className="relative z-10 space-y-1">
            <span className="text-xs font-medium tracking-wider text-gray-400 uppercase">
              Total Balance in Savings
            </span>
            <div className="flex items-baseline gap-1">
              <span className="text-3xl font-extrabold tracking-tight text-white font-mono">
                ₦{totalSavings.toLocaleString()}
              </span>
            </div>
          </div>
          
          {/* Decorative backdrop mesh layout element */}
          <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-purple-500/5 to-transparent pointer-events-none" />
          
          {/* Quick Action Button to Trigger Chime and Balance Increment */}
          <button 
            onClick={handleQuickDeposit}
            className="absolute right-4 top-1/2 -translate-y-1/2 bg-gray-800 hover:bg-gray-700 active:scale-95 transition-all px-4 py-2 rounded-xl text-xs font-medium border border-gray-700 flex items-center gap-2"
          >
            <Coins className="w-3.5 h-3.5 text-purple-400" />
            Quick Save (+₦10k)
          </button>
        </div>

        {/* 4. Grid Options Header Label */}
        <div>
          <h2 className="text-sm font-bold tracking-wide text-gray-400 uppercase mb-3">
            Quick Actions
          </h2>

          {/* 3 Horizontal (Columns) x 2 Vertical (Rows) Grid Matrix Structure */}
          <div className="grid grid-cols-3 gap-3">
            
            {/* Box 1: Create Inflation Proof Savings */}
            <button className="bg-[#12121a] hover:bg-[#161622] border border-gray-800/60 p-4 rounded-xl flex flex-col items-center text-center justify-between min-h-[110px] transition-all group active:scale-95">
              <div className="p-2.5 bg-blue-500/10 text-blue-400 rounded-xl group-hover:bg-blue-500/20 transition-colors">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-gray-300 leading-tight mt-2">
                Inflation Proof Savings
              </span>
            </button>

            {/* Box 2: Create Regular Savings */}
            <button className="bg-[#12121a] hover:bg-[#161622] border border-gray-800/60 p-4 rounded-xl flex flex-col items-center text-center justify-between min-h-[110px] transition-all group active:scale-95">
              <div className="p-2.5 bg-emerald-500/10 text-emerald-400 rounded-xl group-hover:bg-emerald-500/20 transition-colors">
                <PiggyBank className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-gray-300 leading-tight mt-2">
                Regular Savings
              </span>
            </button>

            {/* Box 3: Create Group Savings */}
            <button className="bg-[#12121a] hover:bg-[#161622] border border-gray-800/60 p-4 rounded-xl flex flex-col items-center text-center justify-between min-h-[110px] transition-all group active:scale-95">
              <div className="p-2.5 bg-purple-500/10 text-purple-400 rounded-xl group-hover:bg-purple-500/20 transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-gray-300 leading-tight mt-2">
                Create Group
              </span>
            </button>

            {/* Box 4: Join a Savings Group */}
            <button className="bg-[#12121a] hover:bg-[#161622] border border-gray-800/60 p-4 rounded-xl flex flex-col items-center text-center justify-between min-h-[110px] transition-all group active:scale-95">
              <div className="p-2.5 bg-pink-500/10 text-pink-400 rounded-xl group-hover:bg-pink-500/20 transition-colors">
                <UserPlus className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-gray-300 leading-tight mt-2">
                Join Group
              </span>
            </button>

            {/* Box 5: Goal Calculator & Timeline Planner */}
            <button className="bg-[#12121a] hover:bg-[#161622] border border-gray-800/60 p-4 rounded-xl flex flex-col items-center text-center justify-between min-h-[110px] transition-all group active:scale-95">
              <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl group-hover:bg-amber-500/20 transition-colors">
                <Calculator className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-gray-300 leading-tight mt-2">
                Savings Target Planner
              </span>
            </button>

            {/* Box 6: Alternate Join Group Gate / Dynamic Action */}
            <button className="bg-[#12121a] hover:bg-[#161622] border border-gray-800/60 p-4 rounded-xl flex flex-col items-center text-center justify-between min-h-[110px] transition-all group active:scale-95">
              <div className="p-2.5 bg-indigo-500/10 text-indigo-400 rounded-xl group-hover:bg-indigo-500/20 transition-colors">
                <Wallet className="w-5 h-5" />
              </div>
              <span className="text-[11px] font-medium text-gray-300 leading-tight mt-2">
                Explore Groups
              </span>
            </button>

          </div>
        </div>

      </main>
    </div>
  );
}
