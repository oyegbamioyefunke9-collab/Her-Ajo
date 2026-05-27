'use client';

import { useState } from 'react';

export function useCashu() {
  const [isConnected, setIsConnected] = useState(false);

  return {
    isConnected,
    setIsConnected,
  };
}
