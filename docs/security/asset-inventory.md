# Asset Inventory — FindSeat

## 1. Tujuan
Dokumen ini mencatat aset dan data yang perlu dilindungi pada FindSeat sebagai dasar identifikasi ancaman, penilaian risiko, dan pemilihan kontrol keamanan.

## 2. Daftar Aset

| ID Aset | Aset/Data | Contoh | Klasifikasi | Dampak jika terganggu |
|---|---|---|---|---|
| A-01 | Akun pengguna dan kredensial | Nama, email, password hash | Sensitif | Pengambilalihan akun |
| A-02 | Session dan token autentikasi | Session cookie, token | Sangat sensitif | Session hijacking |
| A-03 | Data profil pengguna | User ID, nama, email | Sensitif | Kebocoran privasi |
| A-04 | Data venue | Nama tempat, ruangan | Internal | Perubahan data fasilitas |
| A-05 | Data kursi | ID kursi, lokasi, status | Internal | Manipulasi ketersediaan kursi |
| A-06 | Data penggunaan kursi | User ID, kursi, waktu check-in/out | Sensitif | Pelacakan aktivitas pengguna |
| A-07 | Data temporary leave | Waktu mulai dan batas waktu | Internal/Sensitif | Kursi ditahan tanpa hak |
| A-08 | Akun dan hak akses administrator | Akun admin, role | Sangat sensitif | Pengambilalihan kontrol sistem |
| A-09 | Audit log | Login, check-in, perubahan data | Internal | Hilangnya bukti aktivitas |
| A-10 | Konfigurasi dan secret | Konfigurasi API/database, secret | Rahasia | Kompromi sistem |
| A-11 | Statistik penggunaan | Okupansi dan pola penggunaan | Internal | Kebocoran informasi operasional |
| A-12 | Database FindSeat | Data aplikasi yang tersimpan | Sangat sensitif | Kebocoran atau kerusakan data |
| A-13 | Cadangan data | Backup database/log | Sangat sensitif | Kebocoran atau kehilangan data cadangan |

## 3. Aset Kritis
Prioritas perlindungan adalah A-01/A-02 (autentikasi), A-05 (status kursi), A-06/A-07 (penggunaan kursi dan temporary leave), A-08 (hak administrator), serta A-12/A-13 (database dan cadangan data).

## 4. Perlindungan Kriptografi yang Direncanakan

| Aset/Aliran | Kontrol yang direncanakan | Catatan |
|---|---|---|
| A-01 password | Password hashing dengan Argon2id atau bcrypt | Hashing bukan enkripsi yang dapat dibalik; jangan simpan password plaintext |
| A-02 session/token | Cookie aman dan pengelolaan session yang benar | Cookie `HttpOnly`, `Secure`, dan `SameSite` sesuai kebutuhan deployment |
| Data browser–aplikasi | HTTPS/TLS | Melindungi data selama transmisi |
| A-03/A-06 | Enkripsi data sensitif saat tersimpan jika diperlukan | Terapkan berdasarkan kebutuhan dan klasifikasi data |
| A-10 secret | Secret manager atau environment variable yang terlindungi | Jangan commit secret ke repository |
| A-12/A-13 | Enkripsi database/backup sesuai kemampuan platform | Kunci enkripsi disimpan terpisah dari data terenkripsi |

## 5. Batasan dan Validasi
Kontrol pada tabel di atas adalah rencana perlindungan, bukan klaim bahwa semuanya sudah diterapkan. Implementasi aktual harus diperiksa pada kode, konfigurasi, dan lingkungan deployment FindSeat.
