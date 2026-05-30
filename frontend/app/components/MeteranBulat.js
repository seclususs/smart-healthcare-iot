'use client';
import React from 'react';

export default function MeteranBulat({ nilai, min, max, warna, label, satuan }) {
  const radius = 60;
  const keliling = radius * Math.PI;
  const persentase = Math.max(0, Math.min(100, ((nilai - min) / (max - min)) * 100));
  const offsetGaris = keliling - (persentase / 100) * keliling;

  return (
    <div className="flex flex-col items-center justify-center relative w-48 h-32 mt-4">
      <svg className="w-full h-full" viewBox="0 0 140 80">
        {/* Latar Belakang Busur */}
        <path
          d="M 10 70 A 60 60 0 0 1 130 70"
          fill="none"
          stroke="#1e293b"
          strokeWidth="12"
          strokeLinecap="round"
        />

        {/* Indikator Nilai Utama */}
        <path
          d="M 10 70 A 60 60 0 0 1 130 70"
          fill="none"
          stroke={warna}
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={keliling}
          strokeDashoffset={offsetGaris}
          style={{ transition: 'stroke-dashoffset 0.3s linear, stroke 0.3s linear' }}
        />
      </svg>

      {/* Tampilan Nilai */}
      <div className="absolute bottom-1 flex flex-col items-center">
        <span className="text-4xl font-mono font-bold tracking-wider" style={{ color: warna }}>
          {nilai}
        </span>
        <span className="text-xs text-slate-400 font-mono mt-1">
          {label} ({satuan})
        </span>
      </div>
    </div>
  );
}
