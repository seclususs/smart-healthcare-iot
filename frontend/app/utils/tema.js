// ================================
// PALET WARNA DASHBOARD MEDIS
// ================================

export const TEMA = {
  background: '#F8FAFC',

  card: '#FFFFFF',

  border: '#E2E8F0',

  textPrimary: '#334155',

  textSecondary: '#64748B',

  success: '#58CC6B',

  info: '#21B6D7',

  warning: '#FFB84D',

  danger: '#FF6B6B',

  inactive: '#CBD5E1',

  gaugeBackground: '#EDF2F7',
};

// ================================
// WARNA BPM
// ================================

export const dapatkanWarnaBpm = (bpm) => {
  if (bpm === 0)
    return TEMA.inactive;

  // Bradycardia
  if (bpm < 60)
    return '#4A90E2';

  // Normal
  if (bpm >= 60 && bpm <= 100)
    return '#58CC6B';

  // Sedikit tinggi
  if (bpm <= 120)
    return '#FFB84D';

  // Tinggi
  return '#FF6B6B';
};

// ================================
// WARNA SPO2
// ================================

export const dapatkanWarnaSpo2 = (spo2) => {
  if (spo2 === 0)
    return TEMA.inactive;

  // Bahaya
  if (spo2 < 90)
    return '#FF6B6B';

  // Warning
  if (spo2 < 95)
    return '#FFB84D';

  // Normal
  return '#21B6D7';
};

// ================================
// WARNA STATUS KONEKSI
// ================================

export const dapatkanWarnaStatus = (status) => {
  return status
    ? '#58CC6B'
    : '#FF6B6B';
};

// ================================
// WARNA GRAFIK
// ================================

export const WARNA_GRAFIK = {
  bpm: {
    stroke: '#58CC6B',
    fill: 'rgba(88,204,107,0.15)',
  },

  spo2: {
    stroke: '#21B6D7',
    fill: 'rgba(33,182,215,0.15)',
  },
};