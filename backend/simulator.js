require('dotenv').config();
const mqtt = require('mqtt');

const MQTT_BROKER = process.env.MQTT_BROKER_URL;

console.log('Menghubungkan ke broker..');
const client = mqtt.connect(MQTT_BROKER);

client.on('connect', () => {
  console.log('Simulator terhubung ke MQTT Broker');
  console.log('Memulai pengiriman data stream.. (Tekan Ctrl+C untuk mematikan)');

  let currentBPM = 20;
  let currentSpO2 = 1;

  let isFingerOn = true;
  let fingerPlacedAt = Date.now();

  setInterval(() => {
    isFingerOn = !isFingerOn;
    if (isFingerOn) {
      fingerPlacedAt = Date.now();
    }
  }, 25000);

  setInterval(() => {
    if (!isFingerOn) return;

    const timeSincePlaced = Date.now() - fingerPlacedAt;
    const isBufferFilled = timeSincePlaced >= 4000;

    const bpmChange = Math.floor(Math.random() * 41) - 20;
    const spo2Change = Math.floor(Math.random() * 21) - 10;

    currentBPM = Math.max(20, Math.min(225, currentBPM + bpmChange));
    currentSpO2 = Math.max(1, Math.min(100, currentSpO2 + spo2Change));

    const bpmPayload = currentBPM.toString();
    const spo2Payload = currentSpO2.toString();

    client.publish('sensor/bpm', bpmPayload, () => {
      console.log(`[sensor/bpm]  => ${bpmPayload} BPM`);
    });

    if (isBufferFilled) {
      client.publish('sensor/spo2', spo2Payload, () => {
        console.log(`[sensor/spo2] => ${spo2Payload}%`);
      });
    }
  }, 1000);
});
