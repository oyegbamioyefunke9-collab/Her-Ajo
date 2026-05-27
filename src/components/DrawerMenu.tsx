"use client";

import React, { useState } from "react";
import { useApp } from "@/context/AppContext";
import SilhouetteAvatar from "@/components/SilhouetteAvatar";

export default function DrawerMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { toggleIncognito, isIncognito, removeAccountFromDevice, createNewCircle, joinCircleByCode, userName, hairStyle, nameDecoration, updateProfileDetails } = useApp();
  const [isEditing, setIsEditing] = useState(false);
  const [nameIn, setNameIn] = useState(userName);
  const [hairIn, setHairIn] = useState(hairStyle);
  const [decIn, setDecIn] = useState(nameDecoration);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-80 bg-[#06020f] border-r border-purple-950/50 h-full p-6 flex flex-col justify-between overflow-y-auto space-y-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-purple-950/20 pb-3">
            <span className="font-mono text-xs text-purple-400 font-bold uppercase tracking-wider">HER-AJO SHELL</span>
            <button onClick={onClose} className="text-zinc-500 font-mono text-xs">[ Close ]</button>
          </div>

          <div className="bg-zinc-900/30 p-4 rounded-xl border border-purple-950/20 space-y-3">
            <div className="flex items-center gap-3">
              <SilhouetteAvatar style={hairStyle} className="w-10 h-10" />
              <div className="flex-1">
                <p className="text-[11px] font-mono text-zinc-500 uppercase">Identity Profile</p>
                <p className="text-sm font-bold text-white">{userName}</p>
              </div>
              <button onClick={() => setIsEditing(!isEditing)} className="text-[10px] font-mono bg-purple-950/40 border border-purple-900/30 px-2 py-0.5 rounded text-purple-300">
                {isEditing ? "Hide" : "Modify"}
              </button>
            </div>

            {isEditing && (
              <div className="pt-3 border-t border-purple-950/10 space-y-2 text-xs">
                <input type="text" value={nameIn} onChange={(e) => setNameIn(e.target.value.toUpperCase())} className="w-full bg-black border border-purple-950/40 text-white font-mono px-2 py-1 rounded" />
                <div className="grid grid-cols-4 gap-1 text-[9px] text-center">
                  {["locs", "afro", "braids", "smooth"].map((h) => (
                    <button key={h} onClick={() => setHairIn(h)} className={`py-1 rounded border capitalize ${hairIn === h ? 'border-purple-500 text-purple-300' : 'border-purple-950/30 text-zinc-600'}`}>{h}</button>
                  ))}
                </div>
                <div className="grid grid-cols-3 gap-1 text-[9px] text-center">
                  {["none", "tiara", "ribbon"].map((d) => (
                    <button key={d} onClick={() => setDecIn(d)} className={`py-1 rounded border capitalize ${decIn === d ? 'border-purple-500 text-purple-300' : 'border-purple-950/30 text-zinc-600'}`}>{d}</button>
                  ))}
                </div>
                <button onClick={() => { updateProfileDetails(nameIn, hairIn, decIn); setIsEditing(false); }} className="w-full bg-purple-800 text-white font-mono text-[10px] py-1 rounded font-bold">Update Matrix</button>
              </div>
            )}
          </div>

          <nav className="space-y-2">
            <button onClick={() => { toggleIncognito(); onClose(); }} className="w-full text-left font-mono text-xs py-3 px-4 rounded-xl border border-purple-950/30 bg-zinc-900/20 text-zinc-300 flex justify-between items-center">
              <span>Mask Balance Shield</span>
              <span className={isIncognito ? "text-purple-400 font-bold" : "text-zinc-600"}>{isIncognito ? "HIDDEN" : "VISIBLE"}</span>
            </button>
          </nav>
        </div>

        <button onClick={removeAccountFromDevice} className="w-full bg-red-950/10 border border-red-900/30 text-red-400 font-mono text-[11px] py-2 rounded uppercase font-bold tracking-wider">Destroy Keys Cache</button>
      </div>
    </div>
  );
}
