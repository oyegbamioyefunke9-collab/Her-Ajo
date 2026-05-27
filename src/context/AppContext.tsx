"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface SavingsBox {
  id: string;
  name: string;
  target: number;
  current: number;
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
  isUnlocked: boolean;
  hasDeviceAccount: boolean;
  isGlowActive: boolean;
  devicePin: string | null;
  userName: string;
  userImage: string;
  registerAccount: (keys: UserKeys, pin: string) => void;
  unlockSession: (pin: string) => boolean;
  lockSession: () => void;
  removeAccountFromDevice: () => void;
  toggleIncognito: () => void;
  createSavingsBox: (name: string, target: number) => void;
  simulateDeposit: (boxId: string, nairaAmount: number) => void;
  updateCustomQuote: (quote: string) => void;
  updateProfileDetails: (name: string, imageDataUri: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [userKeys, setUserKeys] = useState<UserKeys | null>(null);
  const [devicePin, setDevicePin] = useState<string | null>(null);
  const [hasDeviceAccount, setHasDeviceAccount] = useState<boolean>(false);
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isGlowActive, setIsGlowActive] = useState<boolean>(false);
  const [isIncognito, setIsIncognito] = useState<boolean>(false);
  const [userName, setUserName] = useState<string>("BLESSED");
  const [userImage, setUserImage] = useState<string>("");
  const [activeQuote, setActiveQuote] = useState<string>("Your wealth is your private power. Shield it completely.");
  
  const [savingsBoxes, setSavingsBoxes] = useState<SavingsBox[]>([
    { id: "1", name: "Market Trade Reserve", target: 500, current: 150 },
    { id: "2", name: "Emergency Medical Pool", target: 300, current: 280 },
  ]);

  useEffect(() => {
    const storedKeys = localStorage.getItem("ha_keys");
    const storedPin = localStorage.getItem("ha_pin");
    const storedBoxes = localStorage.getItem("ha_boxes");
    const storedQuote = localStorage.getItem("ha_quote");
    const storedName = localStorage.getItem("ha_name");
    const storedImg = localStorage.getItem("ha_img");
    
    if (storedPin) {
      setDevicePin(storedPin);
      setHasDeviceAccount(true);
    }
    if (storedKeys) setUserKeys(JSON.parse(storedKeys));
    if (storedBoxes) setSavingsBoxes(JSON.parse(storedBoxes));
    if (storedQuote) setActiveQuote(storedQuote);
    if (storedName) setUserName(storedName);
    if (storedImg) setUserImage(storedImg);
  }, []);

  const triggerGlowRitual = () => {
    setIsGlowActive(true);
    setTimeout(() => {
      setIsGlowActive(false);
    }, 4000);
  };

  const registerAccount = (keys: UserKeys, pin: string) => {
    setUserKeys(keys);
    setDevicePin(pin);
    setHasDeviceAccount(true);
    setIsUnlocked(true);
    localStorage.setItem("ha_keys", JSON.stringify(keys));
    localStorage.setItem("ha_pin", pin);
    triggerGlowRitual();
  };

  const unlockSession = (pin: string): boolean => {
    if (pin === devicePin) {
      setIsUnlocked(true);
      triggerGlowRitual();
      return true;
    }
    return false;
  };

  const lockSession = () => {
    setIsUnlocked(false);
  };

  const removeAccountFromDevice = () => {
    setUserKeys(null);
    setDevicePin(null);
    setHasDeviceAccount(false);
    setIsUnlocked(false);
    localStorage.clear();
  };

  const toggleIncognito = () => setIsIncognito((prev) => !prev);

  const createSavingsBox = (name: string, target: number) => {
    const newBox: SavingsBox = {
      id: Math.random().toString(36).substring(7),
      name,
      target,
      current: 0,
    };
    const updated = [...savingsBoxes, newBox];
    setSavingsBoxes(updated);
    localStorage.setItem("ha_boxes", JSON.stringify(updated));
  };

  const simulateDeposit = (boxId: string, nairaAmount: number) => {
    const dollarEquivalent = Math.round((nairaAmount / 1370) * 100) / 100;
    const updated = savingsBoxes.map((box) => {
      if (box.id === boxId) {
        return { ...box, current: Math.round((box.current + dollarEquivalent) * 100) / 100 };
      }
      return box;
    });
    setSavingsBoxes(updated);
    localStorage.setItem("ha_boxes", JSON.stringify(updated));
  };

  const updateCustomQuote = (quote: string) => {
    setActiveQuote(quote);
    localStorage.setItem("ha_quote", quote);
  };

  const updateProfileDetails = (name: string, imageDataUri: string) => {
    if (name) {
      setUserName(name);
      localStorage.setItem("ha_name", name);
    }
    if (imageDataUri) {
      setUserImage(imageDataUri);
      localStorage.setItem("ha_img", imageDataUri);
    }
  };

  return (
    <AppContext.Provider
      value={{
        userKeys,
        savingsBoxes,
        isIncognito,
        activeQuote,
        isUnlocked,
        hasDeviceAccount,
        isGlowActive,
        devicePin,
        userName,
        userImage,
        registerAccount,
        unlockSession,
        lockSession,
        removeAccountFromDevice,
        toggleIncognito,
        createSavingsBox,
        simulateDeposit,
        updateCustomQuote,
        updateProfileDetails,
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
