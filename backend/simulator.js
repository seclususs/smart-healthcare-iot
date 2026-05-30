require('dotenv').config();
const mqtt = require('mqtt');

const MQTT_BROKER = process.env.MQTT_BROKER_URL;
const MQTT_TOPIC = process.env.MQTT_TOPIC;

console.log('Menghubungkan ke broker..');
const client = mqtt.connect(MQTT_BROKER);

client.on('connect', () => {
  console.log('Simulator terhubung ke MQTT Broker');
  console.log('Memulai pengiriman data stream.. (Tekan Ctrl+C untuk mematikan)');

  let currentBPM = 75;
  let currentSpO2 = 97;

  setInterval(() => {
    const bpmChange = Math.floor(Math.random() * 7) - 3;
    const spo2Change = Math.floor(Math.random() * 3) - 1;

    currentBPM = Math.max(50, Math.min(130, currentBPM + bpmChange));
    currentSpO2 = Math.max(85, Math.min(100, currentSpO2 + spo2Change));

    const payload = JSON.stringify({
      device_id: 'ESP32_SIMULATOR',
      bpm: currentBPM,
      spo2: currentSpO2,
    });

    client.publish(MQTT_TOPIC, payload, () => {
      console.log(`[${MQTT_TOPIC}] => BPM: ${currentBPM} | SpO2: ${currentSpO2}%`);
    });
  }, 2000);
});
