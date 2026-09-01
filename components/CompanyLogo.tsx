/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';

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

export default function CompanyLogo({
  company,
  size = 'md',
  className = '',
}: CompanyLogoProps) {
  const [imageError, setImageError] = useState(false);

  const domain = company.domain.toLowerCase().replace(/^(https?:\/\/)?(www\.)?/, '').split('/')[0];
  const nameLower = company.name.toLowerCase();

  // Dimension mapping
  const sizeClasses = {
    xs: 'w-6 h-6 rounded-lg text-[10px]',
    sm: 'w-8 h-8 rounded-xl text-xs',
    md: 'w-10 h-10 rounded-xl text-sm',
    lg: 'w-12 h-12 rounded-xl text-base',
    xl: 'w-16 h-16 rounded-2xl text-xl',
  };

  const iconSizes = {
    xs: 14,
    sm: 18,
    md: 22,
    lg: 28,
    xl: 36,
  };

  const s = iconSizes[size];

  // Helper to render official authentic brand SVG marks
  const renderBrandSvg = () => {
    if (domain.includes('cloudflare') || nameLower.includes('cloudflare')) {
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path
            d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"
            fill="#F6821F"
          />
          <path
            d="M19 14.5c0-.28-.22-.5-.5-.5h-8c-.28 0-.5.22-.5.5s.22.5.5.5h8c.28 0 .5-.22.5-.5z"
            fill="#FAAE40"
          />
        </svg>
      );
    }

    if (domain.includes('datadog') || nameLower.includes('datadog')) {
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
          <rect width="24" height="24" rx="5" fill="#632CA6" />
          <path
            d="M17.5 14.2c-.4-.3-.9-.4-1.4-.4-.3 0-.6.1-.9.2l-1.3-1.8c.4-.5.6-1.1.6-1.7 0-1.7-1.3-3-3-3s-3 1.3-3 3c0 .7.2 1.3.6 1.8l-1.3 1.7c-.3-.1-.6-.2-.9-.2-.5 0-1 .1-1.4.4-.6.5-.9 1.2-.9 2 0 1.5 1.2 2.8 2.8 2.8.9 0 1.7-.5 2.2-1.2l1.6-.2 1.6.2c.5.7 1.3 1.2 2.2 1.2 1.5 0 2.8-1.2 2.8-2.8 0-.8-.3-1.5-.9-2zM11.5 9.5c.8 0 1.5.7 1.5 1.5s-.7 1.5-1.5 1.5-1.5-.7-1.5-1.5.7-1.5 1.5-1.5z"
            fill="#FFFFFF"
          />
        </svg>
      );
    }

    if (domain.includes('snowflake') || nameLower.includes('snowflake')) {
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path
            d="M12 2v20M2 12h20M4.93 4.93l14.14 14.14M4.93 19.07l14.14-14.14M12 6l-2-2m2 2l2-2M12 18l-2 2m2-2l2 2M6 12l-2-2m2 2l-2 2M18 12l2-2m-2 2l2 2"
            stroke="#29B5E8"
            strokeWidth="2.2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      );
    }

    if (domain.includes('mongodb') || nameLower.includes('mongodb')) {
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path
            d="M12 1.5s-6.5 4.8-6.5 11.2c0 4.2 3.2 7.8 6.5 9.8 3.3-2 6.5-5.6 6.5-9.8C18.5 6.3 12 1.5 12 1.5z"
            fill="#00ED64"
          />
          <path
            d="M12 1.5v21c.2 0 .4-.1.6-.2 3.1-1.9 5.9-5.3 5.9-9.6 0-6.4-6.5-11.2-6.5-11.2z"
            fill="#00684A"
          />
          <path
            d="M12 4.5v15c-2.4-1.5-4.5-4.2-4.5-7.5 0-4.5 4.5-7.5 4.5-7.5z"
            fill="#13AA52"
          />
        </svg>
      );
    }

    if (domain.includes('gitlab') || nameLower.includes('gitlab')) {
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M22.65 14.39L12 22.13 1.35 14.39a.84.84 0 01-.3-.94l2.42-7.44a.85.85 0 01.81-.58.87.87 0 01.81.58l2.08 6.4h9.66l2.09-6.4a.87.87 0 01.81-.58.85.85 0 01.81.58l2.42 7.44a.85.85 0 01-.31.94z" fill="#E24329" />
          <path d="M12 22.13L16.83 7.41H7.17L12 22.13z" fill="#E24329" />
          <path d="M12 22.13L7.17 7.41H1.35L12 22.13z" fill="#FC6D26" />
          <path d="M12 22.13l4.83-14.72h5.82L12 22.13z" fill="#FC6D26" />
          <path d="M1.35 7.41l2.42-7.44a.85.85 0 01.81-.58.87.87 0 01.81.58L7.17 7.41H1.35z" fill="#FCA326" />
          <path d="M22.65 7.41l-2.42-7.44a.85.85 0 01-.81-.58.87.87 0 01-.81.58L16.83 7.41h5.82z" fill="#FCA326" />
        </svg>
      );
    }

    if (domain.includes('sentinelone') || nameLower.includes('sentinelone')) {
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
          <rect width="24" height="24" rx="5" fill="#4B0082" />
          <path
            d="M12 3L4 7v6c0 5.5 3.5 10.7 8 12 4.5-1.3 8-6.5 8-12V7l-8-4zm0 4.5c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5-4.5-2-4.5-4.5 2-4.5 4.5-4.5z"
            fill="#AA60C8"
          />
        </svg>
      );
    }

    if (domain.includes('figma') || nameLower.includes('figma')) {
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
          <path d="M8 24c2.21 0 4-1.79 4-4v-4H8c-2.21 0-4 1.79-4 4s1.79 4 4 4z" fill="#0ACF83" />
          <path d="M4 12c0-2.21 1.79-4 4-4h4v8H8c-2.21 0-4-1.79-4-4z" fill="#A259FF" />
          <path d="M4 4c0-2.21 1.79-4 4-4h4v8H8c-2.21 0-4-1.79-4-4z" fill="#F24E1E" />
          <path d="M12 0h4c2.21 0 4 1.79 4 4s-1.79 4-4 4h-4V0z" fill="#FF7262" />
          <path d="M20 12c0 2.21-1.79 4-4 4s-4-1.79-4-4 1.79-4 4-4 4 1.79 4 4z" fill="#1ABCFE" />
        </svg>
      );
    }

    if (domain.includes('notion') || nameLower.includes('notion')) {
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
          <rect width="24" height="24" rx="5" fill="#000000" />
          <path
            d="M6 6.5h2.5l7 8.5V6.5H18v11h-2.5l-7-8.5v8.5H6v-11z"
            fill="#FFFFFF"
          />
        </svg>
      );
    }

    if (domain.includes('stripe') || nameLower.includes('stripe')) {
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
          <rect width="24" height="24" rx="5" fill="#635BFF" />
          <path
            d="M13.8 9.2c0-.7-.6-1-1.6-1-1.1 0-2.4.4-3.5 1l-.6-2.1c1.3-.6 2.8-.9 4.3-.9 3.2 0 5.2 1.6 5.2 4.2 0 4.1-5.6 3.5-5.6 5.3 0 .8.7 1.1 1.8 1.1 1.4 0 2.8-.5 3.9-1.2l.6 2.1c-1.3.7-3 1.1-4.7 1.1-3.3 0-5.5-1.6-5.5-4.2 0-4.4 5.7-3.7 5.7-5.4z"
            fill="#FFFFFF"
          />
        </svg>
      );
    }

    if (domain.includes('vercel') || nameLower.includes('vercel')) {
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
          <rect width="24" height="24" rx="5" fill="#000000" />
          <path d="M12 4L20 18H4L12 4z" fill="#FFFFFF" />
        </svg>
      );
    }

    if (domain.includes('supabase') || nameLower.includes('supabase')) {
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
          <rect width="24" height="24" rx="5" fill="#1C1C1C" />
          <path
            d="M13.5 2.5L3.5 14.5h8l-1 7 10-12h-8l1-7z"
            fill="#3ECF8E"
          />
        </svg>
      );
    }

    if (domain.includes('hashicorp') || nameLower.includes('hashicorp')) {
      return (
        <svg width={s} height={s} viewBox="0 0 24 24" fill="none" className="shrink-0">
          <rect width="24" height="24" rx="5" fill="#000000" />
          <path
            d="M6 5h3v5.5h6V5h3v14h-3v-5.5H9V19H6V5z"
            fill="#FFFFFF"
          />
        </svg>
      );
    }

    return null;
  };

  const brandSvg = renderBrandSvg();

  if (brandSvg) {
    return (
      <div
        className={`${sizeClasses[size]} bg-white border border-[#E5E5E1] flex items-center justify-center shrink-0 shadow-2xs overflow-hidden ${className}`}
      >
        {brandSvg}
      </div>
    );
  }

  // Fallback to Clearbit / Google Favicons with image error protection
  const primaryLogoUrl = company.logoUrl || `https://logo.clearbit.com/${domain}`;
  const fallbackFaviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;

  if (!imageError) {
    return (
      <div
        className={`${sizeClasses[size]} bg-white border border-[#E5E5E1] flex items-center justify-center shrink-0 shadow-2xs overflow-hidden ${className}`}
      >
        <img
          src={primaryLogoUrl}
          alt={`${company.name} logo`}
          className="w-4/5 h-4/5 object-contain rounded"
          onError={(e) => {
            // Try Google Favicons first before giving up
            const target = e.currentTarget;
            if (target.src !== fallbackFaviconUrl) {
              target.src = fallbackFaviconUrl;
            } else {
              setImageError(true);
            }
          }}
        />
      </div>
    );
  }

  // Final fallback: High contrast branded lettermark
  const initial = company.initial || company.name.charAt(0).toUpperCase();
  const bgColor = company.badgeColor || '#005138';

  return (
    <div
      className={`${sizeClasses[size]} flex items-center justify-center font-bold text-white shrink-0 shadow-2xs ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      {initial}
    </div>
  );
}
