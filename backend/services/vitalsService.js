const db = require('../config/db');

class VitalsService {
  static async ambilRiwayatVitals(limit = 20) {
    const [rows] = await db.query(
      'SELECT * FROM vitals_monitoring ORDER BY created_at DESC LIMIT ?',
      [limit]
    );
    return rows;
  }

  static async simpanDataVitals(bpm, spo2) {
    if (!bpm || !spo2 || bpm === 0 || spo2 === 0) return;

    let statusKondisi = 'Normal';

    if (spo2 < 95) statusKondisi = 'Oksigen Rendah';
    else if (bpm > 100) statusKondisi = 'Detak Terlalu Cepat';
    else if (bpm < 60) statusKondisi = 'Detak Terlalu Lambat';

    const query = 'INSERT INTO vitals_monitoring (bpm, spo2, status_kondisi) VALUES (?, ?, ?)';
    await db.execute(query, [bpm, spo2, statusKondisi]);

    return statusKondisi;
  }
}

module.exports = VitalsService;
