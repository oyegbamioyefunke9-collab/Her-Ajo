"use client";

import React from "react";

interface AvatarProps {
  style?: string;
  className?: string;
}

export default function SilhouetteAvatar({ style = "locs", className = "w-10 h-10" }: AvatarProps) {
  // Returns custom minimalist SVG paths depending on the chosen hairstyle
  const renderHairstylePaths = () => {
    switch (style) {
      case "afro":
        return (
          <>
            {/* Afro silhouette aura outer bounds */}
            <circle cx="50" cy="42" r="30" fill="#2e1065" opacity="0.4" />
            <circle cx="50" cy="45" r="24" fill="#1e1b4b" />
          </>
        );
      case "braids":
        return (
          <>
            {/* Structured drop strands flanking neck */}
            <rect x="28" y="45" width="8" height="35" rx="3" fill="#1e1b4b" />
            <rect x="64" y="45" width="8" height="35" rx="3" fill="#1e1b4b" />
            <circle cx="50" cy="45" r="20" fill="#1e1b4b" />
          </>
        );
      case "smooth":
        return (
          <circle cx="50" cy="46" r="20" fill="#1e1b4b" />
        );
      case "locs":
      default:
        return (
          <>
            {/* Dynamic side locks cascade elements */}
            <rect x="24" y="40" width="10" height="42" rx="4" fill="#2e1065" />
            <rect x="66" y="40" width="10" height="42" rx="4" fill="#2e1065" />
            <rect x="30" y="35" width="40" height="15" rx="5" fill="#1e1b4b" />
            <circle cx="50" cy="46" r="21" fill="#1e1b4b" />
          </>
        );
    }
  };

  return (
    <div className={`relative overflow-hidden rounded-full border border-purple-500/30 bg-[#0d0620] shadow-inner ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full object-cover"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Subtle Gradient Glow Mesh */}
        <circle cx="50" cy="50" r="50" fill="url(#avatarGlow)" opacity="0.15" />
        
        {/* Render Hairstyle Foundation Overlay */}
        {renderHairstylePaths()}

        {/* Universal Abstract Feminine Face & Neck Silhouette Base Structure */}
        <path
          d="M38 72C38 60 42 56 50 56C58 56 62 60 62 72V88H38V72Z"
          fill="#110c24"
        />
        <circle cx="50" cy="48" r="15" fill="#110c24" />
        
        {/* Shoulder Base Anchors */}
        <path
          d="M20 90C20 78 30 74 50 74C70 74 80 78 80 90V100H20V90Z"
          fill="#0a0518"
        />

        <defs>
          <radialGradient id="avatarGlow" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" transform="translate(50 50) rotate(90) scale(50)">
            <stop stopColor="#a855f7" />
            <stop offset="1" stopColor="#000000" stopOpacity="0" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
