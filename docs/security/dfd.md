# Data Flow Diagram (DFD) — FindSeat

## 1. Tujuan
Dokumen ini menjelaskan komponen utama FindSeat, aliran data, trust boundary, serta aset yang perlu dilindungi. Diagram visual saat ini tersedia di `assets/dfd-findseat.png`.

## 2. ID Elemen DFD

| ID | Elemen | Jenis | Data/Peran |
|---|---|---|---|
| E-01 | Pengguna (mahasiswa/pengunjung) | Entitas eksternal | Login, melihat venue/denah, memilih kursi, check-in/out, temporary leave |
| E-02 | Admin/pengelola tempat | Entitas eksternal | Mengelola venue/kursi/pengguna dan melihat dashboard |
| P-01 | Aplikasi web FindSeat (Next.js) | Proses | Validasi request, autentikasi/otorisasi, pengelolaan kursi dan venue |
| P-02 | Scheduler / Auto Release | Proses | Memeriksa batas waktu temporary leave dan melepas kursi |
| DS-01 | PostgreSQL | Data store | Data pengguna, venue, kursi, penggunaan, dan log |
| DS-02 | Backup / Storage | Data store eksternal | Cadangan data atau log |
| D-01 | Data akun dan autentikasi | Aset data | A-01, A-02 |
| D-02 | Data profil pengguna | Aset data | A-03 |
| D-03 | Data venue dan kursi | Aset data | A-04, A-05 |
| D-04 | Data penggunaan/temporary leave | Aset data | A-06, A-07 |
| D-05 | Audit log | Aset data | A-09 |
| D-06 | Konfigurasi/secret | Aset data | A-10 |
| D-07 | Statistik penggunaan | Aset data | A-11 |
| D-08 | Data cadangan | Aset data | A-13 |

## 3. Aliran Data

| ID Aliran | Sumber → Tujuan | Data yang Mengalir | Pemeriksaan/Perlindungan |
|---|---|---|---|
| F-01 | E-01 → P-01 | Kredensial dan request pengguna | HTTPS/TLS; validasi input; autentikasi |
| F-02 | P-01 → E-01 | Status kursi, informasi venue, hasil request | Batasi data yang ditampilkan; otorisasi |
| F-03 | E-02 → P-01 | Request pengelolaan venue/kursi/pengguna | HTTPS/TLS; autentikasi dan otorisasi admin |
| F-04 | P-01 → E-02 | Dashboard dan statistik | Otorisasi role admin |
| F-05 | P-01 ↔ DS-01 | Data akun, venue, kursi, penggunaan, dan log | Kredensial database terlindungi; hak akses minimum |
| F-06 | P-01 ↔ DS-02 | Data backup/log | Batasi akses; enkripsi backup bila tersedia |
| F-07 | P-02 ↔ DS-01 | Waktu temporary leave dan pembaruan status kursi | Akses scheduler dibatasi; perubahan status tervalidasi |
| F-08 | P-01 → DS-01 | Catatan audit aktivitas penting | Log dilindungi dari perubahan tidak sah |

## 4. Trust Boundary

- **TB-01 — Client ↔ aplikasi:** E-01/E-02 berada di luar batas kepercayaan aplikasi. Semua input client dianggap tidak tepercaya.
- **TB-02 — aplikasi ↔ database:** akses ke DS-01 harus menggunakan kredensial terlindungi dan hak akses minimum.
- **TB-03 — user ↔ admin:** user biasa tidak boleh menjalankan fungsi pengelola. Otorisasi wajib diperiksa di server.
- **TB-04 — scheduler ↔ aplikasi/database:** P-02 hanya boleh melakukan operasi yang dibutuhkan untuk auto release.

## 5. Aset yang Memerlukan Perlindungan Kriptografi

- **C-01 — HTTPS/TLS:** lindungi aliran F-01 sampai F-04 selama transmisi melalui jaringan.
- **C-02 — Password hashing:** lindungi kredensial A-01/D-01 dengan Argon2id atau bcrypt; password tidak disimpan dalam bentuk plaintext.
- **C-03 — Enkripsi data tersimpan/backup:** evaluasi penerapan pada A-03, A-06, A-12, dan A-13 berdasarkan kebutuhan serta kemampuan deployment.
- **C-04 — Secret management:** lindungi A-10; secret tidak boleh disimpan di repository publik.

## 6. Catatan Konsistensi
Diagram visual yang ada merupakan diagram konteks/arsitektur tingkat tinggi. Tabel ID dan aliran di dokumen ini memberikan identitas yang dapat dirujuk oleh threat model. Perbarui gambar visual dengan label ID yang sama sebelum pengumpulan agar ID juga terlihat langsung pada diagram.
