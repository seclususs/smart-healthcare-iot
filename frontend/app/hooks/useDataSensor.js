'use client';
import { useState, useEffect } from 'react';
import mqtt from 'mqtt';

export function useDataSensor() {
  const [dataGrafik, setDataGrafik] = useState([]);
  const [dataSaatIni, setDataSaatIni] = useState({ bpm: 0, spo2: 0 });
  const [statusKoneksi, setStatusKoneksi] = useState(false);

  useEffect(() => {
    const ambilRiwayat = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vitals`);
        const riwayat = await res.json();

        const riwayatDifermat = riwayat.reverse().map((item) => ({
          waktu: new Date(item.created_at).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          bpm: item.bpm,
          spo2: item.spo2,
        }));

        setDataGrafik(riwayatDifermat);

        if (riwayatDifermat.length > 0) {
          const dataTerakhir = riwayatDifermat[riwayatDifermat.length - 1];
          setDataSaatIni({ bpm: dataTerakhir.bpm, spo2: dataTerakhir.spo2 });
        }
      } catch (error) {
        console.error('Gagal mengambil riwayat API:', error);
      }
    };

    ambilRiwayat();

    const client = mqtt.connect(process.env.NEXT_PUBLIC_MQTT_BROKER_URL);

    client.on('connect', () => {
      setStatusKoneksi(true);
      client.subscribe(process.env.NEXT_PUBLIC_MQTT_TOPIC);
    });

    client.on('offline', () => setStatusKoneksi(false));
    client.on('close', () => setStatusKoneksi(false));
    client.on('error', () => setStatusKoneksi(false));

    client.on('message', (topic, message) => {
      try {
        const payload = JSON.parse(message.toString());
        const timestamp = new Date().toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
        });

        const titikDataBaru = {
          waktu: timestamp,
          bpm: payload.bpm,
          spo2: payload.spo2,
        };

        setDataSaatIni({
          bpm: payload.bpm,
          spo2: payload.spo2,
        });

        setDataGrafik((dataLama) => {
          const dataDiperbarui = [...dataLama, titikDataBaru];
          return dataDiperbarui.slice(-20);
        });
      } catch (error) {
        console.error('Format payload MQTT tidak valid');
      }
    });

    return () => {
      client.end();
    };
  }, []);

  return { dataGrafik, dataSaatIni, statusKoneksi };
}
