"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import DrawerMenu from "@/components/DrawerMenu";
import SilhouetteAvatar from "@/components/SilhouetteAvatar";
import DecoratedName from "@/components/DecoratedName";

export default function AppEngine() {
  const { 
    userKeys, hasDeviceAccount, isUnlocked, isGlowActive, currentAffirmation, circles, ledger, notifications, activeTab, isIncognito, userName, hairStyle, nameDecoration, kycVerified, bvnMock, streakCount, totalSavedThisMonth,
    setActiveTab, registerAccount, unlockSession, lockSession, setKycVerified, setBvnMock, createNewCircle, joinCircleByCode, executeContribution, clearNotifications
  } = useApp();

  // Navigation states
  const [pinInput, setPinInput] = useState("");
  const [setupStep, setSetupStep] = useState<"landing" | "keys" | "pin">("landing");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const [showSuccessConfetti, setShowSuccessConfetti] = useState(false);

  // Form modals state variables
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [showDepositModal, setShowDepositModal] = useState<string | null>(null);

  // Form Fields Inputs
  const [cName, setCName] = useState("");
  const [cPurpose, setCPurpose] = useState("");
  const [cAmt, setCAmt] = useState("");
  const [cDur, setCDur] = useState<"weekly" | "monthly">("weekly");
  const [cInflation, setCInflation] = useState(true);
  const [joinCodeIn, setJoinCodeIn] = useState("");
  const [fiatPayInput, setFiatPayInput] = useState("");
  const [isProcessingPay, setIsProcessingPay] = useState(false);

  const rawMnemonic = "wisdom anchor flame genuine vivid cluster dynamic orphan hybrid visual adjust forward";

  // Calculations
  const globalUSD = circles.reduce((acc, c) => acc + c.current, 0);
  const globalNGN = Math.round(globalUSD * 1370);

  const handleDepositSubmit = (e: React.FormEvent, circleId: string, isRegularOnly: boolean) => {
    e.preventDefault();
    if (!fiatPayInput || parseFloat(fiatPayInput) <= 0) return;
    setIsProcessingPay(true);

    // Paystack/Flutterwave Test Mode Payment Sandbox Timer Loop
    setTimeout(() => {
      setIsProcessingPay(false);
      executeContribution(circleId, parseFloat(fiatPayInput) / 1370);
      setFiatPayInput("");
      setShowDepositModal(null);
      setShowSuccessConfetti(true);
      setTimeout(() => setShowSuccessConfetti(false), 3000);
    }, 1200);
  };

  const triggerAjoContributionPay = (circleId: string) => {
    executeContribution(circleId);
    setShowSuccessConfetti(true);
    setTimeout(() => setShowSuccessConfetti(false), 3000);
  };

  if (isGlowActive) {
    return (
      <div className="fixed inset-0 bg-[#020006] flex flex-col items-center justify-center p-6 z-50">
        <div className="absolute w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] animate-pulse" />
        <div className="max-w-md text-center space-y-6 relative z-10">
          <SilhouetteAvatar style={hairStyle} className="w-14 h-14 mx-auto" />
          <p className="text-xl font-serif italic text-purple-100 text-neon-glow leading-relaxed">"{currentAffirmation}"</p>
          <p className="text-[10px] font-mono tracking-widest text-purple-500 uppercase animate-pulse">Synchronizing Solana Radar Security Nodes...</p>
        </div>
      </div>
    );
  }

  if (!hasDeviceAccount) {
    return (
      <div className="min-h-screen bg-[#030008] text-zinc-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-zinc-900/30 border border-purple-950/40 p-8 rounded-3xl shadow-neon-purple space-y-6">
          {setupStep === "landing" && (
            <div className="space-y-5 text-center">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-purple-300 bg-clip-text text-transparent tracking-tight">Her-Ajo</h1>
              <p className="text-xs font-mono tracking-widest text-purple-400 uppercase">Solana Radar 2026 Engine</p>
              <p className="text-sm text-zinc-400 leading-relaxed">Rotating cooperative credit shielding and automated stablecoin protection designed exclusively for high-inflation markets.</p>
              <button onClick={() => setSetupStep("keys")} className="w-full bg-purple-800 hover:bg-purple-700 font-mono text-xs font-bold py-3.5 rounded-xl transition-all">Instantiate Secure Vault</button>
            </div>
          )}
          {setupStep === "keys" && (
            <div className="space-y-4">
              <div className="text-center">
                <h2 className="text-sm font-mono uppercase text-purple-400 font-bold">Your Backup Cryptographic Phrase</h2>
                <p className="text-xs text-zinc-500 mt-1">Copy down these words physically. No logs exist on network rows.</p>
              </div>
              <div className="bg-black/60 border border-purple-950/50 rounded-xl p-4 font-mono text-xs grid grid-cols-2 gap-2 text-zinc-300 select-all">
                {rawMnemonic.split(" ").map((w, i) => (
                  <div key={i} className="flex gap-2"><span className="text-purple-500">{i+1}.</span><span>{w}</span></div>
                ))}
              </div>
              <button onClick={() => setSetupStep("pin")} className="w-full bg-purple-800 hover:bg-purple-700 font-mono text-xs font-bold py-3.5 rounded-xl transition-all">My Credentials Are Protected</button>
            </div>
          )}
          {setupStep === "pin" && (
            <form onSubmit={(e) => { e.preventDefault(); if (pinInput.length >= 4) registerAccount({ mnemonic: rawMnemonic, npub: "npub1..." }, pinInput); }} className="space-y-4">
              <div className="text-center"><h2 className="text-sm font-mono uppercase text-purple-400 font-bold">Set App Entry Pin</h2></div>
              <input type="password" maxLength={6} placeholder="••••" value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))} className="w-full bg-black border border-purple-500/30 rounded-xl py-3 text-center tracking-[0.5em] font-mono text-lg text-purple-300 focus:outline-none" />
              <button type="submit" className="w-full bg-purple-800 hover:bg-purple-700 font-mono text-xs font-bold py-3.5 rounded-xl transition-all">Activate Hardware Vault</button>
            </form>
          )}
        </div>
      </div>
    );
  }

  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#030008] text-zinc-100 flex items-center justify-center p-4">
        <form onSubmit={(e) => { e.preventDefault(); unlockSession(pinInput); }} className="w-full max-w-sm bg-zinc-900/40 border border-purple-950/40 p-8 rounded-3xl text-center space-y-4 shadow-neon-purple">
          <h1 className="text-md font-bold text-zinc-200 uppercase tracking-wider">Vault Locked</h1>
          <input type="password" maxLength={6} placeholder="••••" value={pinInput} onChange={(e) => setPinInput(e.target.value.replace(/\D/g, ""))} className="w-full bg-black border border-purple-500/30 rounded-xl py-3 text-center tracking-[0.6em] font-mono text-xl text-purple-400 focus:outline-none" />
          <button type="submit" className="w-full bg-purple-800 text-white font-mono text-xs py-3 rounded-xl font-bold">Authorize Entry</button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030008] text-zinc-200 font-sans pb-24 relative overflow-x-hidden">
      <DrawerMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />

      {/* CONFETTI SUCCESS POP OVER LAYERS */}
      {showSuccessConfetti && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 bg-purple-900 border border-purple-500 text-white px-6 py-3 rounded-full shadow-2xl z-50 font-mono text-xs tracking-wider animate-bounce flex items-center gap-2">
          ✨ TRANSACTION CONFIRMED ON SOLANA LEDGER ✨
        </div>
      )}

      {/* FIXED COHESIVE SYSTEM CORRIDOR HEADER */}
      <header className="max-w-md mx-auto px-4 pt-6 flex items-center justify-between relative z-30">
        <button onClick={() => setIsMenuOpen(true)} className="flex items-center gap-3 text-left focus:outline-none">
          <SilhouetteAvatar style={hairStyle} className="w-9 h-9" />
          <div>
            <span className="text-[10px] font-mono text-purple-500/80 block uppercase tracking-tight">Active Safe</span>
            <div className="text-xs text-zinc-100 font-bold"><DecoratedName name={userName} decoration={nameDecoration} /></div>
          </div>
        </button>

        <div className="flex items-center gap-2 relative">
          <button onClick={() => setShowNotifDropdown(!showNotifDropdown)} className="p-2.5 bg-zinc-900/40 border border-purple-950/30 rounded-xl text-zinc-400 hover:text-purple-400 transition-colors relative">
            🔔 {notifications.length > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-purple-500 rounded-full" />}
          </button>
          
          {showNotifDropdown && (
            <div className="absolute right-0 top-12 w-64 bg-[#0a0418] border border-purple-950/60 p-3 rounded-xl shadow-2xl space-y-2 text-xs z-50">
              <div className="flex justify-between items-center border-b border-purple-950/20 pb-1.5"><span className="font-mono text-[10px] text-purple-400 font-bold">REMINDERS</span><button onClick={clearNotifications} className="text-[9px] text-zinc-500">[ Clear ]</button></div>
              {notifications.length === 0 ? <p className="text-zinc-600 text-[11px] py-1">No alerts active.</p> : notifications.map(n => (
                <div key={n.id} className="border-b border-purple-950/10 pb-1.5 last:border-0 pt-1"><p className="text-zinc-300 text-[11px] leading-tight">{n.text}</p><span className="text-[9px] text-purple-500 font-mono block mt-0.5">{n.time}</span></div>
              ))}
            </div>
          )}

          <button onClick={lockSession} className="p-2.5 bg-zinc-900/20 border border-purple-950/10 font-mono text-[11px] text-zinc-500 rounded-xl hover:text-purple-400">Lock</button>
        </div>
      </header>

      {/* CORE VIEWPORT CONTENT SWITCHER SYSTEM ROW */}
      <main className="max-w-md mx-auto px-4 mt-6">
        
        {/* TAB 1: DASHBOARD LANDING SCREEN */}
        {activeTab === "home" && (
          <div className="space-y-6">
            
            {/* COMPACT ANALYTICAL METRIC ROW GRID */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-zinc-900/30 border border-purple-950/20 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Streak Counter</span>
                <span className="text-xl font-bold font-mono text-purple-400 mt-1">🔥 {streakCount} Rounds</span>
              </div>
              <div className="bg-zinc-900/30 border border-purple-950/20 p-4 rounded-2xl flex flex-col justify-between">
                <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-wider block">Saved This Month</span>
                <span className="text-xl font-bold font-mono text-emerald-400 mt-1">${totalSavedThisMonth} USD</span>
              </div>
            </div>

            {/* HIGH-CONTRAST BALANCES LAYER WRAPPER SCREEN BOX */}
            <div className="bg-gradient-to-br from-[#1b0a32] to-[#0d031a] text-white p-6 rounded-3xl border border-purple-500/20 shadow-neon-purple relative overflow-hidden">
              <div className="flex justify-between items-center opacity-80 text-[10px] font-mono tracking-widest text-purple-300">
                <span>SHIELDED COLLATERAL BALANCE</span>
                <span className="bg-purple-950/50 px-2 py-0.5 rounded border border-purple-900/20 text-[9px]">SOLANA NETWORK</span>
              </div>
              <div className="mt-3 text-3xl font-bold font-mono text-purple-100 text-neon-glow">
                {isIncognito ? "••••.••" : `₦${globalNGN.toLocaleString()}`}
              </div>
              <div className="mt-1 text-xs font-mono text-purple-400/70">
                {isIncognito ? "Equivalent: $••••.••" : `Equivalent: $${globalUSD.toFixed(2)} USD`}
              </div>
            </div>

            {/* HACKATHON DIRECT ACTION FLOW INTERFACE BUTTONS */}
            <div className="bg-[#090314] border border-purple-950/40 p-4 rounded-2xl space-y-3">
              <p className="text-xs font-mono text-zinc-400 text-center uppercase tracking-widest border-b border-purple-950/20 pb-2">Solana Radar Core Ajo Interface</p>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setShowCreateModal(true)} className="bg-purple-800 hover:bg-purple-700 text-white font-mono text-xs py-3 rounded-xl font-bold transition-all shadow-md">
                  🚀 Create Circle
                </button>
                <button onClick={() => setShowJoinModal(true)} className="bg-zinc-900 border border-purple-500/30 text-purple-300 hover:text-white font-mono text-xs py-3 rounded-xl font-bold transition-all">
                  🤝 Join Group Code
                </button>
              </div>
            </div>

            {/* EXPEDITED ACTIVE CIRCLES ROW SUMMARY TILES */}
            <div className="space-y-3">
              <div className="flex justify-between items-center"><h2 className="text-xs font-mono uppercase tracking-widest text-purple-400 font-bold">MONITORED ROTATION CIRCLES</h2></div>
              {circles.map(c => (
                <div key={c.id} className="bg-zinc-900/20 border border-purple-950/30 p-4 rounded-2xl space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-zinc-100 text-sm">{c.name}</h3>
                      <p className="text-[11px] text-zinc-500 italic mt-0.5">{c.purpose}</p>
                    </div>
                    <span className={`text-[9px] font-mono font-bold uppercase px-2 py-0.5 rounded border ${c.isInflationProof ? 'bg-purple-950/50 border-purple-500 text-purple-300' : 'bg-zinc-900 border-zinc-800 text-zinc-500'}`}>
                      {c.isInflationProof ? "🛡️ Inflation Shielded" : "Regular Cash"}
                    </span>
                  </div>

                  <div className="flex justify-between items-center text-[11px] font-mono text-zinc-400 bg-black/40 p-2 rounded-xl">
                    <div><span className="text-zinc-500 block text-[9px]">NEXT BENEFICIARY</span><span className="text-purple-400 font-bold">{c.rotationOrder[c.currentRecipientIndex]}</span></div>
                    <div className="text-right">
                      <span className="text-zinc-500 block text-[9px]">ROUND CONTRIBUTION</span>
                      <span>{isIncognito ? "•••" : `₦${(c.contributionAmount * 1370).toLocaleString()} ($${c.contributionAmount})`}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button onClick={() => triggerAjoContributionPay(c.id)} disabled={c.hasPaidThisRound.includes(userName)} className={`flex-1 font-mono text-xs py-2 rounded-xl border transition-all font-bold ${c.hasPaidThisRound.includes(userName) ? 'bg-zinc-900/50 border-zinc-900 text-zinc-600 cursor-not-allowed' : 'bg-purple-900/40 border-purple-800/40 text-purple-200 hover:bg-purple-800'}`}>
                      {c.hasPaidThisRound.includes(userName) ? "✓ Paid This Turn" : "⚡ Pay Round Contribution"}
                    </button>
                    <button onClick={() => setShowDepositModal(c.id)} className="bg-zinc-900/60 border border-purple-950/30 hover:border-purple-800 text-zinc-300 text-xs font-mono px-3 rounded-xl transition-all">
                      Regular Vault In/Out
                    </button>
                  </div>
                </div>
              ))}
            </div>

          </div>
        )}

        {/* TAB 2: DETAILED COOPERATIVE CIRCLES HUB VIEW */}
        {activeTab === "circles" && (
          <div className="space-y-4 animate-fade-in">
            <div className="flex justify-between items-center border-b border-purple-950/20 pb-2"><h2 className="text-sm font-mono text-purple-400 font-bold uppercase tracking-wider">COLLABORATIVE ROTATION SYSTEM HUB</h2></div>
            {circles.map(c => {
              const progPercent = (c.current / c.target) * 100;
              return (
                <div key={c.id} className="bg-[#070312] border border-purple-950/40 p-5 rounded-2xl space-y-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-md font-bold text-white tracking-tight">{c.name}</h3>
                      <span className="text-[10px] font-mono text-zinc-500 block mt-0.5">Invite Token: <strong className="text-purple-400 select-all font-mono">{c.inviteCode}</strong></span>
                    </div>
                    <button onClick={() => { navigator.clipboard.writeText(`https://herajo.app/join?code=${c.inviteCode}`); alert("WhatsApp shareable invite string token saved safely to device cache layout!"); }} className="text-[10px] font-mono bg-purple-950/30 border border-purple-900/20 text-purple-300 px-2 py-1 rounded hover:bg-purple-900">
                      🟢 WhatsApp Share Link
                    </button>
                  </div>

                  <div className="space-y-1">
                    <div className="w-full bg-black h-1.5 rounded-full overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-600 to-fuchsia-500 h-full transition-all duration-300" style={{ width: `${Math.min(progPercent, 100)}%` }} />
                    </div>
                    <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                      <span>Total Isolated: ${c.current}</span>
                      <span>Target Pool Limit: ${c.target}</span>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-mono text-purple-400 uppercase tracking-widest block font-bold">Rotation Order Circle Chain</span>
                    <div className="flex flex-wrap gap-1.5">
                      {c.rotationOrder.map((m, idx) => {
                        const isCurrentRecip = idx === c.currentRecipientIndex;
                        const hasPaid = c.hasPaidThisRound.includes(m);
                        return (
                          <div key={idx} className={`text-[11px] font-mono px-2.5 py-1 rounded-lg border flex items-center gap-1.5 ${isCurrentRecip ? 'bg-purple-950 border-purple-500 text-purple-200 font-bold' : 'bg-black/40 border-purple-950/20 text-zinc-500'}`}>
                            <span>{idx + 1}. {m}</span>
                            {isCurrentRecip && <span className="text-[9px] bg-purple-800 px-1 rounded text-white text-[8px]">🎯 Recipient</span>}
                            {hasPaid && <span className="text-emerald-400 text-[10px]">●</span>}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* TAB 3: TRANSPARENT BLOCKCHAIN TRANSACTION HISTORY LEDGER */}
        {activeTab === "history" && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1 border-b border-purple-950/20 pb-2">
              <h2 className="text-sm font-mono text-purple-400 font-bold uppercase tracking-wider">TRANSPARENT SOLANA AUDIT LEDGER</h2>
              <p className="text-[11px] text-zinc-500 leading-tight">Every transaction log maps directly onto an immutable shared cryptographic row framework simulation.</p>
            </div>
            <div className="space-y-2">
              {ledger.map(l => (
                <div key={l.id} className="bg-black/40 border border-purple-950/20 p-3.5 rounded-xl flex justify-between items-center text-xs font-mono">
                  <div className="space-y-0.5">
                    <span className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded ${l.type === 'Contribution' ? 'bg-purple-950 text-purple-400' : 'bg-zinc-900 text-zinc-400'}`}>{l.type}</span>
                    <p className="text-zinc-200 font-bold pt-1">{l.circleName}</p>
                    <span className="text-zinc-500 text-[10px] block">{l.date} • Actor: {l.user}</span>
                  </div>
                  <div className="text-right space-y-1">
                    <span className="text-sm font-bold text-zinc-100 block">${l.amount}</span>
                    <span className="text-[9px] text-purple-500/70 block select-all bg-purple-950/20 px-1 rounded">{l.txSignature}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: SYSTEM USER PROFILE SETUP AND KYC INTERACTION SCREEN */}
        {activeTab === "profile" && (
          <div className="space-y-5 animate-fade-in">
            <div className="bg-zinc-900/30 border border-purple-950/20 p-6 rounded-2xl text-center space-y-4">
              <SilhouetteAvatar style={hairStyle} className="w-16 h-16 mx-auto" />
              <div>
                <h2 className="text-md font-bold text-white"><DecoratedName name={userName} decoration={nameDecoration} /></h2>
                <p className="text-xs font-mono text-purple-500/70 mt-0.5">Hardware Safe Address Verified</p>
              </div>
            </div>

            {/* MOCK REGULATORY INTEGRATION BLOCK */}
            <div className="bg-black/40 border border-purple-950/30 p-5 rounded-2xl space-y-4">
              <div className="space-y-1">
                <h3 className="text-xs font-mono uppercase text-purple-400 font-bold tracking-wider">Regulatory Identity Safe Check (KYC)</h3>
                <p className="text-[11px] text-zinc-500">Provide local BVN/NIN variables to authenticate legal limits mapping simulations.</p>
              </div>

              {kycVerified ? (
                <div className="bg-purple-950/30 border border-purple-500/30 p-3 rounded-xl text-center font-mono text-xs text-purple-300">
                  ✓ NATIONAL STANDARDS COMPLIANCE TOKEN ACTIVE ({bvnMock.slice(0,4)}••••)
                </div>
              ) : (
                <div className="space-y-2">
                  <input type="text" maxLength={11} placeholder="Enter 11-Digit BVN/NIN Placeholder..." value={bvnMock} onChange={(e) => setBvnMock(e.target.value.replace(/\D/g, ""))} className="w-full bg-black border border-purple-950/40 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-purple-500" />
                  <button type="button" onClick={() => { if (bvnMock.length >= 10) setKycVerified(true); }} className="w-full bg-purple-800 text-white font-mono text-xs py-2 rounded-xl font-bold">Simulate Verification Check</button>
                </div>
              )}
            </div>
          </div>
        )}

      </main>

      {/* POPUP FORMS CONTAINER PORTALS ROWS */}
      {/* 1. SETUP MODAL FOR ACTION EXECUTOR WIZARD */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <form onSubmit={(e) => { e.preventDefault(); if (cName && cAmt) { createNewCircle(cName, cPurpose, parseFloat(cAmt), cDur, cInflation); setCName(""); setCPurpose(""); setCAmt(""); setShowCreateModal(false); } }} className="bg-zinc-900 border border-purple-950/50 w-full max-w-xs p-5 rounded-2xl space-y-3 shadow-2xl animate-fade-in">
            <h3 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">Create Rotating Circle</h3>
            <input type="text" required placeholder="Circle Name (e.g. Market Trade)" value={cName} onChange={(e) => setCName(e.target.value)} className="w-full bg-black border border-purple-950/20 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none" />
            <input type="text" placeholder="Saving Purpose (e.g. Inventory)" value={cPurpose} onChange={(e) => setCPurpose(e.target.value)} className="w-full bg-black border border-purple-950/20 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none" />
            <input type="number" required placeholder="Round Amount Contribution ($)" value={cAmt} onChange={(e) => setCAmt(e.target.value)} className="w-full bg-black border border-purple-950/20 rounded-lg px-3 py-1.5 text-xs font-mono text-white focus:outline-none" />
            
            <div className="flex gap-2 text-[11px] font-mono">
              <button type="button" onClick={() => setCDur("weekly")} className={`flex-1 py-1 rounded border ${cDur === 'weekly' ? 'border-purple-500 text-purple-300' : 'border-zinc-800 text-zinc-600'}`}>Weekly</button>
              <button type="button" onClick={() => setCDur("monthly")} className={`flex-1 py-1 rounded border ${cDur === 'monthly' ? 'border-purple-500 text-purple-300' : 'border-zinc-800 text-zinc-600'}`}>Monthly</button>
            </div>

            {/* HIGH VALUE SUB-CONCEPT INFLATION PROOF TOGGLE ELEMENT */}
            <div className="bg-black/40 p-3 rounded-xl border border-purple-950/20 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-mono text-purple-400 block font-bold uppercase">Solana Inflation Shield</span>
                <p className="text-[9px] text-zinc-500 leading-none mt-0.5">Auto-convert to USDC stablecoin</p>
              </div>
              <button type="button" onClick={() => setCInflation(!cInflation)} className={`w-9 h-5 rounded-full p-0.5 transition-colors ${cInflation ? 'bg-purple-600' : 'bg-zinc-800'}`}><div className={`w-4 h-4 bg-white rounded-full transition-transform ${cInflation ? 'translate-x-4' : 'translate-x-0'}`} /></button>
            </div>

            <div className="flex gap-2 pt-1">
              <button type="button" onClick={() => setShowCreateModal(false)} className="w-1/2 border border-purple-950/30 font-mono text-[10px] py-2 rounded-xl text-zinc-500">Abort</button>
              <button type="submit" className="w-1/2 bg-purple-800 text-white font-mono text-[10px] py-2 rounded-xl font-bold">Instantiate</button>
            </div>
          </form>
        </div>
      )}

      {/* 2. JOIN EXISTING COOPERATIVE CIRCLE MODAL */}
      {showJoinModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-purple-950/50 w-full max-w-xs p-5 rounded-2xl space-y-3 shadow-2xl animate-fade-in">
            <h3 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">Connect Ajo Circle Code</h3>
            <input type="text" placeholder="e.g. RADAR-MARKET" value={joinCodeIn} onChange={(e) => setJoinCodeIn(e.target.value)} className="w-full bg-black border border-purple-950/20 rounded-lg px-3 py-2 text-xs font-mono text-zinc-200 uppercase tracking-widest focus:outline-none" />
            <div className="flex gap-2">
              <button type="button" onClick={() => setShowJoinModal(false)} className="w-1/2 border border-purple-950/30 font-mono text-[10px] py-2 rounded-xl text-zinc-500">Abort</button>
              <button type="button" onClick={() => { if (joinCircleByCode(joinCodeIn)) { setJoinCodeIn(""); setShowJoinModal(false); } }} className="w-1/2 bg-purple-800 text-white font-mono text-[10px] py-2 rounded-xl font-bold">Connect</button>
            </div>
          </div>
        </div>
      )}

      {/* 3. PAYSTACK/FLUTTERWAVE TEST MODE SANDBOX COMPONENT INLINE WINDOW */}
      {showDepositModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <form onSubmit={(e) => handleDepositSubmit(e, showDepositModal, true)} className="bg-zinc-900 border border-purple-950/50 w-full max-w-xs p-5 rounded-2xl space-y-4 shadow-2xl">
            <div className="space-y-1">
              <h3 className="text-xs font-bold font-mono text-purple-400 uppercase tracking-wider">Fiat Deposit Gateway</h3>
              <p className="text-[10px] text-zinc-500">Simulate direct card / bank row acquisition via Paystack sandbox protocol layers.</p>
            </div>
            
            <div className="space-y-2">
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-mono text-zinc-500 font-bold">₦</span>
                <input type="number" required placeholder="Amount in Naira" value={fiatPayInput} onChange={(e) => setFiatPayInput(e.target.value)} className="w-full bg-black border border-purple-950/20 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-white focus:outline-none" />
              </div>
              <p className="text-[10px] font-mono text-zinc-500 text-right">Estimated Yield: ${(parseFloat(fiatPayInput || "0") / 1370).toFixed(2)} USD</p>
            </div>

            <div className="flex gap-2">
              <button type="button" onClick={() => setShowDepositModal(null)} className="w-1/2 border border-purple-950/30 font-mono text-[10px] py-2 rounded-xl text-zinc-500">Abort</button>
              <button type="submit" disabled={isProcessingPay} className="w-1/2 bg-purple-800 text-white font-mono text-[10px] py-2 rounded-xl font-bold tracking-wide">
                {isProcessingPay ? "Processing Sandbox..." : "💳 Pay via Paystack"}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* FIXED BASE NAVIGATION ENGINE MATRIX */}
      <footer className="fixed bottom-0 left-0 right-0 bg-[#04010a]/90 backdrop-blur-md border-t border-purple-950/40 py-2.5 z-40">
        <div className="max-w-md mx-auto px-6 flex justify-between items-center text-center">
          {[
            { id: "home", label: "Dashboard", icon: "💎" },
            { id: "circles", label: "Circles", icon: "🔄" },
            { id: "history", label: "Ledger", icon: "📜" },
            { id: "profile", label: "Identity", icon: "👤" }
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id as any)} className={`flex flex-col items-center flex-1 focus:outline-none ${activeTab === tab.id ? 'text-purple-400 font-bold' : 'text-zinc-600'}`}>
              <span className="text-lg">{tab.icon}</span>
              <span className="text-[10px] font-mono mt-0.5 tracking-tight block">{tab.label}</span>
            </button>
          ))}
        </div>
      </footer>

    </div>
  );
}
