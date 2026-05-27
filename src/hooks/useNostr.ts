'use client';

import { useState } from 'react';

export function useNostr() {
  const [isConnected, setIsConnected] = useState(false);

  return {
    isConnected,
    setIsConnected,
  };
}
