"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface AjoCircle {
  id: string;
  name: string;
  purpose: string;
  target: number;
  current: number;
  contributionAmount: number;
  cycleDuration: "weekly" | "monthly";
  membersCount: number;
  rotationOrder: string[];
  currentRecipientIndex: number;
  hasPaidThisRound: string[];
  isInflationProof: boolean;
  inviteCode: string;
}

export interface LedgerEntry {
  id: string;
  circleName: string;
  user: string;
  amount: number;
  type: "Contribution" | "Payout" | "Personal Deposit" | "Withdrawal";
  date: string;
  txSignature: string;
}

export interface AppNotification {
  id: string;
  text: string;
  time: string;
  read: boolean;
}

interface UserKeys { mnemonic: string; npub: string; }

interface AppContextType {
  userKeys: UserKeys | null;
  circles: AjoCircle[];
  ledger: LedgerEntry[];
  notifications: AppNotification[];
  activeTab: "home" | "circles" | "history" | "profile";
  isIncognito: boolean;
  isUnlocked: boolean;
  hasDeviceAccount: boolean;
  isGlowActive: boolean;
  userName: string;
  hairStyle: string;
  nameDecoration: string;
  kycVerified: boolean;
  bvnMock: string;
  streakCount: number;
  totalSavedThisMonth: number;
  setActiveTab: (tab: "home" | "circles" | "history" | "profile") => void;
  registerAccount: (keys: UserKeys, pin: string) => void;
  unlockSession: (pin: string) => boolean;
  lockSession: () => void;
  removeAccountFromDevice: () => void;
  toggleIncognito: () => void;
  setKycVerified: (val: boolean) => void;
  setBvnMock: (val: string) => void;
  createNewCircle: (name: string, purpose: string, amount: number, duration: "weekly" | "monthly", inflationProof: boolean) => void;
  joinCircleByCode: (code: string) => boolean;
  executeContribution: (circleId: string, customAmount?: number) => void;
  clearNotifications: () => void;
  updateProfileDetails: (name: string, hair: string, decoration: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userKeys, setUserKeys] = useState<UserKeys | null>(null);
  const [hasDeviceAccount, setHasDeviceAccount] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isGlowActive, setIsGlowActive] = useState<boolean>(false);
  const [isIncognito, setIsIncognito] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<"home" | "circles" | "history" | "profile">("home");
  
  const [userName, setUserName] = useState<string>("OYEFUNKE");
  const [hairStyle, setHairStyle] = useState<string>("locs");
  const [nameDecoration, setNameDecoration] = useState<string>("tiara");
  const [kycVerified, setKycVerified] = useState<boolean>(false);
  const [bvnMock, setBvnMock] = useState<string>("");
  const [streakCount, setStreakCount] = useState<number>(4);
  const [totalSavedThisMonth, setTotalSavedThisMonth] = useState<number>(185);

  const [circles, setCircles] = useState<AjoCircle[]>([
    {
      id: "c1",
      name: "Market Trade Elite",
      purpose: "Wholesale Inventory Stocking",
      target: 1200,
      current: 450,
      contributionAmount: 50,
      cycleDuration: "weekly",
      membersCount: 6,
      rotationOrder: ["OYEFUNKE", "Oluwatobi", "Amara", "Chioma", "Zainab", "Fatima"],
      currentRecipientIndex: 1,
      hasPaidThisRound: ["OYEFUNKE", "Amara"],
      isInflationProof: true,
      inviteCode: "RADAR-MARKET"
    },
    {
      id: "c2",
      name: "Ibadan School Fees Vault",
      purpose: "Term Tuition Isolation",
      target: 500,
      current: 120,
      contributionAmount: 25,
      cycleDuration: "monthly",
      membersCount: 4,
      rotationOrder: ["Bisi", "OYEFUNKE", "Ronke", "Ngozi"],
      currentRecipientIndex: 0,
      hasPaidThisRound: ["Bisi"],
      isInflationProof: false,
      inviteCode: "IBADAN-FEES"
    }
  ]);

  const [ledger, setLedger] = useState<LedgerEntry[]>([
    { id: "tx1", circleName: "Market Trade Elite", user: "OYEFUNKE", amount: 50, type: "Contribution", date: "May 24, 2026", txSignature: "4zWb...9xKe" },
    { id: "tx2", circleName: "Market Trade Elite", user: "Amara", amount: 50, type: "Contribution", date: "May 25, 2026", txSignature: "5qYp...21mK" },
    { id: "tx3", circleName: "Ibadan School Fees Vault", user: "Bisi", amount: 25, type: "Contribution", date: "May 26, 2026", txSignature: "2vTr...88pQ" }
  ]);

  const [notifications, setNotifications] = useState<AppNotification[]>([
    { id: "n1", text: "Your rotation turn for Market Trade Elite arrives in 3 days.", time: "2h ago", read: false },
    { id: "n2", text: "Oluwatobi just contributed ₦68,500 ($50) into Circle 1.", time: "5h ago", read: false }
  ]);

  useEffect(() => {
    const storedPin = localStorage.getItem("ha_pin");
    if (storedPin) setHasDeviceAccount(true);
  }, []);

  const registerAccount = (keys: UserKeys, pin: string) => {
    setUserKeys(keys);
    setHasDeviceAccount(true);
    setIsUnlocked(true);
    localStorage.setItem("ha_pin", pin);
    setIsGlowActive(true);
    setTimeout(() => setIsGlowActive(false), 3500);
  };

  const unlockSession = (pin: string): boolean => {
    if (pin === localStorage.getItem("ha_pin")) {
      setIsUnlocked(true);
      setIsGlowActive(true);
      setTimeout(() => setIsGlowActive(false), 3500);
      return true;
    }
    return false;
  };

  const lockSession = () => setIsUnlocked(false);
  const removeAccountFromDevice = () => { localStorage.clear(); window.location.reload(); };
  const toggleIncognito = () => setIsIncognito(!isIncognito);
  const clearNotifications = () => setNotifications([]);

  const createNewCircle = (name: string, purpose: string, amount: number, duration: "weekly" | "monthly", inflationProof: boolean) => {
    const newCircle: AjoCircle = {
      id: Math.random().toString(36).substring(7),
      name,
      purpose,
      target: amount * 6,
      current: 0,
      contributionAmount: amount,
      cycleDuration: duration,
      membersCount: 4,
      rotationOrder: [userName, "Friend A", "Friend B", "Friend C"],
      currentRecipientIndex: 0,
      hasPaidThisRound: [],
      isInflationProof: inflationProof,
      inviteCode: `AJO-${Math.floor(1000 + Math.random() * 9000)}`
    };
    setCircles([...circles, newCircle]);
  };

  const joinCircleByCode = (code: string): boolean => {
    if (!code) return false;
    const mockJoined: AjoCircle = {
      id: Math.random().toString(36).substring(7),
      name: `Joined Group Circle (#${code.toUpperCase()})`,
      purpose: "Cooperative Capital Rotation",
      target: 800,
      current: 50,
      contributionAmount: 50,
      cycleDuration: "weekly",
      membersCount: 5,
      rotationOrder: ["Admin", "User2", "User3", userName],
      currentRecipientIndex: 0,
      hasPaidThisRound: ["Admin"],
      isInflationProof: true,
      inviteCode: code.toUpperCase()
    };
    setCircles([...circles, mockJoined]);
    return true;
  };

  const executeContribution = (circleId: string, customAmount?: number) => {
    setCircles(prev => prev.map(c => {
      if (c.id === circleId) {
        const amt = customAmount || c.contributionAmount;
        const paidArray = c.hasPaidThisRound.includes(userName) ? c.hasPaidThisRound : [...c.hasPaidThisRound, userName];
        
        // Append entry to structural transaction ledger
        const newTx: LedgerEntry = {
          id: `tx-${Math.random().toString(36).substring(5)}`,
          circleName: c.name,
          user: userName,
          amount: amt,
          type: customAmount ? "Personal Deposit" : "Contribution",
          date: "Today",
          txSignature: "SolTx..." + Math.random().toString(36).substring(2,6).toUpperCase()
        };
        setLedger(l => [newTx, ...l]);
        setTotalSavedThisMonth(prev => prev + amt);
        if (!customAmount) setStreakCount(s => s + 1);

        return { ...c, current: c.current + amt, hasPaidThisRound: paidArray };
      }
      return c;
    }));
  };

  const updateProfileDetails = (name: string, hair: string, decoration: string) => {
    setUserName(name); setHairStyle(hair); setNameDecoration(decoration);
  };

  return (
    <AppContext.Provider value={{
      userKeys, circles, ledger, notifications, activeTab, isIncognito, isUnlocked, hasDeviceAccount, isGlowActive, userName, hairStyle, nameDecoration, kycVerified, bvnMock, streakCount, totalSavedThisMonth,
      setActiveTab, registerAccount, unlockSession, lockSession, removeAccountFromDevice, toggleIncognito, setKycVerified, setBvnMock, createNewCircle, joinCircleByCode, executeContribution, clearNotifications, updateProfileDetails
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() { return useContext(AppContext)!; }
