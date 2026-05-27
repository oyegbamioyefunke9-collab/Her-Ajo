"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ isOpen, onClose }: DrawerProps) {
  const { 
    toggleIncognito, isIncognito, removeAccountFromDevice, createSavingsBox,
    activeQuote, updateCustomQuote, userName, userImage, updateProfileDetails 
  } = useApp();

  const [showBoxModal, setShowBoxModal] = useState(false);
  const [boxName, setBoxName] = useState("");
  const [boxTarget, setBoxTarget] = useState("");
  
  const [isEditingAffirmation, setIsEditingAffirmation] = useState(false);
  const [quoteInput, setQuoteInput] = useState(activeQuote);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(userName);

  if (!isOpen) return null;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      updateProfileDetails(userName, reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = () => {
    updateProfileDetails(nameInput, userImage);
    setIsEditingProfile(false);
  };

  const handleCreateBoxSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boxName || !boxTarget) return;
    createSavingsBox(boxName, parseFloat(boxTarget));
    setBoxName("");
    setBoxTarget("");
    setShowBoxModal(false);
    onClose();
  };

  const handleSaveAffirmation = () => {
    updateCustomQuote(quoteInput);
    setIsEditingAffirmation(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-80 max-w-xs bg-[#05010c] border-r border-purple-950/40 h-full p-6 flex flex-col justify-between shadow-2xl z-10 overflow-y-auto">
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-purple-950/20 pb-4">
            <span className="font-mono text-xs text-purple-400 font-bold uppercase tracking-wider">System Control</span>
            <button onClick={onClose} className="text-zinc-500 hover:text-white font-mono text-xs">[ Close ]</button>
          </div>

          {/* USER CUSTOMIZATION CONFIGURATION COMPONENT */}
          <div className="bg-zinc-900/30 p-4 rounded-xl border border-purple-950/20 space-y-3">
            <div className="flex items-center gap-3">
              <label className="relative cursor-pointer group shrink-0">
                {userImage ? (
                  <img src={userImage} alt="Avatar" className="w-12 h-12 rounded-full object-cover border border-purple-500/30" />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-purple-950/60 border border-purple-500/30 flex items-center justify-center text-purple-300 text-sm font-bold font-mono">
                    {userName.charAt(0)}
                  </div>
                )}
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[9px] font-bold">EDIT</div>
              </label>

              <div className="flex-1 min-w-0">
                {isEditingProfile ? (
                  <div className="space-y-1">
                    <input 
                      type="text" 
                      value={nameInput} 
                      onChange={(e) => setNameInput(e.target.value.toUpperCase())}
                      className="bg-black text-xs font-mono px-2 py-1 border border-purple-500/40 rounded w-full text-zinc-100" 
                    />
                    <button onClick={handleSaveProfile} className="text-[10px] font-mono text-purple-400 font-bold block">[ Save ]</button>
                  </div>
                ) : (
                  <div>
                    <h4 className="text-sm font-bold text-zinc-200 truncate">{userName}</h4>
                    <button onClick={() => setIsEditingProfile(true)} className="text-[10px] font-mono text-zinc-500 hover:text-purple-400">[ Change Name ]</button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* AFFIRMATION FOR HER CONTROL COMPONENT */}
          <div className="bg-zinc-900/20 p-4 rounded-xl border border-purple-950/20 space-y-2">
            <span className="text-[10px] font-mono uppercase text-purple-400 font-bold block tracking-wider">Affirmation for Her</span>
            {isEditingAffirmation ? (
              <div className="space-y-2">
                <textarea
                  value={quoteInput}
                  onChange={(e) => setQuoteInput(e.target.value)}
                  className="w-full bg-black border border-purple-500/30 rounded-lg p-2 text-xs font-sans text-zinc-200 h-16 focus:outline-none"
                />
                <button onClick={handleSaveAffirmation} className="w-full bg-purple-800 text-white font-mono text-[10px] py-1.5 rounded-lg font-bold">
                  Save Affirmation Loop
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-zinc-400 italic">"{activeQuote}"</p>
                <button onClick={() => setIsEditingAffirmation(true)} className="text-[10px] font-mono text-purple-500 font-bold">[ Rewrite Affirmation ]</button>
              </div>
            )}
          </div>

          {/* APPLICATION TRIGGER LAYER ACTIONS */}
          <nav className="space-y-2">
            <button
              onClick={() => { toggleIncognito(); onClose(); }}
              className="w-full text-left font-mono text-xs py-3 px-4 rounded-xl border border-purple-950/30 bg-zinc-900/20 text-zinc-300 flex justify-between items-center"
            >
              <span>Balance Privacy Mask</span>
              <span className={isIncognito ? "text-purple-400 font-bold" : "text-zinc-600"}>
                {isIncognito ? "HIDDEN" : "VISIBLE"}
              </span>
            </button>

            <button
              onClick={() => setShowBoxModal(true)}
              className="w-full text-left font-mono text-xs py-3 px-4 rounded-xl border border-purple-950/30 bg-zinc-900/20 text-zinc-300"
            >
              + Create Her-Ajo Account
            </button>
          </nav>
        </div>

        <div className="pt-4 border-t border-purple-950/20">
          <button
            onClick={() => {
              if (confirm("Permanently destroy your local master credentials on this hardware screen layout cache?")) {
                removeAccountFromDevice();
              }
            }}
            className="w-full bg-red-950/10 border border-red-900/30 text-red-400 font-mono text-[11px] font-bold py-2.5 rounded-xl uppercase tracking-wider"
          >
            Clear Account Data
          </button>
        </div>
      </div>

      {showBoxModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-purple-950/40 w-full max-w-xs p-6 rounded-2xl space-y-4 shadow-2xl">
            <h3 className="text-xs font-bold font-mono text-zinc-200 uppercase tracking-wider">New Her-Ajo Setup</h3>
            <form onSubmit={handleCreateBoxSubmit} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Account Purpose Name"
                value={boxName}
                onChange={(e) => setBoxName(e.target.value)}
                className="w-full bg-black/60 border border-purple-950/20 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none"
              />
              <input
                type="number"
                required
                placeholder="Target Limit Target ($)"
                value={boxTarget}
                onChange={(e) => setBoxTarget(e.target.value)}
                className="w-full bg-black/60 border border-purple-950/20 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none"
              />
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowBoxModal(false)} className="w-1/2 border border-purple-950/20 text-zinc-500 font-mono text-[10px] py-2 rounded-xl">Abort</button>
                <button type="submit" className="w-1/2 bg-purple-700 text-white font-mono text-[10px] py-2 rounded-xl font-bold">Instantiate</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
