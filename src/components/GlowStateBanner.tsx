"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

export default function GlowStateBanner() {
  const { activeQuote, updateCustomQuote } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [textInput, setTextInput] = useState(activeQuote);

  const handleSave = () => {
    updateCustomQuote(textInput);
    setIsEditing(false);
  };

  return (
    <div className="w-full bg-gradient-to-r from-zinc-900/40 via-zinc-900/20 to-purple-950/10 border border-purple-500/10 p-6 rounded-2xl relative overflow-hidden">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 flex-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-400 font-bold block">
            Active Vault Affirmation Loop
          </span>
          {isEditing ? (
            <div className="flex items-center gap-2 mt-2 w-full">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="bg-black/80 border border-purple-500/30 rounded-xl px-3 py-2 text-sm text-zinc-100 focus:outline-none w-full font-sans"
              />
              <button 
                onClick={handleSave}
                className="bg-purple-700 hover:bg-purple-600 text-white font-mono text-xs px-3 py-2.5 rounded-xl font-bold shrink-0"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-base font-medium text-zinc-300 italic font-sans leading-relaxed">
              "{activeQuote}"
            </p>
          )}
        </div>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="border border-purple-950/60 hover:border-purple-500/30 text-zinc-500 hover:text-purple-400 font-mono text-[11px] px-3 py-1.5 rounded-lg transition-all"
          >
            Modify Text
          </button>
        )}
      </div>
    </div>
  );
}
