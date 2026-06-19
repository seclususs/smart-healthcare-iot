'use client';

import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

export function useDataSensor() {
  const [dataGrafik, setDataGrafik] = useState([]);
  const [dataSaatIni, setDataSaatIni] = useState({ bpm: 0, spo2: 0 });
  const [statusKoneksi, setStatusKoneksi] = useState(false);

  const latestData = useRef({ bpm: 0, spo2: 0 });
  const watchdogTimer = useRef(null);

  useEffect(() => {
    let client = null;

    const muatRiwayat = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/vitals`);
        if (response.ok) {
          const history = await response.json();
          const formatted = history
            .reverse()
            .slice(-30)
            .map((item) => ({
              waktu: new Date(item.created_at).toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit',
              }),
              bpm: Number(item.bpm),
              spo2: Number(item.spo2),
            }));

          setDataGrafik(formatted);
          if (formatted.length > 0) {
            const last = formatted[formatted.length - 1];
            setDataSaatIni({ bpm: last.bpm, spo2: last.spo2 });
            latestData.current = { bpm: last.bpm, spo2: last.spo2 };
          }
        }
      } catch (err) {
        console.warn('data historis gagal dimuat, melanjutkan ke mode real-time');
      }
    };

    const mulaiMQTT = () => {
      const brokerUrl = process.env.NEXT_PUBLIC_MQTT_BROKER_URL;
      if (!brokerUrl) return;

      client = mqtt.connect(brokerUrl, {
        reconnectPeriod: 3000,
        connectTimeout: 10000,
        clean: true,
      });

      client.on('connect', () => {
        console.log('MQTT Connected');
        setStatusKoneksi(true);
        client.subscribe(['sensor/bpm', 'sensor/spo2']);
      });

      client.on('offline', () => setStatusKoneksi(false));
      client.on('close', () => setStatusKoneksi(false));
      client.on('error', (err) => {
        console.error('MQTT Error:', err);
        setStatusKoneksi(false);
      });

      client.on('message', (topic, message) => {
        const value = parseFloat(message.toString());
        if (isNaN(value)) return;

        clearTimeout(watchdogTimer.current);
        watchdogTimer.current = setTimeout(() => {
          latestData.current = { bpm: 0, spo2: 0 };
          setDataSaatIni({ bpm: 0, spo2: 0 });
        }, 3000);

        if (topic === 'sensor/bpm') latestData.current.bpm = value;
        if (topic === 'sensor/spo2') latestData.current.spo2 = value;

        setDataSaatIni({ bpm: latestData.current.bpm, spo2: latestData.current.spo2 });
      });
    };

    muatRiwayat().finally(() => {
      mulaiMQTT();
    });

    const chartInterval = setInterval(() => {
      const waktu = new Date().toLocaleTimeString('id-ID', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });

      setDataGrafik((prev) => {
        const newPoint = {
          waktu,
          bpm: latestData.current.bpm,
          spo2: latestData.current.spo2,
        };
        return [...prev, newPoint].slice(-30);
      });
    }, 1000);

    return () => {
      if (client) client.end(true);
      clearTimeout(watchdogTimer.current);
      clearInterval(chartInterval);
    };
  }, []);

  return { dataGrafik, dataSaatIni, statusKoneksi };
}
