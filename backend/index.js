require('dotenv').config();
const express = require('express');
const cors = require('cors');
const vitalsRoutes = require('./routes/vitalsRoutes');
const MqttHandler = require('./mqtt/mqttHandler');

const app = express();
const PORT = process.env.PORT || 5000;
const mqttHandler = new MqttHandler();

app.use(cors());
app.use(express.json());
app.use('/api/vitals', vitalsRoutes);

mqttHandler.connect();

app.listen(PORT, () => {
  console.log(`Server Backend berjalan di http://localhost:${PORT}`);
});
