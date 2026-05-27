"use client";

import React, { useState, useEffect } from "react";
import { useApp } from "@/context/AppContext";

export default function GlowStateBanner() {
  const { activeQuote, updateCustomQuote } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [textInput, setTextInput] = useState(activeQuote);
  const [celebrationText, setCelebrationText] = useState<string | null>(null);

  useEffect(() => {
    // Quick runtime date matching (Simulating women's historical calendars)
    const today = new Date();
    const monthDay = `${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

    // Inside production, this reads cleanly from your src/data/womensCalendar.json
    const localCalendarMock: Record<string, string> = {
      "03-08": "International Women's Day 🌸",
      "03-10": "International Day of Women Judges ⚖️",
      "07-31": "Pan-African Women's Day 🌍",
      "05-27": "Empowerment Horizon Layer: Active ⚡" // Matches current development timestamp window
    };

    if (localCalendarMock[monthDay]) {
      setCelebrationText(`Today is ${localCalendarMock[monthDay]}. Stand tall.`);
    }
  }, []);

  const handleSave = () => {
    updateCustomQuote(textInput);
    setIsEditing(false);
  };

  return (
    <div className="w-full bg-gradient-to-r from-zinc-900 via-zinc-900 to-pink-950/20 border border-pink-500/10 p-6 rounded-2xl relative overflow-hidden shadow-[0_4px_30px_rgba(244,63,94,0.02)]">
      {/* Background radial soft ambient pink flare */}
      <div className="absolute -right-10 -top-10 w-44 h-44 bg-pink-500/5 rounded-full blur-3xl pointer-events-none" />
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 max-w-xl">
          <span className="text-[10px] font-mono uppercase tracking-widest text-pink-400 font-bold block">
            {celebrationText || "Sovereign Glow State"}
          </span>
          
          {isEditing ? (
            <div className="flex items-center gap-2 mt-1">
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                className="bg-zinc-950 border border-pink-500/40 rounded-lg px-3 py-1.5 text-sm text-zinc-100 focus:outline-none focus:ring-1 focus:ring-pink-500 w-full font-sans"
              />
              <button 
                onClick={handleSave}
                className="bg-pink-600 hover:bg-pink-500 text-white font-mono text-xs px-3 py-2 rounded-lg font-bold shadow-lg shadow-pink-600/20"
              >
                Save
              </button>
            </div>
          ) : (
            <p className="text-lg font-medium text-zinc-200 italic font-sans leading-relaxed">
              "{activeQuote}"
            </p>
          )}
        </div>

        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="self-start md:self-center border border-zinc-700 hover:border-pink-500/40 text-zinc-400 hover:text-pink-400 font-mono text-xs px-3 py-1.5 rounded-lg transition-all"
          >
            Edit Affirmation
          </button>
        )}
      </div>
    </div>
  );
}
