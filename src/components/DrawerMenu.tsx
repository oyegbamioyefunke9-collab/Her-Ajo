"use client";

import React from "react";
import { useApp } from "@/context/AppContext";
import { Home, RefreshCw, ScrollText, UserCircle, X } from "lucide-react";

export default function DrawerMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { setActiveTab } = useApp();

  if (!isOpen) return null;

  const navigateTo = (tabId: any) => {
    setActiveTab(tabId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-64 bg-[#05020a] border-r border-purple-900/40 shadow-2xl flex flex-col h-full animate-slide-right">
        <div className="p-6 border-b border-purple-900/30 flex justify-between items-center">
          <span className="font-mono text-sm text-purple-400 font-bold uppercase tracking-widest">Menu</span>
          <button onClick={onClose} className="text-zinc-500 hover:text-white"><X className="w-5 h-5" /></button>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {[
            { id: "home", label: "Dashboard", icon: Home },
            { id: "circles", label: "My Circles", icon: RefreshCw },
            { id: "history", label: "Audit Ledger", icon: ScrollText },
            { id: "profile", label: "Identity Profile", icon: UserCircle }
          ].map((item) => (
            <button 
              key={item.id} 
              onClick={() => navigateTo(item.id)} 
              className="w-full flex items-center gap-4 p-4 rounded-2xl hover:bg-purple-900/20 text-zinc-300 hover:text-white transition-colors"
            >
              <item.icon className="w-5 h-5 text-purple-400" />
              <span className="text-xs font-bold tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
      <div className="flex-1 bg-black/60 backdrop-blur-sm" onClick={onClose} />
    </div>
  );
}
