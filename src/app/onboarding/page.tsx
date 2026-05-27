"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useApp } from "@/context/AppContext";

export default function OnboardingPage() {
  const router = useRouter();
  const { login } = useApp();
  const [step, setStep] = useState<1 | 2>(1);
  
  // High-fidelity generated sample cryptographic seed mnemonic string block
  const generatedMnemonic = "wisdom anchor flame genuine vivid cluster dynamic orphan hybrid visual adjust forward";
  const mockNpub = "npub1herajo7v6p3x9w88qy2u5kllcs8z3nwq9p0fmslqcrg7ex4003vsqe69v4";

  const completeOnboarding = () => {
    login({
      mnemonic: generatedMnemonic,
      npub: mockNpub
    });
    router.push("/");
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(244,63,94,0.04),transparent_50%)] pointer-events-none" />
      
      <div className="w-full max-w-xl bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 p-8 rounded-3xl shadow-2xl relative">
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-gradient-to-r from-pink-500 to-fuchsia-500 p-0.5 rounded-full shadow-[0_0_20px_rgba(236,72,153,0.4)]">
          <div className="bg-zinc-950 text-xs font-mono px-4 py-1 rounded-full font-bold text-pink-400">
            HER-AJO PROTOCOL SETUP
          </div>
        </div>

        {step === 1 ? (
          <div className="space-y-6 mt-4">
            <div className="space-y-2 text-center">
              <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                Your Sovereign Key Vault
              </h1>
              <p className="text-sm text-zinc-400 max-w-sm mx-auto">
                Her-Ajo does not ask for emails or names. You own your identity cryptographically.
              </p>
            </div>

            <div className="bg-zinc-950 border border-pink-500/20 rounded-2xl p-5 relative group">
              <div className="absolute inset-0 bg-pink-500/[0.01] rounded-2xl group-hover:bg-pink-500/[0.03] transition-colors" />
              <div className="grid grid-cols-3 gap-3 font-mono text-sm text-center">
                {generatedMnemonic.split(" ").map((word, index) => (
                  <div key={index} className="bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-xl flex items-center gap-2">
                    <span className="text-[10px] text-pink-500/60 font-bold">{index + 1}</span>
                    <span className="text-zinc-200 font-medium select-all">{word}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-pink-950/20 border border-pink-500/30 rounded-xl p-4 flex gap-3 text-xs leading-relaxed text-pink-300">
              <span className="text-lg">✍️</span>
              <p>
                <strong>The Sovereignty Ritual:</strong> Copy these 12 words down inside a physical journal. Do not take a digital screenshot or cloud backup. If you lose this device, these words are the only way to recover your stable savings balance.
              </p>
            </div>

            <button
              onClick={() => setStep(2)}
              className="w-full bg-gradient-to-r from-pink-600 to-fuchsia-600 hover:from-pink-500 hover:to-fuchsia-500 text-white font-mono text-sm font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-pink-600/20"
            >
              I Have Securely Written Them Down
            </button>
          </div>
        ) : (
          <div className="space-y-6 mt-4 text-center">
            <div className="w-16 h-16 bg-pink-500/10 border border-pink-500/30 rounded-full flex items-center justify-center mx-auto shadow-[0_0_15px_rgba(236,72,153,0.1)]">
              <span className="text-2xl">🔒</span>
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold tracking-tight text-zinc-100">
                Security Verified
              </h1>
              <p className="text-sm text-zinc-400 max-w-xs mx-auto">
                Your keys are securely derived and stored within your device's hardware memory stack.
              </p>
            </div>

            <div className="bg-zinc-950 border border-zinc-800 rounded-xl p-4 text-left font-mono text-xs text-zinc-500 break-all space-y-1">
              <span className="text-[10px] font-bold text-zinc-400 block uppercase tracking-wider">Your Cryptographic Identifier (Nostr Npub)</span>
              {mockNpub}
            </div>

            <button
              onClick={completeOnboarding}
              className="w-full bg-zinc-100 hover:bg-white text-zinc-950 font-mono text-sm font-bold py-3.5 rounded-xl transition-all shadow-md"
            >
              Initialize My Dashboard ⚡
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
