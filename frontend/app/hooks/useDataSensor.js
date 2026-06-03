'use client';
import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

export function useDataSensor() {
  const [dataGrafik, setDataGrafik] = useState([]);
  const [dataSaatIni, setDataSaatIni] = useState({ bpm: 0, spo2: 0 });
  const [statusKoneksi, setStatusKoneksi] = useState(false);
  const bufferBpm = useRef(null);

  useEffect(() => {
    const ambilRiwayat = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vitals`);
        const history = await res.json();

        const formattedHistory = history.reverse().map((item) => ({
          waktu: new Date(item.created_at).toLocaleTimeString('id-ID', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          bpm: item.bpm,
          spo2: item.spo2,
        }));

        setDataGrafik(formattedHistory);

        if (formattedHistory.length > 0) {
          const lastData = formattedHistory[formattedHistory.length - 1];
          setDataSaatIni({ bpm: lastData.bpm, spo2: lastData.spo2 });
        }
      } catch (error) {
        console.error('Gagal mengambil riwayat API:', error);
      }
    };

    ambilRiwayat();

    const brokerUrl = process.env.NEXT_PUBLIC_MQTT_BROKER_URL;
    if (!brokerUrl) return;

    const client = mqtt.connect(brokerUrl);

    client.on('connect', () => {
      setStatusKoneksi(true);
      client.subscribe(['sensor/bpm', 'sensor/spo2']);
    });

    client.on('offline', () => setStatusKoneksi(false));
    client.on('close', () => setStatusKoneksi(false));
    client.on('error', () => setStatusKoneksi(false));

    client.on('message', (topic, message) => {
      const value = parseFloat(message.toString());
      if (isNaN(value) || value === 0) return;

      const timestamp = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      if (topic === 'sensor/bpm') {
        bufferBpm.current = value;
        setDataSaatIni((prev) => ({ ...prev, bpm: value }));
      } else if (topic === 'sensor/spo2') {
        setDataSaatIni((prev) => ({ ...prev, spo2: value }));

        setDataGrafik((prevData) => {
          const lastBpm = prevData.length > 0 ? prevData[prevData.length - 1].bpm : 0;

          const newPoint = {
            waktu: timestamp,
            bpm: bufferBpm.current !== null ? bufferBpm.current : lastBpm,
            spo2: value,
          };

          return [...prevData, newPoint].slice(-20);
        });

        bufferBpm.current = null;
      }
    });

    return () => {
      client.end();
    };
  }, []);

  return { dataGrafik, dataSaatIni, statusKoneksi };
}
