'use client';

import { useState, useEffect, useRef } from 'react';
import mqtt from 'mqtt';

export function useDataSensor() {
  const [dataGrafik, setDataGrafik] = useState([]);
  const [dataSaatIni, setDataSaatIni] = useState({
    bpm: 0,
    spo2: 0,
  });

  const [statusKoneksi, setStatusKoneksi] = useState(false);

  const bpmBuffer = useRef(null);

  useEffect(() => {
    const ambilRiwayat = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/vitals`
        );

        const history = await response.json();

        const formatted = history
          .reverse()
          .slice(-30)
          .map((item) => ({
            waktu: new Date(
              item.created_at
            ).toLocaleTimeString('id-ID', {
              hour: '2-digit',
              minute: '2-digit',
            }),

            bpm: Number(item.bpm),
            spo2: Number(item.spo2),
          }));

        setDataGrafik(formatted);

        if (formatted.length > 0) {
          const last =
            formatted[formatted.length - 1];

          setDataSaatIni({
            bpm: last.bpm,
            spo2: last.spo2,
          });
        }
      } catch (err) {
        console.error(
          'Gagal mengambil riwayat:',
          err
        );
      }
    };

    ambilRiwayat();

    const brokerUrl =
      process.env.NEXT_PUBLIC_MQTT_BROKER_URL;

    if (!brokerUrl) return;

    const client = mqtt.connect(brokerUrl, {
      reconnectPeriod: 3000,
      connectTimeout: 10000,
      clean: true,
    });

    client.on('connect', () => {
      console.log('MQTT Connected');

      setStatusKoneksi(true);

      client.subscribe([
        'sensor/bpm',
        'sensor/spo2',
      ]);
    });

    client.on('offline', () => {
      setStatusKoneksi(false);
    });

    client.on('close', () => {
      setStatusKoneksi(false);
    });

    client.on('error', (err) => {
      console.error(err);
      setStatusKoneksi(false);
    });

    client.on(
      'message',
      (topic, message) => {
        const value = parseFloat(
          message.toString()
        );

        if (isNaN(value)) return;

        const waktu =
          new Date().toLocaleTimeString(
            'id-ID',
            {
              hour: '2-digit',
              minute: '2-digit',
            }
          );

        if (topic === 'sensor/bpm') {
          bpmBuffer.current = value;

          setDataSaatIni((prev) => ({
            ...prev,
            bpm: value,
          }));
        }

        if (topic === 'sensor/spo2') {
          setDataSaatIni((prev) => ({
            ...prev,
            spo2: value,
          }));

          setDataGrafik((prev) => {
            const newPoint = {
              waktu,

              bpm:
                bpmBuffer.current ??
                dataSaatIni.bpm,

              spo2: value,
            };

            return [...prev, newPoint].slice(
              -30
            );
          });

          bpmBuffer.current = null;
        }
      }
    );

    return () => {
      client.end(true);
    };
  }, []);

  return {
    dataGrafik,
    dataSaatIni,
    statusKoneksi,
  };
}