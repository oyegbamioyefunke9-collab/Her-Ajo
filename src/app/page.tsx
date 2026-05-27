"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import SilhouetteTracker from "@/components/SilhouetteTracker";
import GlowStateBanner from "@/components/GlowStateBanner";
import IncognitoToggle from "@/components/IncognitoToggle";

export default function DashboardPage() {
  const router = useRouter();
  const { userKeys, savingsBoxes, isIncognito, simulateDeposit, createSavingsBox, logout } = useApp();
  
  // Local form tracking states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [boxName, setBoxName] = useState("");
  const [boxTarget, setBoxTarget] = useState("");
  const [boxProfile, setBoxProfile] = useState<"african" | "european" | "asian">("african");
  const [depositAmounts, setDepositAmounts] = useState<Record<string, string>>({});

  // Route protection loop: Redirect to sovereignty ritual if keys haven't been generated yet
  React.useEffect(() => {
    if (!userKeys) {
      router.push("/onboarding");
    }
  }, [userKeys, router]);

  if (!userKeys) return null;

  const handleCreateBox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boxName || !boxTarget) return;
    createSavingsBox(boxName, parseFloat(boxTarget), boxProfile);
    setBoxName("");
    setBoxTarget("");
    setShowCreateModal(false);
  };

  const handleDeposit = (boxId: string) => {
    const amount = depositAmounts[boxId];
    if (!amount || parseFloat(amount) <= 0) return;
    simulateDeposit(boxId, parseFloat(amount));
    setDepositAmounts({ ...depositAmounts, [boxId]: "" });
  };

  // Compute overall financial context summary metrics
  const totalSaved = savingsBoxes.reduce((acc, box) => acc + box.current, 0);
  const totalTarget = savingsBoxes.reduce((acc, box) => acc + box.target, 0);
  const aggregateProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8 font-sans selection:bg-pink-500/30">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(244,63,94,0.03),transparent_40%)] pointer-events-none" />
      
      <main className="max-w-6xl mx-auto space-y-6">
        
        {/* TOP BAR ACTION HUB */}
        <div className="flex items-center justify-between bg-zinc-900/40 border border-zinc-800/80 px-6 py-4 rounded-2xl backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-xs text-zinc-400 tracking-wider">LOCAL NODE ACTIVE // SHIELD_STABLE</span>
          </div>
          <div className="flex items-center gap-3">
            <IncognitoToggle />
            <button
              onClick={logout}
              className="border border-zinc-800 hover:border-red-900/50 text-zinc-500 hover:text-red-400 font-mono text-xs px-3 py-2 rounded-xl transition-all"
            >
              Wipe Device Keys
            </button>
          </div>
        </div>

        {/* GLOW STATE AFFIRMATION MATRIX */}
        <GlowStateBanner />

        {/* METRIC CARD STRINGS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl relative overflow-hidden">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Shielded Global Equity</p>
            <p className="text-3xl font-bold mt-2 font-mono tracking-tight text-zinc-100">
              {isIncognito ? "••••.••" : `$${totalSaved.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </p>
            <span className="text-[10px] text-zinc-400 font-mono block mt-1">Converted Stable USD eCash</span>
          </div>

          <div className="bg-zinc-900/60 border border-zinc-800 p-6 rounded-2xl">
            <p className="text-xs font-mono text-zinc-500 uppercase tracking-wider">Target Objective Pool</p>
            <p className="text-3xl font-bold mt-2 font-mono tracking-tight text-zinc-300">
              {isIncognito ? "••••.••" : `$${totalTarget.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            </p>
            <span className="text-[10px] text-pink-400 font-mono block mt-1 font-bold">{Math.round(aggregateProgress)}% Global Target Filled</span>
          </div>

          <div className="bg-gradient-to-br from-zinc-900 to-zinc-950 border border-zinc-800 p-6 rounded-2xl flex flex-col justify-between">
            <div>
              <p className="text-xs font-mono text-zinc-400 uppercase tracking-wider">Device Relay Link</p>
              <p className="text-xs font-mono text-pink-400/80 truncate mt-2 font-medium bg-zinc-950 p-2 rounded-lg border border-zinc-800">
                {userKeys.npub}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="mt-4 w-full bg-zinc-800 hover:bg-pink-600 hover:text-white text-zinc-200 text-xs font-mono font-bold py-2.5 rounded-xl transition-all border border-zinc-700 hover:border-pink-500/50 shadow-md"
            >
              + Provision New Vault Box
            </button>
          </div>
        </div>

        {/* VAULT SLOTS GRID LOOP */}
        <div className="space-y-4">
          <h2 className="text-sm font-mono uppercase tracking-widest text-zinc-400 font-bold">ACTIVE HER-AJO VAULTS</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {savingsBoxes.map((box) => {
              const boxProgress = box.target > 0 ? (box.current / box.target) * 100 : 0;
              return (
                <div 
                  key={box.id} 
                  className="bg-zinc-900/40 border border-zinc-800/80 p-5 rounded-3xl flex gap-6 items-center shadow-lg hover:border-zinc-700/60 transition-all duration-300 group"
                >
                  {/* Dynamic Silhouette Progressive Knockout */}
                  <SilhouetteTracker profile={box.profile} progress={boxProgress} />

                  {/* Vault Actions Interlocking Panel */}
                  <div className="flex-1 space-y-4">
                    <div>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-800 text-zinc-400 uppercase tracking-wider">
                        {box.profile} Profile Node
                      </span>
                      <h3 className="text-lg font-bold text-zinc-100 mt-1.5 tracking-tight group-hover:text-pink-400 transition-colors">
                        {box.name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2 bg-zinc-950/80 p-3 rounded-xl border border-zinc-800/60 font-mono text-xs">
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">Saved</span>
                        <span className="text-zinc-200 font-bold">
                          {isIncognito ? "•••" : `$${box.current.toFixed(2)}`}
                        </span>
                      </div>
                      <div>
                        <span className="text-zinc-500 block text-[10px] uppercase">Target</span>
                        <span className="text-zinc-400">
                          {isIncognito ? "•••" : `$${box.target.toFixed(2)}`}
                        </span>
                      </div>
                    </div>

                    {/* Manual Local Fiat Injection Simulator */}
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 font-mono text-xs text-zinc-500 font-bold">₦</span>
                        <input
                          type="number"
                          placeholder="Amount (Naira)"
                          value={depositAmounts[box.id] || ""}
                          onChange={(e) => setDepositAmounts({ ...depositAmounts, [box.id]: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-7 pr-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none focus:border-pink-500/50"
                        />
                      </div>
                      <button
                        onClick={() => handleDeposit(box.id)}
                        className="bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-mono text-xs px-3 py-2 rounded-xl border border-zinc-700 transition-all font-bold"
                      >
                        Deposit
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </main>

      {/* PROVISIONING INTERFACES OVERLAY MODAL */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-zinc-950/80 backdrop-blur-md flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-md p-6 rounded-3xl space-y-4 shadow-2xl relative">
            <h3 className="text-base font-bold font-mono tracking-tight text-zinc-100">Provision New Savings Node</h3>
            
            <form onSubmit={handleCreateBox} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">Vault Purpose Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g., Inventory Reserve"
                  value={boxName}
                  onChange={(e) => setBoxName(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">Target Balance (USD Value)</label>
                <input
                  type="number"
                  required
                  placeholder="e.g., 1000"
                  value={boxTarget}
                  onChange={(e) => setBoxTarget(e.target.value)}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-pink-500"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-mono uppercase text-zinc-400 block font-bold">Cultural Silhouette Variant Profile</label>
                <select
                  value={boxProfile}
                  onChange={(e) => setBoxProfile(e.target.value as "african" | "european" | "asian")}
                  className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2.5 text-xs font-mono text-zinc-300 focus:outline-none focus:border-pink-500"
                >
                  <option value="african">African Textured Crown Silhouette</option>
                  <option value="asian">Asian Geometric Sharp Bob Silhouette</option>
                  <option value="european">European Flowing Straight Silhouette</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="w-1/2 border border-zinc-800 text-zinc-400 font-mono text-xs py-2.5 rounded-xl hover:bg-zinc-800 transition-all"
                >
                  Abort Setup
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-pink-600 hover:bg-pink-500 text-white font-mono text-xs py-2.5 rounded-xl font-bold shadow-lg shadow-pink-600/20 transition-all"
                >
                  Instantiate Box
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
