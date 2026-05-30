const db = require('../config/db');

const ambilDataVitals = async (req, res) => {
  try {
    const [barisData] = await db.query(
      'SELECT * FROM vitals_monitoring ORDER BY created_at DESC LIMIT 20'
    );
    res.json(barisData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const simpanDataVitals = async (stringPayload) => {
  try {
    const payload = JSON.parse(stringPayload);
    const { device_id, bpm, spo2 } = payload;
    if (!bpm || !spo2 || bpm === 0 || spo2 === 0) return;

    let statusKondisi = 'Normal';
    if (spo2 < 95) statusKondisi = 'Oksigen Rendah';
    else if (bpm > 100) statusKondisi = 'Detak Terlalu Cepat';
    else if (bpm < 60) statusKondisi = 'Detak Terlalu Lambat';

    const query = `INSERT INTO vitals_monitoring (device_id, bpm, spo2, status_kondisi) VALUES (?, ?, ?, ?)`;
    await db.execute(query, [device_id, bpm, spo2, statusKondisi]);

    console.log(
      `[DB] Data tersimpan [${device_id}]: BPM=${bpm}, Oksigen=${spo2}%, Status=${statusKondisi}`
    );
  } catch (error) {
    console.error('[DB] Gagal memproses data MQTT:', error.message);
  }
};

module.exports = {
  ambilDataVitals,
  simpanDataVitals,
};
