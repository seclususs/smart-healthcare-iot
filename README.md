## Setup Backend
1. Masuk ke folder `backend` lalu jalankan `npm install`.
2. Copy file `.env.example` menjadi `.env`. Kalau pakai XAMPP, biasanya konfigurasi default dengan password kosong sudah bisa langsung dipakai.
3. Pastikan service MySQL/XAMPP udah nyala, lalu jalankan `npm run init-db` untuk bikin database dan tabel.
4. Jalankan `npm run dev`.

## Setup Frontend
1. Buka terminal baru, masuk ke folder `frontend` lalu jalankan `npm install`.
2. Copy file `.env.example` menjadi `.env.local`.
3. Jalankan `npm run dev`.

## Menjalankan Simulator (Testing Tanpa Hardware)
Karena kita testing tanpa alat fisik, gunakan simulator untuk mengirim data dummy MQTT.
1. Buka terminal baru, masuk ke folder `backend`.
2. Jalankan `node simulator.js`.

Aplikasi bisa dibuka di http://localhost:3000.
