'use client';

import React from 'react';

export default function MeteranBulat({
  nilai,
  min,
  max,
  warna,
  label,
  satuan,
}) {
  const radius = 60;
  const keliling = radius * Math.PI;

  const persentase = Math.max(
    0,
    Math.min(
      100,
      ((nilai - min) / (max - min)) * 100
    )
  );

  const offsetGaris =
    keliling - (persentase / 100) * keliling;

  return (
    <div className="relative flex flex-col items-center justify-center w-full h-[220px]">

      <svg
        className="w-[320px] h-[180px]"
        viewBox="0 0 140 90"
      >
        {/* Background Arc */}
        <path
          d="M 10 70 A 60 60 0 0 1 130 70"
          fill="none"
          stroke="#EDF2F7"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Progress Arc */}
        <path
          d="M 10 70 A 60 60 0 0 1 130 70"
          fill="none"
          stroke={warna}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={keliling}
          strokeDashoffset={offsetGaris}
          style={{
            transition:
              'stroke-dashoffset .6s ease-out',
            filter: `drop-shadow(0px 4px 10px ${warna}55)`,
          }}
        />
      </svg>

      {/* Nilai */}
      <div className="absolute bottom-10 flex flex-col items-center">

        <span
          className="text-6xl font-bold"
          style={{
            color: warna,
          }}
        >
          {nilai}
        </span>

        <span className="mt-2 text-slate-500 text-lg font-medium tracking-wide">
          {label} ({satuan})
        </span>

      </div>
    </div>
  );
}