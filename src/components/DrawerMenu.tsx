"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function DrawerMenu({ isOpen, onClose }: DrawerProps) {
  const { toggleIncognito, isIncognito, removeAccountFromDevice, createSavingsBox } = useApp();
  const [showBoxModal, setShowBoxModal] = useState(false);
  const [boxName, setBoxName] = useState("");
  const [boxTarget, setBoxTarget] = useState("");

  if (!isOpen) return null;

  const handleCreateBox = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boxName || !boxTarget) return;
    createSavingsBox(boxName, parseFloat(boxTarget));
    setBoxName("");
    setBoxTarget("");
    setShowBoxModal(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      {/* Dimmed backdrop background closure zone */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative w-72 max-w-sm bg-[#06020f] border-r border-purple-950/40 h-full p-6 flex flex-col justify-between shadow-2xl z-10">
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-purple-950/30 pb-4">
            <span className="font-mono text-xs text-purple-400 font-bold uppercase tracking-wider">System Control Menu</span>
            <button onClick={onClose} className="text-zinc-500 hover:text-white font-mono text-sm">[ Close ]</button>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => {
                toggleIncognito();
                onClose();
              }}
              className="w-full text-left font-mono text-xs py-3 px-4 rounded-xl border border-purple-950/30 bg-zinc-900/20 hover:border-purple-500/20 text-zinc-300 flex justify-between items-center"
            >
              <span>Balance Mask Mode</span>
              <span className={isIncognito ? "text-purple-400 font-bold" : "text-zinc-600"}>
                {isIncognito ? "SHIELDED" : "VISIBLE"}
              </span>
            </button>

            <button
              onClick={() => setShowBoxModal(true)}
              className="w-full text-left font-mono text-xs py-3 px-4 rounded-xl border border-purple-950/30 bg-zinc-900/20 hover:border-purple-500/20 text-zinc-300"
            >
              + Provision New Vault Box
            </button>
          </nav>
        </div>

        {/* ACCOUNT OBLITERATION DESTRUCT TRIGGER */}
        <div className="border-t border-purple-950/30 pt-4 space-y-2">
          <button
            onClick={() => {
              if(confirm("CRITICAL WARNING: This will destroy your local keys permanently from this screen memory. Are you absolutely certain?")) {
                removeAccountFromDevice();
              }
            }}
            className="w-full bg-red-950/20 border border-red-900/40 hover:bg-red-900/40 text-red-400 font-mono text-[11px] font-bold py-2.5 rounded-xl transition-all uppercase tracking-wider"
          >
            Wipe Account From Device
          </button>
        </div>
      </div>

      {/* NESTED INNER CREATION MODAL OVERLAY */}
      {showBoxModal && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 z-50">
          <div className="bg-zinc-900 border border-purple-950/40 w-full max-w-xs p-6 rounded-2xl space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold font-mono text-zinc-200 uppercase tracking-wider">New Vault Allocation</h3>
            <form onSubmit={handleCreateBox} className="space-y-3">
              <input
                type="text"
                required
                placeholder="Vault Target Purpose"
                value={boxName}
                onChange={(e) => setBoxName(e.target.value)}
                className="w-full bg-black/60 border border-purple-950/20 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none"
              />
              <input
                type="number"
                required
                placeholder="Target Limit (USD)"
                value={boxTarget}
                onChange={(e) => setBoxTarget(e.target.value)}
                className="w-full bg-black/60 border border-purple-950/20 rounded-xl px-3 py-2 text-xs font-mono text-zinc-200 focus:outline-none"
              />
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowBoxModal(false)}
                  className="w-1/2 border border-purple-950/20 text-zinc-500 font-mono text-[10px] py-2 rounded-xl"
                >
                  Abort
                </button>
                <button
                  type="submit"
                  className="w-1/2 bg-purple-700 text-white font-mono text-[10px] py-2 rounded-xl font-bold"
                >
                  Instantiate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
