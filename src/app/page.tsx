"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";
import SilhouetteTracker from "@/components/SilhouetteTracker";
import GlowStateBanner from "@/components/GlowStateBanner";
import IncognitoToggle from "@/components/IncognitoToggle";

export default function Dashboard() {
  const router = useRouter();
  const { userKeys, savingsBoxes, isIncognito, simulateDeposit, logout } = useApp();
  const [nairaInput, setNairaInput] = useState<string>("");

  useEffect(() => {
    // If the user hasn't gone through onboarding, redirect them
    const storedKeys = localStorage.getItem("hj_keys");
    if (!storedKeys) {
      router.push("/onboarding");
    }
  }, [router]);

  if (!userKeys) return null;

  const handleDeposit = (boxId: string) => {
    const amount = parseFloat(nairaInput);
    if (!isNaN(amount) && amount > 0) {
      simulateDeposit(boxId, amount);
      setNairaInput("");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-zinc-800 pb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Her-Ajo <span className="text-pink-500">Vault</span>
            </h1>
            <p className="text-xs font-mono text-zinc-500 mt-1">
              NPUB: {userKeys.npub.slice(0, 12)}...{userKeys.npub.slice(-4)}
            </p>
          </div>
          <div className="flex items-center gap-4">
            <IncognitoToggle />
            <button 
              onClick={logout}
              className="text-xs font-mono text-zinc-500 hover:text-pink-400 transition-colors"
            >
              [ Disconnect ]
            </button>
          </div>
        </header>

        <GlowStateBanner />

        {/* Savings Boxes Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {savingsBoxes.map((box) => {
            const progress = (box.current / box.target) * 100;
            return (
              <div key={box.id} className="bg-zinc-900/50 border border-zinc-800 rounded-2xl p-6 flex flex-col md:flex-row items-center gap-6 shadow-xl">
                <SilhouetteTracker profile={box.profile} progress={progress} />
                
                <div className="flex-1 w-full space-y-4">
                  <div>
                    <h3 className="text-lg font-bold text-zinc-200">{box.name}</h3>
                    <div className="flex justify-between mt-2 font-mono text-sm">
                      <span className="text-zinc-500">Target:</span>
                      <span className={isIncognito ? "text-zinc-600 blur-sm" : "text-white"}>
                        ${box.target.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between mt-1 font-mono text-sm">
                      <span className="text-zinc-500">Saved:</span>
                      <span className={isIncognito ? "text-zinc-600 blur-sm" : "text-pink-400 font-bold"}>
                        ${box.current.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* Deposit Simulator */}
                  <div className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 flex gap-2">
                    <input
                      type="number"
                      placeholder="Amount in NGN"
                      value={nairaInput}
                      onChange={(e) => setNairaInput(e.target.value)}
                      className="bg-transparent w-full text-sm font-mono focus:outline-none text-zinc-200"
                    />
                    <button
                      onClick={() => handleDeposit(box.id)}
                      className="bg-zinc-800 hover:bg-pink-600 text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
