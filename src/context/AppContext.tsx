"use client";

import React, { createContext, useContext, useState } from "react";

interface AppContextType {
  isUnlocked: boolean;
  userName: string;
  hairStyle: string;
  nameDecoration: string;
  streakCount: number;
  circles: any[];
  ledger: any[];
  notifications: any[];
  activeTab: string;
  kycVerified: boolean;
  bvnMock: string;
  isMenuOpen: boolean;
  
  unlockSession: (pin: string) => void;
  lockSession: () => void;
  setActiveTab: (tab: string) => void;
  setBvnMock: (bvn: string) => void;
  setKycVerified: (status: boolean) => void;
  setIsMenuOpen: (status: boolean) => void;
  clearNotifications: () => void;
  executeContribution: (circleId: string, amount: number) => void;
  joinCircleByCode: (code: string) => boolean;
  createNewCircle: (name: string, purpose: string, target: number, duration: string, isInflationProof: boolean) => void;
  
  // Restored updaters for profile pictures
  setHairStyle: (style: string) => void;
  setNameDecoration: (dec: string) => void;
}

const AppContext = createContext<AppContextType | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [kycVerified, setKycVerified] = useState(false);
  const [bvnMock, setBvnMock] = useState("");
  
  const [userName] = useState("OYEFUNKE");
  const [hairStyle, setHairStyle] = useState("locs");
  const [nameDecoration, setNameDecoration] = useState("tiara");
  const [streakCount] = useState(12);

  const [notifications, setNotifications] = useState([
    { text: "Your profile was successfully updated.", time: "10:00 AM" }
  ]);

  const [circles, setCircles] = useState([
    { id: "1", name: "Market Trade", inviteCode: "MKT-123", current: 500, target: 1000, hasPaidThisRound: [] }
  ]);

  const [ledger, setLedger] = useState([
    { id: "1", type: "Deposit", circleName: "Global Vault", date: "Today", amount: 150 }
  ]);

  const unlockSession = (pin: string) => { if (pin.length >= 4) setIsUnlocked(true); };
  const lockSession = () => setIsUnlocked(false);
  const clearNotifications = () => setNotifications([]);
  
  const executeContribution = (circleId: string, amount: number) => {
    setLedger(prev => [{ id: Date.now().toString(), type: "Deposit", circleName: circleId, date: "Just now", amount }, ...prev]);
  };

  const joinCircleByCode = (code: string) => {
    return true;
  };

  const createNewCircle = (name: string, purpose: string, target: number, duration: string, isInflationProof: boolean) => {
    setCircles(prev => [...prev, { id: Date.now().toString(), name, inviteCode: `NEW-${Math.floor(Math.random()*1000)}`, current: 0, target, hasPaidThisRound: [] }]);
  };

  return (
    <AppContext.Provider value={{ 
      isUnlocked, userName, hairStyle, nameDecoration, streakCount, circles, ledger, notifications, activeTab, kycVerified, bvnMock, isMenuOpen,
      unlockSession, lockSession, setActiveTab, setBvnMock, setKycVerified, setIsMenuOpen, clearNotifications, executeContribution, joinCircleByCode, createNewCircle,
      setHairStyle, setNameDecoration
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext)!; }
