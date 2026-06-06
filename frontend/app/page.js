'use client';

import dynamic from 'next/dynamic';

import { useDataSensor } from './hooks/useDataSensor';

import MeteranBulat from './components/MeteranBulat';

import {
  dapatkanWarnaBpm,
  dapatkanWarnaSpo2,
} from './utils/tema';

const GrafikGelombang = dynamic(
  () => import('./components/GrafikGelombang'),
  {
    ssr: false,
    loading: () => (
      <div className="h-[300px] flex items-center justify-center">
        <span className="text-slate-400 animate-pulse">
          Memuat grafik...
        </span>
      </div>
    ),
  }
);

export default function Dashboard() {
  const {
    dataGrafik,
    dataSaatIni,
    statusKoneksi,
  } = useDataSensor();

  const bpmTampil = statusKoneksi
    ? dataSaatIni.bpm
    : 0;

  const spo2Tampil = statusKoneksi
    ? dataSaatIni.spo2
    : 0;

  const warnaBpm =
    dapatkanWarnaBpm(bpmTampil);

  const warnaSpo2 =
    dapatkanWarnaSpo2(spo2Tampil);

  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-cyan-50 p-6 lg:p-10">

      <div className="max-w-7xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">

          <div>
            <h1 className="text-4xl font-bold text-slate-800">
              Smart Healthcare
            </h1>

            <p className="text-slate-500 mt-2">
              Monitoring BPM & SpO₂ secara realtime
            </p>
          </div>

          {/* STATUS */}

          <div className="mt-4 md:mt-0">

            <div
              className={`
                flex items-center gap-2
                px-4 py-2 rounded-full
                ${
                  statusKoneksi
                    ? 'bg-green-100'
                    : 'bg-red-100'
                }
              `}
            >
              <div
                className={`
                  w-3 h-3 rounded-full
                  ${
                    statusKoneksi
                      ? 'bg-green-500'
                      : 'bg-red-500'
                  }
                `}
              />

              <span
                className={`
                  text-sm font-medium
                  ${
                    statusKoneksi
                      ? 'text-green-700'
                      : 'text-red-700'
                  }
                `}
              >
                {statusKoneksi
                  ? 'Sensor Terhubung'
                  : 'Sensor Offline'}
              </span>
            </div>

          </div>

        </div>

        {/* CARD SENSOR */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">

          {/* BPM */}

          <div
            className="
              bg-white
              rounded-[32px]
              p-8
              border border-slate-100
              shadow-[0_10px_40px_rgba(0,0,0,0.05)]
            "
          >

            <div className="flex items-center gap-3 mb-4">

              <img
                src="/heart.svg"
                alt="Heart"
                className="w-8 h-8"
              />

              <h2 className="text-xl font-semibold text-slate-700">
                Detak Jantung
              </h2>

            </div>

            <MeteranBulat
              nilai={bpmTampil}
              min={40}
              max={160}
              warna={warnaBpm}
              label="BPM"
              satuan="bpm"
            />

          </div>

          {/* SPO2 */}

          <div
            className="
              bg-white
              rounded-[32px]
              p-8
              border border-slate-100
              shadow-[0_10px_40px_rgba(0,0,0,0.05)]
            "
          >

            <div className="flex items-center gap-3 mb-4">

              <img
                src="/lungs.svg"
                alt="Lungs"
                className="w-8 h-8"
              />

              <h2 className="text-xl font-semibold text-slate-700">
                Saturasi Oksigen
              </h2>

            </div>

            <MeteranBulat
              nilai={spo2Tampil}
              min={80}
              max={100}
              warna={warnaSpo2}
              label="SpO₂"
              satuan="%"
            />

          </div>

        </div>

        {/* GRAFIK */}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* BPM CHART */}

          <div
            className="
              bg-white
              rounded-[32px]
              p-8
              border border-slate-100
              shadow-[0_10px_40px_rgba(0,0,0,0.05)]
            "
          >

            <h2 className="text-xl font-semibold text-slate-700 mb-6">
              Grafik Detak Jantung
            </h2>

            <GrafikGelombang
              data={dataGrafik}
              dataKey="bpm"
              warna={warnaBpm}
            />

          </div>

          {/* SPO2 CHART */}

          <div
            className="
              bg-white
              rounded-[32px]
              p-8
              border border-slate-100
              shadow-[0_10px_40px_rgba(0,0,0,0.05)]
            "
          >

            <h2 className="text-xl font-semibold text-slate-700 mb-6">
              Grafik Saturasi Oksigen
            </h2>

            <GrafikGelombang
              data={dataGrafik}
              dataKey="spo2"
              warna={warnaSpo2}
            />

          </div>

        </div>

      </div>

    </main>
  );
}