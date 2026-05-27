"use client";

import React from "react";

export default function DrawerMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="w-64 bg-[#030008] border-r border-purple-950 p-6 shadow-2xl">
        <button onClick={onClose} className="text-zinc-500 mb-8">Close</button>
        <nav className="space-y-6 text-sm font-bold text-zinc-300">
          <a href="/home" className="block">Dashboard</a>
          <a href="/circles" className="block">My Circles</a>
          <a href="/history" className="block">Transaction History</a>
          <a href="/profile" className="block">Account Settings</a>
        </nav>
      </div>
      <div className="flex-1 bg-black/50" onClick={onClose} />
    </div>
  );
}
