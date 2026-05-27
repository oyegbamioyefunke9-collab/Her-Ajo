"use client";

import React, { createContext, useContext, useState } from "react";

// Simplified interface for your professional banking app
interface AppNotification {
  text: string;
  type: "urgent" | "info";
  timeUntil?: number; // hours remaining
}

interface AppContextType {
  userName: string;
  totalSavedThisMonth: number;
  streakCount: number;
  notifications: AppNotification[];
  isUnlocked: boolean;
  pinInput: string;
  setPinInput: (p: string) => void;
  unlockSession: (p: string) => void;
  lockSession: () => void;
  // Professional actions
  recordDeposit: (amount: number) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [pinInput, setPinInput] = useState("");
  
  // App State
  const [userName] = useState("Blessed"); // Keeping your name logic
  const [totalSavedThisMonth, setTotalSavedThisMonth] = useState(150000);
  const [streakCount] = useState(12);

  // New Notification Logic: Urgent if < 24hrs
  const [notifications] = useState<AppNotification[]>([
    { text: "Your contribution window closes in 21 hours!", type: "urgent", timeUntil: 21 }
  ]);

  const unlockSession = (p: string) => { 
    if (p === "1234") setIsUnlocked(true); 
  };
  
  const lockSession = () => setIsUnlocked(false);

  const recordDeposit = (amount: number) => {
    setTotalSavedThisMonth(prev => prev + amount);
  };

  return (
    <AppContext.Provider value={{ 
      userName, totalSavedThisMonth, streakCount, notifications, 
      isUnlocked, pinInput, setPinInput, unlockSession, lockSession, recordDeposit 
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext)!; }
