'use client';
import { useDataSensor } from './hooks/useDataSensor';
import MeteranBulat from './components/MeteranBulat';
import dynamic from 'next/dynamic';
import { dapatkanWarnaBpm, dapatkanWarnaSpo2 } from './utils/tema';

const GrafikGelombang = dynamic(() => import('./components/GrafikGelombang'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[200px] flex items-center justify-center border border-slate-800/50">
      <span className="text-xs text-slate-600 animate-pulse">MEMUAT GRAFIK...</span>
    </div>
  ),
});

export default function Dashboard() {
  const { dataGrafik, dataSaatIni, statusKoneksi } = useDataSensor();

  const bpmTampil = statusKoneksi ? dataSaatIni.bpm : 0;
  const spo2Tampil = statusKoneksi ? dataSaatIni.spo2 : 0;

  const warnaBpm = dapatkanWarnaBpm(bpmTampil);
  const warnaSpo2 = dapatkanWarnaSpo2(spo2Tampil);

  return (
    <main className="min-h-screen bg-grid-pattern p-6 lg:p-12 font-mono">
      {/* NUMERIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Detak Jantung (BPM) */}
        <div className="bg-[#0f172a] border-2 border-slate-800 p-6 flex flex-col items-center relative">
          <div
            className="absolute top-4 left-4 w-6 h-6"
            style={{
              backgroundColor: warnaBpm,
              WebkitMaskImage: `url('/heart.svg')`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
            }}
          />

          <MeteranBulat
            nilai={bpmTampil}
            min={40}
            max={160}
            warna={warnaBpm}
            label="DETAK JANTUNG"
            satuan="BPM"
          />
        </div>

        {/* Saturasi Oksigen (SpO2) */}
        <div className="bg-[#0f172a] border-2 border-slate-800 p-6 flex flex-col items-center relative">
          <div
            className="absolute top-4 left-4 w-7 h-7"
            style={{
              backgroundColor: warnaSpo2,
              WebkitMaskImage: `url('/lungs.svg')`,
              WebkitMaskSize: 'contain',
              WebkitMaskRepeat: 'no-repeat',
            }}
          />

          <MeteranBulat
            nilai={spo2Tampil}
            min={80}
            max={100}
            warna={warnaSpo2}
            label="KADAR OKSIGEN"
            satuan="%"
          />
        </div>
      </div>

      {/* Visualisasi Grafik */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grafik Gelombang BPM */}
        <div className="bg-[#0f172a] border-2 border-slate-800 p-6">
          <div className="flex justify-between items-end mb-4 border-b border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-slate-400 tracking-wider">
              GRAFIK DETAK JANTUNG
            </h2>
          </div>
          <GrafikGelombang data={dataGrafik} dataKey="bpm" warna={warnaBpm} />
        </div>

        {/* Grafik Gelombang SpO2 */}
        <div className="bg-[#0f172a] border-2 border-slate-800 p-6">
          <div className="flex justify-between items-end mb-4 border-b border-slate-800 pb-2">
            <h2 className="text-sm font-bold text-slate-400 tracking-wider">
              GRAFIK OKSIGEN DARAH
            </h2>
          </div>
          <GrafikGelombang data={dataGrafik} dataKey="spo2" warna={warnaSpo2} />
        </div>
      </div>
    </main>
  );
}
