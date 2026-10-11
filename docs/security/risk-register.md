# Risk Register — FindSeat

## 1. Metode Penilaian
Risk Score = Likelihood × Impact. Skala likelihood dan impact masing-masing 1–5. Nilai dan alasan berikut mengikuti penilaian pada `threat-model.md`; tinjau ulang apabila kondisi implementasi berubah.

## 2. Lima Risiko Prioritas

| ID Risiko | Ancaman | Elemen DFD | Aset Terdampak | Likelihood | Impact | Skor | Prioritas |
|---|---|---|---|---:|---:|---:|---|
| R-01 | Account/Session Takeover | E-01, P-01, DS-01 | A-01, A-02, A-03 | 4 | 5 | 20 | Kritis |
| R-02 | Manipulasi Status Kursi | E-01, P-01, DS-01 | A-05, A-06 | 4 | 5 | 20 | Kritis |
| R-03 | Penyalahgunaan Temporary Leave | E-01, P-01, P-02, DS-01 | A-05, A-07 | 4 | 4 | 16 | Tinggi |
| R-04 | Privilege Escalation | E-01, E-02, P-01 | A-04, A-05, A-08 | 3 | 5 | 15 | Tinggi |
| R-05 | Kebocoran Data Pengguna | P-01, DS-01, DS-02 | A-03, A-06, A-12, A-13 | 3 | 5 | 15 | Tinggi |

## 3. Alasan Penilaian

### R-01 — Account/Session Takeover (20)
**Likelihood 4:** aplikasi memakai akun dan session, yang dapat menjadi target pencurian kredensial atau token.  
**Impact 5:** penyerang dapat bertindak sebagai pengguna sah dan mengakses informasi yang diizinkan untuk akun tersebut.

### R-02 — Manipulasi Status Kursi (20)
**Likelihood 4:** request perubahan status kursi dapat dimanipulasi jika validasi hanya mengandalkan client.  
**Impact 5:** integritas status kursi terganggu dan dua pengguna dapat mengalami konflik penggunaan.

### R-03 — Penyalahgunaan Temporary Leave (16)
**Likelihood 4:** parameter waktu dapat disalahgunakan apabila batas durasi tidak ditentukan di server.  
**Impact 4:** kursi dapat tertahan lebih lama dari aturan yang dimaksud dan mengurangi ketersediaan bagi pengguna lain.

### R-04 — Privilege Escalation (15)
**Likelihood 3:** risiko muncul jika endpoint admin tidak memeriksa role dan izin di server.  
**Impact 5:** pengguna tanpa hak dapat mengubah venue, kursi, atau data pengelolaan.

### R-05 — Kebocoran Data Pengguna (15)
**Likelihood 3:** kesalahan otorisasi atau konfigurasi penyimpanan dapat membuka akses data kepada pihak yang tidak berhak.  
**Impact 5:** data profil dan riwayat penggunaan dapat menimbulkan dampak privasi.

## 4. Rencana Kontrol dan Pemetaan Tugas

| ID | Kontrol yang Direncanakan | Bukti/Verifikasi yang Diharapkan | Pemetaan |
|---|---|---|---|
| R-01 | Password hashing, login rate limiting, cookie `HttpOnly`/`Secure`/`SameSite`, session expiration | Uji password tidak tersimpan plaintext; uji batas login dan perilaku session | Tugas 2 atau Tugas 3 — konfirmasi dengan instruksi tugas berikutnya |
| R-02 | Validasi status di server, authorization, transaksi database, concurrency control | Uji kursi tidak dapat diambil dua pengguna dan request ilegal ditolak | Tugas 2 atau Tugas 3 — konfirmasi dengan instruksi tugas berikutnya |
| R-03 | Batas durasi ditentukan server, validasi kepemilikan kursi, auto release | Uji durasi di luar batas ditolak dan kursi dilepas saat waktu habis | Tugas 2 atau Tugas 3 — konfirmasi dengan instruksi tugas berikutnya |
| R-04 | RBAC dan pemeriksaan izin di setiap endpoint admin | Uji user biasa tidak dapat mengakses endpoint admin | Tugas 2 atau Tugas 3 — konfirmasi dengan instruksi tugas berikutnya |
| R-05 | Access control, HTTPS/TLS, data minimization, enkripsi data tersimpan bila diperlukan | Uji akses lintas pengguna ditolak; periksa konfigurasi transport dan penyimpanan | Tugas 2 atau Tugas 3 — konfirmasi dengan instruksi tugas berikutnya |

## 5. Status
Status seluruh kontrol pada dokumen ini adalah **direncanakan**, kecuali telah diterapkan dan diverifikasi secara terpisah. Jangan menyatakan kontrol sudah selesai hanya berdasarkan rencana.

## 6. Hubungan dengan Dokumen Lain
- `asset-inventory.md` mendefinisikan aset A-01 sampai A-13.
- `dfd.md` mendefinisikan elemen E-01, E-02, P-01, P-02, DS-01, dan DS-02.
- `threat-model.md` memuat daftar ancaman STRIDE dan penjelasan risiko.
- `AI_LOG.md` mencatat penggunaan AI dalam penyusunan dokumen.

**Milestone:** `sec-0.1 — Initial Threat Model & Risk Analysis`
