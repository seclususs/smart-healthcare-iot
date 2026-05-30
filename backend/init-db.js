require('dotenv').config();
const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function inisiasiDatabase() {
  try {
    console.log('Menghubungkan..');

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      multipleStatements: true,
    });

    const schemaPath = path.join(__dirname, '../database/schema.sql');
    const sqlQuery = fs.readFileSync(schemaPath, 'utf8');

    console.log('mengeksekusi file schema..');
    await connection.query(sqlQuery);
    console.log('Database dan tabel diinisialisasi');

    await connection.end();
    process.exit(0);
  } catch (error) {
    console.error('Gagal menginisialisasi database:', error.message);
    process.exit(1);
  }
}

inisiasiDatabase();
