"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import DrawerMenu from "@/components/DrawerMenu";

export default function AppEngine() {
  const { 
    userKeys, hasDeviceAccount, isUnlocked, isGlowActive, activeQuote,
    savingsBoxes, isIncognito, simulateDeposit, registerAccount, unlockSession, 
    lockSession, removeAccountFromDevice, toggleIncognito, userName, userImage
  } = useApp();

  const [pinInput, setPinInput] = useState("");
  const [setupStep, setSetupStep] = useState<"landing" | "keys" | "pin">("landing");
  const [authError, setAuthError] = useState("");
  const [copied, setCopied] = useState(false);
  
  const [depositAmounts, setDepositAmounts] = useState<Record<string, string>>({});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const rawGeneratedMnemonic = "wisdom anchor flame genuine vivid cluster dynamic orphan hybrid visual adjust forward";
  const mockDerivedNpub = "npub1herajo7v6p3x9w88qy2u5kllcs8z3nwq9p0fmslqcrg7ex4003vsqe69v4";

  const handleCopyPhrase = async () => {
    try {
      await navigator.clipboard.writeText(rawGeneratedMnemonic);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy text", err);
    }
  };

  const handleVerifyUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (unlockSession(pinInput)) {
      setAuthError("");
      setPinInput("");
    } else {
      setAuthError("INVALID SECURE PIN METRIC");
      setPinInput("");
    }
  };

  const handleCompleteRegistration = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput.length < 4) return;
    registerAccount({ mnemonic: rawGeneratedMnemonic, npub: mockDerivedNpub }, pinInput);
    setPinInput("");
  };

  const handleDepositClick = (boxId: string) => {
    const val = depositAmounts[boxId];
    if (!val || parseFloat(val) <= 0) return;
    simulateDeposit(boxId, parseFloat(val));
    setDepositAmounts((prev) => ({ ...prev, [boxId]: "" }));
  };

  const totalUSD = savingsBoxes.reduce((acc, b) => acc + b.current, 0);
  const totalNGN = Math.round(totalUSD * 1370);

  // --- 1. HYPER-DRAMATIC GLOW SESSION RITUAL ---
  if (isGlowActive) {
    return (
      <div className="fixed inset-0 bg-[#020006] flex flex-col items-center justify-center p-6 z-50">
        <div className="absolute w-[600px] h-[600px] bg-purple-600 rounded-full animate-dramatic-pulse mix-blend-screen" />
        <div className="max-w-xl text-center space-y-8 relative px-4">
          <span className="text-[11px] font-mono tracking-[0.4em] text-purple-400 font-bold block animate-pulse">
            SHIELDED SUBSYSTEM INITIALIZED
          </span>
          <h2 className="text-3xl md:text-4xl font-serif italic text-purple-100 text-neon-glow font-medium leading-relaxed cubic-bezier(0.1, 1, 0.1, 1) animate-text-reveal">
            "{activeQuote}"
          </h2>
          <div className="h-[1px] w-24 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-6" />
        </div>
      </div>
    );
  }

  // --- 2. AUTHENTICATION & SEED RETRIEVAL ROUTER ---
  if (!hasDeviceAccount) {
    return (
      <div className="min-h-screen bg-[#03000a] text-zinc-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900/40 border border-purple-950/40 p-8 rounded-3xl shadow-neon-purple backdrop-blur-xl space-y-6">
          {setupStep === "landing" && (
            <div className="space-y-6 text-center">
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight text-white bg-gradient-to-r from-zinc-100 to-purple-300 bg-clip-text text-transparent">
                  Her-Ajo
                </h1>
                <p className="text-xs font-mono text-purple-400/70 uppercase tracking-widest">
                  Private Capital Protection
                </p>
              </div>
              <p className="text-sm text-zinc-400 leading-relaxed">
                An offline-first workspace for secure fiat isolation and balance shielding. Zero logs. Complete sovereignty.
              </p>
              <button
                onClick={() => setSetupStep("keys")}
                className="w-full bg-purple-700 hover:bg-purple-600 text-white font-mono text-sm font-bold py-3.5 rounded-xl transition-all"
              >
                Enter Her-Ajo
              </button>
            </div>
          )}

          {setupStep === "keys" && (
            <div className="space-y-5">
              <div className="text-center">
                <h2 className="text-lg font-bold text-zinc-200">Your Master Secret Key</h2>
                <p className="text-xs text-zinc-500 mt-1">Copy down these safety words physically.</p>
              </div>
              
              <div className="relative group">
                <div className="bg-black/60 border border-purple-900/30 rounded-xl p-4 font-mono text-xs grid grid-cols-2 gap-2 text-zinc-300 pr-12 select-all">
                  {rawGeneratedMnemonic.split(" ").map((word, i) => (
                    <div key={i} className="flex gap-2">
                      <span className="text-purple-500 font-bold">{i+1}.</span>
                      <span>{word}</span>
                    </div>
                  ))}
                </div>
                <button
                  onClick={handleCopyPhrase}
                  type="button"
                  className="absolute top-3 right-3 p-2 bg-purple-900/50 hover:bg-purple-800 rounded-lg text-white font-mono text-[10px] transition-all border border-purple-700/30 font-bold active:scale-95"
                >
                  {copied ? "COPIED" : "COPY"}
                </button>
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
                <h2 className="text-lg font-bold text-zinc-200">Set App PIN</h2>
                <p className="text-xs text-zinc-500">Used for session access checks.</p>
              </div>
              <input
                type="password"
                maxLength={6}
                placeholder="Enter Secure PIN"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
                className="w-full bg-black/60 border border-purple-500/30 rounded-xl py-3 text-center tracking-[0.5em] font-mono text-lg text-purple-300 focus:outline-none"
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

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#03000a] text-zinc-100 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-zinc-900/40 border border-purple-950/40 p-8 rounded-3xl shadow-neon-purple text-center space-y-6">
          <div>
            <h1 className="text-xl font-bold tracking-tight text-zinc-200">Session Guard</h1>
            <p className="text-xs text-zinc-500 mt-1">Provide your local verification PIN</p>
          </div>
          
          <form onSubmit={handleVerifyUnlock} className="space-y-4">
            <input
              type="password"
              maxLength={6}
              placeholder="••••"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))}
              className="w-full bg-black/60 border border-purple-500/30 rounded-xl py-3 text-center tracking-[0.6em] font-mono text-xl text-purple-400 focus:outline-none"
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
            className="text-[10px] font-mono text-zinc-600 hover:text-red-400 uppercase tracking-wider"
          >
            [ Wipe Local Profile Data ]
          </button>
        </div>
      </div>
    );
  }

  // --- 3. CORE SECURE RUNTIME VIEW LAYER ---
  return (
    <div className="min-h-screen bg-[#030008] text-zinc-200 font-sans pb-12">
      <DrawerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* CORE WALLET SYSTEM HEADER */}
      <header className="max-w-md mx-auto px-4 pt-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {userImage ? (
            <img src={userImage} alt="User Avatar" className="w-9 h-9 rounded-full object-cover border border-purple-500/30" />
          ) : (
            <div className="w-9 h-9 rounded-full bg-purple-950/60 border border-purple-500/30 flex items-center justify-center font-mono text-xs font-bold text-purple-300">
              {userName.charAt(0)}
            </div>
          )}
          <span className="text-sm font-bold text-zinc-100 tracking-tight">Hi, {userName}</span>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setIsMenuOpen(true)}
            className="p-2.5 bg-zinc-900/60 border border-purple-950/40 rounded-xl text-purple-400 font-mono text-xs font-bold"
          >
            ☰ Menu
          </button>
          <button 
            onClick={lockSession}
            className="p-2.5 bg-zinc-900/20 text-zinc-500 font-mono text-xs rounded-xl hover:text-purple-400"
          >
            Lock
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-5 space-y-6">
        
        {/* PREMIUM WALLET FLUID REPLICATED INTERFACE CARD */}
        <div className="bg-gradient-to-br from-[#00b074] to-[#009662] text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
          <div className="flex justify-between items-center opacity-90">
            <div className="flex items-center gap-2 text-xs font-medium tracking-wide">
              <span>Available Balance</span>
              <button onClick={toggleIncognito} type="button" className="p-1 hover:bg-white/10 rounded">
                👁️
              </button>
            </div>
            <span className="text-xs font-medium opacity-85">Transaction History &gt;</span>
          </div>

          <div className="mt-3 flex items-baseline gap-1.5">
            <span className="text-3xl font-bold tracking-tight">
              {isIncognito ? "••••.••" : `₦${totalNGN.toLocaleString()}`}
            </span>
          </div>
          
          <div className="mt-1 text-[11px] opacity-75 font-mono">
            {isIncognito ? "Equivalent: $••••.••" : `Equivalent: $${totalUSD.toFixed(2)} USD`}
          </div>
        </div>

        {/* CONTAINER ENTRIES GRID LAYER */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">HER-AJO ACCOUNTS</h2>
          </div>
          
          <div className="space-y-3">
            {savingsBoxes.map((box) => {
              const progress = box.target > 0 ? (box.current / box.target) * 100 : 0;
              return (
                <div key={box.id} className="bg-zinc-900/40 border border-purple-950/20 p-5 rounded-2xl space-y-3">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-zinc-100 text-sm tracking-tight">{box.name}</h3>
                    <span className="text-[10px] font-mono text-purple-300 font-bold bg-purple-950/50 px-2 py-0.5 rounded border border-purple-900/30">
                      {Math.round(progress)}% Complete
                    </span>
                  </div>

                  <div className="w-full bg-black/40 h-1 rounded-full overflow-hidden">
                    <div className="bg-gradient-to-r from-purple-600 to-emerald-500 h-full transition-all duration-500" style={{ width: `${Math.min(progress, 100)}%` }} />
                  </div>

                  <div className="flex justify-between font-mono text-[11px] text-zinc-400">
                    <span>Isolating: {isIncognito ? "•••" : `$${box.current.toFixed(2)}`}</span>
                    <span>Target Limit: ${box.target}</span>
                  </div>

                  <div className="flex gap-2 pt-1">
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-zinc-500 font-bold">₦</span>
                      <input
                        type="number"
                        placeholder="Deposit (Naira)"
                        value={depositAmounts[box.id] || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          setDepositAmounts((prev) => ({ ...prev, [box.id]: val }));
                        }}
                        className="w-full bg-black/50 border border-purple-950/40 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-purple-500"
                      />
                    </div>
                    <button
                      onClick={() => handleDepositClick(box.id)}
                      type="button"
                      className="bg-purple-900/60 hover:bg-purple-700 text-purple-200 hover:text-white font-mono text-xs px-4 py-2 rounded-xl border border-purple-800/40 transition-all font-bold"
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
