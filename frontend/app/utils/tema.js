export const dapatkanWarnaBpm = (bpm) => {
  if (bpm === 0) return '#475569';
  if (bpm < 60) return '#3b82f6';
  if (bpm > 100) return '#ef4444';
  return '#22c55e';
};

export const dapatkanWarnaSpo2 = (spo2) => {
  if (spo2 === 0) return '#475569';
  if (spo2 < 90) return '#ef4444';
  if (spo2 < 95) return '#f59e0b';
  return '#06b6d4';
};
