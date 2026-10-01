'use client';

import React from 'react';

interface BpsLogoProps {
  className?: string;
  size?: number | 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  subtext?: string;
  textVariant?: 'white' | 'dark' | 'auto';
}

const sizeMap = {
  sm: 28,
  md: 40,
  lg: 56,
  xl: 72,
};

export default function BpsLogo({
  className = '',
  size = 'md',
  showText = false,
  subtext = 'KABUPATEN OKU SELATAN',
  textVariant = 'dark',
}: BpsLogoProps) {
  const pixelSize = typeof size === 'number' ? size : sizeMap[size];

  const textColorClass =
    textVariant === 'white'
      ? 'text-white'
      : textVariant === 'dark'
      ? 'text-dark-800'
      : 'text-dark-800 dark:text-white';

  const subtextColorClass =
    textVariant === 'white'
      ? 'text-white/70'
      : textVariant === 'dark'
      ? 'text-dark-400'
      : 'text-dark-400 dark:text-white/60';

  return (
    <div className={`inline-flex items-center gap-3 ${className}`}>
      {/* Logo BPS Image with reliable local SVG asset */}
      <div
        className="flex-shrink-0 flex items-center justify-center"
        style={{ width: pixelSize, height: pixelSize }}
      >
        <img
          src="/images/logo-bps.svg"
          alt="Logo Badan Pusat Statistik (BPS)"
          width={pixelSize}
          height={pixelSize}
          className="w-full h-full object-contain filter drop-shadow-sm transition-transform hover:scale-105 duration-200"
          loading="eager"
        />
      </div>

      {showText && (
        <div className="flex flex-col leading-tight">
          <div className="flex items-center gap-1.5">
            <span className={`font-extrabold text-sm tracking-wider uppercase ${textColorClass}`}>
              BADAN PUSAT STATISTIK
            </span>
          </div>
          {subtext && (
            <span className={`text-[10px] tracking-widest font-semibold uppercase ${subtextColorClass}`}>
              {subtext}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
