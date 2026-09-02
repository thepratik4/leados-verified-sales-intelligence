/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState, useMemo } from 'react';

interface CompanyLogoProps {
  company: {
    name: string;
    domain: string;
    initial?: string;
    badgeColor?: string;
    logoUrl?: string;
  };
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

// Deterministic vibrant brand color palette for initial fallbacks
const BRAND_PALETTE = [
  '#005138', // LeadOS Emerald
  '#0F52BA', // Sapphire Blue
  '#632CA6', // Deep Violet
  '#E24329', // Warm Red-Orange
  '#0A7EA4', // Teal Cyan
  '#2E7D32', // Forest Green
  '#C2410C', // Rust Amber
  '#4338CA', // Indigo
  '#0E7490', // Cyan
  '#9D174D', // Magenta
];

function getDeterministicColor(str: string): string {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % BRAND_PALETTE.length;
  return BRAND_PALETTE[index];
}

export default function CompanyLogo({
  company,
  size = 'md',
  className = '',
}: CompanyLogoProps) {
  const [sourceIndex, setSourceIndex] = useState(0);
  const [allFailed, setAllFailed] = useState(false);

  // Clean domain string for API calls
  const cleanDomain = useMemo(() => {
    if (!company.domain) return '';
    return company.domain
      .toLowerCase()
      .trim()
      .replace(/^(https?:\/\/)?(www\.)?/, '')
      .split('/')[0];
  }, [company.domain]);

  // Construct tiered live logo sources
  const candidateSources = useMemo(() => {
    const sources: string[] = [];
    if (company.logoUrl && company.logoUrl.trim()) {
      sources.push(company.logoUrl.trim());
    }
    if (cleanDomain) {
      // 1. Google Favicons 128px high-res
      sources.push(`https://www.google.com/s2/favicons?domain=${cleanDomain}&sz=128`);
      // 2. Unavatar service
      sources.push(`https://unavatar.io/${cleanDomain}`);
      // 3. DuckDuckGo icon service
      sources.push(`https://icons.duckduckgo.com/ip3/${cleanDomain}.ico`);
    }
    return sources;
  }, [company.logoUrl, cleanDomain]);

  // Dimension mapping
  const sizeClasses = {
    xs: 'w-6 h-6 rounded-lg text-[10px]',
    sm: 'w-8 h-8 rounded-xl text-xs',
    md: 'w-10 h-10 rounded-xl text-sm',
    lg: 'w-12 h-12 rounded-xl text-base',
    xl: 'w-16 h-16 rounded-2xl text-xl',
  };

  const handleImageError = () => {
    if (sourceIndex + 1 < candidateSources.length) {
      setSourceIndex((prev) => prev + 1);
    } else {
      setAllFailed(true);
    }
  };

  // If candidate sources available and not all failed, render dynamic live logo
  if (candidateSources.length > 0 && !allFailed) {
    const currentSrc = candidateSources[sourceIndex];
    return (
      <div
        className={`${sizeClasses[size]} bg-white border border-[#E5E5E1] flex items-center justify-center shrink-0 shadow-2xs overflow-hidden p-1 ${className}`}
      >
        <img
          key={currentSrc}
          src={currentSrc}
          alt={`${company.name} logo`}
          className="w-full h-full object-contain rounded transition-opacity duration-200"
          loading="lazy"
          onError={handleImageError}
        />
      </div>
    );
  }

  // Fallback: Deterministic High-Contrast Branded Monogram
  const initial = company.initial || (company.name ? company.name.charAt(0).toUpperCase() : '?');
  const bgColor = company.badgeColor || getDeterministicColor(cleanDomain || company.name || 'default');

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center font-bold text-white shrink-0 shadow-2xs tracking-tight select-none ${className}`}
      style={{ backgroundColor: bgColor }}
      title={company.name}
    >
      {initial}
    </div>
  );
}
