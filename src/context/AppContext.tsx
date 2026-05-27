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
  
  // Updated createNewCircle with inflation proof + more Ajo fields
  createNewCircle: (
    name: string, 
    purpose: string, 
    target: number, 
    duration: string, 
    isInflationProof: boolean,
    numMembers?: number
  ) => void;
  
  // Restored updaters for profile
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
    { 
      id: "1", 
      name: "Market Trade", 
      purpose: "Business Capital",
      inviteCode: "MKT-123", 
      current: 500, 
      target: 1000, 
      duration: "weekly",
      isInflationProof: false,
      hasPaidThisRound: [],
      nextTurn: "Tunde",
      numMembers: 6,
      members: ["OYEFUNKE", "Tunde", "Amina", "Fatima", "Bolu", "Chidi"]
    }
  ]);

  const [ledger, setLedger] = useState([
    { id: "1", type: "Deposit", circleName: "Global Vault", date: "Today", amount: 150 }
  ]);

  const unlockSession = (pin: string) => { 
    if (pin.length >= 4) setIsUnlocked(true); 
  };
  
  const lockSession = () => setIsUnlocked(false);
  const clearNotifications = () => setNotifications([]);
  
  const executeContribution = (circleId: string, amount: number) => {
    setLedger(prev => [{ 
      id: Date.now().toString(), 
      type: "Deposit", 
      circleName: circleId, 
      date: "Just now", 
      amount 
    }, ...prev]);
  };

  const joinCircleByCode = (code: string) => {
    // Mock join logic
    return true;
  };

  const createNewCircle = (
    name: string, 
    purpose: string, 
    target: number, 
    duration: string, 
    isInflationProof: boolean,
    numMembers: number = 6
  ) => {
    const newCircle = {
      id: Date.now().toString(),
      name,
      purpose: purpose || "General Ajo",
      inviteCode: `HER-${Math.floor(Math.random() * 9000) + 1000}`,
      current: 0,
      target,
      duration,
      isInflationProof,
      hasPaidThisRound: [],
      nextTurn: "You", // First turn usually the creator
      numMembers,
      members: [userName]
    };
    
    setCircles(prev => [...prev, newCircle]);
  };

  return (
    <AppContext.Provider value={{ 
      isUnlocked, 
      userName, 
      hairStyle, 
      nameDecoration, 
      streakCount, 
      circles, 
      ledger, 
      notifications, 
      activeTab, 
      kycVerified, 
      bvnMock, 
      isMenuOpen,

      unlockSession, 
      lockSession, 
      setActiveTab, 
      setBvnMock, 
      setKycVerified, 
      setIsMenuOpen, 
      clearNotifications, 
      executeContribution, 
      joinCircleByCode, 
      createNewCircle,
      setHairStyle, 
      setNameDecoration
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { 
  return useContext(AppContext)!; 
}