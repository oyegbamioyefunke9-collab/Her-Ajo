"use client";

import React from "react";

interface TrackerProps {
  profile: "african" | "european" | "asian";
  progress: number; // 0 to 100
}

export default function SilhouetteTracker({ profile, progress }: TrackerProps) {
  // SVG Knockout Paths: Draws a solid boundary around a transparent female silhouette shape
  const getSilhouettePath = () => {
    switch (profile) {
      case "african":
        // Stylized silhouette with crown-like natural textured twists/braids
        return "M50,15 C58,12 68,16 66,26 C72,24 76,32 70,38 C74,44 68,52 62,50 C60,56 52,58 48,54 C40,58 34,50 36,44 C30,40 34,28 42,28 C40,18 46,14 50,15 Z M50,54 C54,58 58,66 58,75 L64,110 L68,150 L32,150 L36,110 L42,75 C42,66 46,58 50,54 Z";
      case "asian":
        // Stylized silhouette with a sharp, geometric sharp bob cut
        return "M50,18 C62,18 66,24 66,38 C66,44 64,50 60,52 C58,56 54,60 50,62 C46,60 42,56 40,52 C36,50 34,44 34,38 C34,24 38,18 50,18 Z M50,62 C55,66 60,72 60,82 L65,115 L68,150 L32,150 L35,115 L40,82 C40,72 45,66 50,62 Z";
      case "european":
      default:
        // Stylized silhouette displaying long, flowing straight hair lines
        return "M50,16 C60,16 64,22 64,36 C64,52 68,60 66,70 C62,68 60,56 58,54 C54,58 46,58 42,54 C40,56 38,68 34,70 C32,60 36,52 36,36 C36,22 40,16 50,16 Z M50,54 C54,58 58,66 58,78 L62,115 L66,150 L34,150 L38,115 L42,78 C42,66 46,58 50,54 Z";
    }
  };

  return (
    <div className="relative w-36 h-52 bg-zinc-900 rounded-xl overflow-hidden border border-zinc-800 flex items-center justify-center p-2 group">
      {/* Dynamic Luminous Gradient Pool */}
      <div 
        className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-pink-600 via-magenta-500 to-fuchsia-400 transition-all duration-700 ease-out shadow-[0_0_25px_rgba(236,72,153,0.5)]"
        style={{ height: `${Math.max(progress, 4)}%` }}
      />

      {/* SVG Knockout Mask Overlay */}
      <svg 
        viewBox="0 0 100 150" 
        className="absolute inset-0 w-full h-full object-cover select-none mix-blend-multiply"
      >
        {/* Solid frame matching our exact dashboard background color canvas */}
        <rect width="100" height="150" fill="#09090b" />
        {/* The cutout silhouette path shape */}
        <path d={getSilhouettePath()} fill="#18181b" className="group-hover:fill-zinc-800 transition-colors duration-300" />
      </svg>
      
      {/* Floating Badge Indicator */}
      <div className="absolute top-2 right-2 bg-zinc-950/80 backdrop-blur-md border border-pink-500/30 px-1.5 py-0.5 rounded text-[10px] font-mono text-pink-400 font-bold">
        {Math.round(progress)}%
      </div>
    </div>
  );
}
