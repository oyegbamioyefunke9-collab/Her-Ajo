"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import GlowStateBanner from "@/components/GlowStateBanner";
import DrawerMenu from "@/components/DrawerMenu";

export default function AppEngine() {
  const { 
    userKeys, hasDeviceAccount, isUnlocked, isGlowActive, activeQuote,
    savingsBoxes, isIncognito, simulateDeposit, registerAccount, unlockSession, 
    lockSession, removeAccountFromDevice
  } = useApp();

  // Authentication states
  const [pinInput, setPinInput] = useState("");
  const [setupStep, setSetupStep] = useState<"landing" | "keys" | "pin">("landing");
  const [authError, setAuthError] = useState("");
  
  // Dashboard transaction handling states
  const [depositAmounts, setDepositAmounts] = useState<Record<string, string>>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Mock initial setup values
  const rawGeneratedMnemonic = "wisdom anchor flame genuine vivid cluster dynamic orphan hybrid visual adjust forward";
  const mockDerivedNpub = "npub1herajo7v6p3x9w88qy2u5kllcs8z3nwq9p0fmslqcrg7ex4003vsqe69v4";

  const handleVerifyUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    const success = unlockSession(pinInput);
    if (!success) {
      setAuthError("INVALID SECURE PIN UTILITY CODE");
      setPinInput("");
    } else {
      setAuthError("");
      setPinInput("");
    }
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length < 4) return;
    registerAccount({ mnemonic: rawGeneratedMnemonic, npub: mockDerivedNpub }, pinInput);
    setPinInput("");
  };

  const handleDeposit = (boxId: string) => {
    const amount = depositAmounts[boxId];
    if (!amount || parseFloat(amount) <= 0) return;
    simulateDeposit(boxId, parseFloat(amount));
    setDepositAmounts({ ...depositAmounts, [boxId]: "" });
  };

  // --- 1. OPAQUE GLOW STATE SPLASH RITUAL ---
  if (isGlowActive) {
    return (
      <div className="fixed inset-0 bg-[#04000c] flex flex-col items-center justify-center p-6 z-50 transition-all duration-1000">
        <div className="absolute w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="max-w-xl text-center space-y-6 relative animate-fade-in">
          <span className="text-[10px] font-mono tracking-[0.3em] text-purple-400 uppercase font-bold block">
            AUTHENTICATED // SECURE SESSION GLOW
          </span>
          <h2 className="text-2xl md:text-3xl font-serif italic text-purple-200 text-neon-glow font-medium px-4 leading-relaxed">
            "{activeQuote}"
          </h2>
          <div className="h-[2px] w-12 bg-purple-500/40 mx-auto mt-4 rounded-full" />
        </div>
      </div>
    );
  }

  // --- 2. FIRST TIME DEVICE ACCESS (LANDING / SEED / PIN) ---
  if (!hasDeviceAccount) {
    return (
      <div className="min-h-screen bg-[#03000a] text-zinc-100 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(147,51,234,0.04),transparent_50%)] pointer-events-none" />
        
        <div className="w-full max-w-md bg-zinc-900/40 border border-purple-950/40 p-8 rounded-3xl shadow-neon-purple backdrop-blur-xl space-y-6">
          {setupStep === "landing" && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white bg-gradient-to-r from-zinc-100 to-purple-300 bg-clip-text text-transparent">
                  Her-Ajo
                </h1>
                <p className="text-xs font-mono text-purple-400/70 uppercase tracking-widest">
                  Sovereign Stable Balance Protection
                </p>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                A secure space for physical cash conversion and financial shielding. No tracking hooks. Total ownership.
              </p>
              <button
                onClick={() => setSetupStep("keys")}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white font-mono text-sm font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-purple-700/20"
              >
                Create Vault Storage
              </button>
            </div>
          )}

          {setupStep === "keys" && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-lg font-bold text-zinc-200">Your Master Secret Key</h2>
                <p className="text-xs text-zinc-500 mt-1">Copy down these safety words physically.</p>
              </div>
              <div className="bg-black/40 border border-purple-900/30 rounded-xl p-4 font-mono text-xs grid grid-cols-2 gap-2 text-zinc-300">
                {rawGeneratedMnemonic.split(" ").map((word, i) => (
                  <div key={i} className="flex gap-2">
                    <span className="text-purple-500 font-bold">{i+1}.</span>
                    <span>{word}</span>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setSetupStep("pin")}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white font-mono text-sm font-bold py-3.5 rounded-xl transition-all"
              >
                I Have Protected My Key
              </button>
            </div>
          )}

          {setupStep === "pin" && (
            <form onSubmit={handleCompleteRegistration} className="space-y-4">
              <div className="text-center space-y-1">
                <h2 className="text-lg font-bold text-zinc-200">Set Security Lock PIN</h2>
                <p className="text-xs text-zinc-500">Used for local verification when opening your app.</p>
              </div>
              <input
                type="password"
                maxLength={6}
                placeholder="Enter Numeric PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-black/60 border border-purple-500/30 rounded-xl py-3 text-center tracking-[0.5em] font-mono text-lg focus:outline-none focus:border-purple-500 text-purple-300"
              />
              <button
                type="submit"
                className="w-full bg-purple-700 hover:bg-purple-600 text-white font-mono text-xs font-bold py-3.5 rounded-xl transition-all"
              >
                Instantiate Safe Vault ⚡
              </button>
            </form>
          )}
        </div>
      </div>
    );
  }

  // --- 3. PASSWORD LOCKSCREEN FOR EXISTING ACCOUNT ---
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#03000a] text-zinc-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-zinc-900/40 border border-purple-950/40 p-8 rounded-3xl shadow-neon-purple backdrop-blur-xl text-center space-y-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-200">Vault Session Locked</h1>
            <p className="text-xs text-zinc-500 mt-1">Provide your local secure verification PIN</p>
          </div>
          
          <form onSubmit={handleVerifyUnlock} className="space-y-4">
            <input
              type="password"
              maxLength={6}
              placeholder="••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-black/60 border border-purple-500/30 rounded-xl py-3 text-center tracking-[0.6em] font-mono text-xl focus:outline-none focus:border-purple-500 text-purple-400"
            />
            {authError && <p className="text-[10px] font-mono text-red-400 uppercase tracking-wider">{authError}</p>}
            <button
              type="submit"
              className="w-full bg-purple-700 hover:bg-purple-600 text-white font-mono text-xs font-bold py-3.5 rounded-xl transition-all"
            >
              Verify & Unlock
            </button>
          </form>

          <button
            onClick={removeAccountFromDevice}
            className="text-[10px] font-mono text-zinc-600 hover:text-red-400 transition-colors uppercase tracking-wider"
          >
            [ Completely Wipe Account From Device ]
          </button>
        </div>
      </div>
    );
  }

  // --- 4. SECURE DASHBOARD VIEW LAYER ---
  return (
    <div className="min-h-screen bg-[#03000a] text-zinc-200 font-sans selection:bg-purple-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(147,51,234,0.02),transparent_40%)] pointer-events-none" />
      
      {/* SIDE DRAWER TOGGLE INTERFACE */}
      <DrawerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      <header className="max-w-5xl mx-auto px-4 pt-6 flex justify-between items-center">
        <button 
          onClick={() => setIsMenuOpen(true)}
          className="p-2 bg-zinc-900/60 border border-purple-950/40 rounded-xl text-purple-400 font-mono text-xs font-bold flex items-center gap-2 hover:border-purple-500/30"
        >
          ☰ System Control
        </button>
        
        <div className="flex items-center gap-4">
          <button 
            onClick={lockSession}
            className="text-xs font-mono text-zinc-500 hover:text-purple-400 transition-colors"
          >
            [ Lock Session ]
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto p-4 space-y-6">
        
        <GlowStateBanner />

        {/* METRICS DISPLAYS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-zinc-900/20 border border-purple-950/40 p-6 rounded-2xl relative overflow-hidden">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Shielded Asset Capital</p>
            <p className="text-3xl font-bold mt-2 font-mono tracking-tight text-purple-100 text-neon-glow">
              {isIncognito ? "••••.••" : `$${savingsBoxes.reduce((a, b) => a + b.current, 0).toFixed(2)}`}
            </p>
          </div>

          <div className="bg-zinc-900/20 border border-purple-950/40 p-6 rounded-2xl">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Identification Sequence</p>
            <p className="text-xs font-mono text-zinc-400 truncate mt-3 bg-black/40 p-2 rounded-lg border border-purple-950/20">
              {userKeys?.npub}
            </p>
          </div>
        </div>

        {/* HUMAN-CENTRIC SAVINGS CONTAINERS */}
        <div className="space-y-4">
          <h2 className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">PRIVATE SAVINGS VAULTS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {savingsBoxes.map((box) => {
              const progress = (box.current / box.target) * 100;
              return (
                <div key={box.id} className="bg-zinc-900/30 border border-purple-950/30 p-6 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-zinc-100 text-base">{box.name}</h3>
                    <span className="text-xs font-mono text-purple-400 font-bold bg-purple-950/40 px-2 py-0.5 rounded border border-purple-900/30">
                      {Math.round(progress)}% Filled
                    </span>
                  </div>

                  {/* Clean Horizontal Ambient Progress Indicator Bar */}
                  <div className="w-full bg-black/40 h-1.5 rounded-full overflow-hidden border border-purple-950/20">
                    <div className="bg-gradient-to-r from-purple-600 to-fuchsia-500 h-full transition-all duration-500" style={{ width: `${progress}%` }} />
                  </div>

                  <div className="flex justify-between font-mono text-xs text-zinc-400 pt-1">
                    <span>Balance: {isIncognito ? "•••" : `$${box.current}`}</span>
                    <span>Target: ${box.target}</span>
                  </div>

                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-zinc-500 font-bold">₦</span>
                      <input
                        type="number"
                        placeholder="Amount (Naira)"
                        value={depositAmounts[box.id] || ""}
                        onChange={(e) => setDepositAmounts({ ...depositAmounts, [box.id]: e.target.value })}
                        className="w-full bg-black/60 border border-purple-950/40 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none"
                      />
                    </div>
                    <button
                      onClick={() => handleDeposit(box.id)}
                      className="bg-purple-900/40 hover:bg-purple-700 text-purple-300 hover:text-white font-mono text-xs px-4 py-2 rounded-xl border border-purple-800/40 transition-all font-bold"
                    >
                      Deposit
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>
    </div>
  );
}
