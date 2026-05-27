"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface SavingsBox {
  id: string;
  name: string;
  target: number;
  current: number;
  profile: "african" | "european" | "asian";
}

interface UserKeys {
  mnemonic: string;
  npub: string;
}

interface AppContextType {
  userKeys: UserKeys | null;
  savingsBoxes: SavingsBox[];
  isIncognito: boolean;
  activeQuote: string;
  login: (keys: UserKeys) => void;
  logout: () => void;
  toggleIncognito: () => void;
  createSavingsBox: (name: string, target: number, profile: "african" | "european" | "asian") => void;
  simulateDeposit: (boxId: string, nairaAmount: number) => void;
  updateCustomQuote: (quote: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userKeys, setUserKeys] = useState<UserKeys | null>(null);
  const [isIncognito, setIsIncognito] = useState<boolean>(false);
  const [activeQuote, setActiveQuote] = useState<string>("Your wealth is your power. Shield it wisely.");
  const [savingsBoxes, setSavingsBoxes] = useState<SavingsBox[]>([
    { id: "1", name: "Market Shop Capital", target: 500, current: 150, profile: "african" },
    { id: "2", name: "Emergency Medical Vault", target: 300, current: 280, profile: "asian" },
  ]);

  // Load local state safely on the client
  useEffect(() => {
    const storedKeys = localStorage.getItem("hj_keys");
    const storedBoxes = localStorage.getItem("hj_boxes");
    const storedQuote = localStorage.getItem("hj_quote");
    
    if (storedKeys) setUserKeys(JSON.parse(storedKeys));
    if (storedBoxes) setSavingsBoxes(JSON.parse(storedBoxes));
    if (storedQuote) setActiveQuote(storedQuote);
  }, []);

  const login = (keys: UserKeys) => {
    setUserKeys(keys);
    localStorage.setItem("hj_keys", JSON.stringify(keys));
  };

  const logout = () => {
    setUserKeys(null);
    localStorage.removeItem("hj_keys");
  };

  const toggleIncognito = () => setIsIncognito((prev) => !prev);

  const createSavingsBox = (name: string, target: number, profile: "african" | "european" | "asian") => {
    const newBox: SavingsBox = {
      id: Math.random().toString(36).substring(7),
      name,
      target,
      current: 0,
      profile,
    };
    const updated = [...savingsBoxes, newBox];
    setSavingsBoxes(updated);
    localStorage.setItem("hj_boxes", JSON.stringify(updated));
  };

  const simulateDeposit = (boxId: string, nairaAmount: number) => {
    // Mock conversion: ₦1,370 = $1 USD stable eCash
    const dollarEquivalent = Math.round((nairaAmount / 1370) * 100) / 100;
    
    const updated = savingsBoxes.map((box) => {
      if (box.id === boxId) {
        return { ...box, current: Math.min(box.current + dollarEquivalent, box.target) };
      }
      return box;
    });
    setSavingsBoxes(updated);
    localStorage.setItem("hj_boxes", JSON.stringify(updated));
  };

  const updateCustomQuote = (quote: string) => {
    setActiveQuote(quote);
    localStorage.setItem("hj_quote", quote);
    // In production, this block signs and publishes a custom event to Nostr relays
  };

  return (
    <AppContext.Provider
      value={{
        userKeys,
        savingsBoxes,
        isIncognito,
        activeQuote,
        login,
        logout,
        toggleIncognito,
        createSavingsBox,
        simulateDeposit,
        updateCustomQuote,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) throw new Error("useApp must be used inside an AppProvider");
  return context;
}
