require('dotenv').config();
const express = require('express');
const cors = require('cors');
const mqtt = require('mqtt');
const vitalsRoutes = require('./routes/vitalsRoutes');
const { simpanDataVitals } = require('./controllers/vitalsController');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MQTT_BROKER = process.env.MQTT_BROKER_URL;
const MQTT_TOPIC = process.env.MQTT_TOPIC;

app.use('/api/vitals', vitalsRoutes);
const mqttClient = mqtt.connect(MQTT_BROKER);

mqttClient.on('connect', () => {
  console.log(`Terhubung ke MQTT Broker: ${MQTT_BROKER}`);
  mqttClient.subscribe(MQTT_TOPIC, (err) => {
    if (!err) console.log(`Mendengarkan topik: ${MQTT_TOPIC}`);
  });
});

mqttClient.on('message', async (topic, message) => {
  if (topic === MQTT_TOPIC) {
    await simpanDataVitals(message.toString());
  }
});

app.listen(PORT, () => {
  console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});
