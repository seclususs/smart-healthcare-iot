const mqtt = require('mqtt');
const VitalsService = require('../services/vitalsService');

class MqttHandler {
  constructor() {
    this.brokerUrl = process.env.MQTT_BROKER_URL;
    this.topics = ['sensor/bpm', 'sensor/spo2'];
    this.buffer = { bpm: null, spo2: null };
    this.client = null;
    this.flushTimeout = null;
  }

  connect() {
    this.client = mqtt.connect(this.brokerUrl);

    this.client.on('connect', () => {
      console.log(`[MQTT] Terhubung ke Broker`);
      this.client.subscribe(this.topics, (err) => {
        if (!err) console.log(`[MQTT] Mendengarkan topik: ${this.topics.join(', ')}`);
      });
    });

    this.client.on('message', async (topic, message) => {
      await this.handleMessage(topic, message.toString());
    });

    this.client.on('error', (err) => {
      console.error('[MQTT] Terjadi kesalahan:', err.message);
    });
  }

  async handleMessage(topic, message) {
    const value = parseFloat(message);
    if (isNaN(value)) return;

    if (topic === 'sensor/bpm') {
      this.buffer.bpm = value;
    } else if (topic === 'sensor/spo2') {
      this.buffer.spo2 = value;
    }

    if (this.flushTimeout) clearTimeout(this.flushTimeout);

    if (this.buffer.bpm !== null && this.buffer.spo2 !== null) {
      const bpmToSave = this.buffer.bpm;
      const spo2ToSave = this.buffer.spo2;

      this.buffer.bpm = null;
      this.buffer.spo2 = null;

      try {
        const status = await VitalsService.simpanDataVitals(bpmToSave, spo2ToSave);
        if (status) {
          console.log(`[DB] Tersimpan: BPM=${bpmToSave}, SpO2=${spo2ToSave}%`);
        }
      } catch (error) {
        console.error('[DB] Gagal menyimpan data:', error.message);
      }
    } else {
      this.flushTimeout = setTimeout(() => {
        this.buffer.bpm = null;
        this.buffer.spo2 = null;
      }, 1500);
    }
  }
}

module.exports = MqttHandler;
