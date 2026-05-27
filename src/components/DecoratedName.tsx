"use client";

import React from "react";

interface DecoratedNameProps {
  name: string;
  decoration: string;
}

export default function DecoratedName({ name, decoration }: DecoratedNameProps) {
  return (
    <span className="inline-flex items-center gap-1 font-mono tracking-wide">
      {decoration === "tiara" && <span>👑</span>}
      {decoration === "ribbon" && <span>🎀</span>}
      <span className="uppercase">{name || "ANONYMOUS"}</span>
    </span>
  );
}
