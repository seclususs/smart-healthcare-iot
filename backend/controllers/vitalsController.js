const VitalsService = require('../services/vitalsService');

const ambilDataVitals = async (req, res) => {
  try {
    const data = await VitalsService.ambilRiwayatVitals(20);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'Gagal mengambil riwayat data', detail: error.message });
  }
};

module.exports = { ambilDataVitals };
