# AI Usage Log

## Tugas 1 — Threat Modeling dan Analisis Risiko FindSeat

### AI yang digunakan
ChatGPT

### Tujuan penggunaan
AI digunakan untuk membantu menyusun threat modeling, identifikasi ancaman menggunakan metode STRIDE, analisis risiko, dan rancangan kontrol keamanan untuk produk FindSeat.

### Bagian yang dibantu AI
- Penyusunan inventaris aset dan data.
- Penyusunan arsitektur dan data flow.
- Identifikasi trust boundary.
- Identifikasi ancaman STRIDE.
- Penyusunan risk matrix.
- Penentuan lima risiko prioritas.
- Penyusunan rekomendasi kontrol keamanan.
- Penyusunan bahan demonstrasi.

### Validasi
Hasil dari AI diperiksa dan disesuaikan kembali dengan fitur serta kebutuhan produk FindSeat. Keputusan akhir mengenai ancaman, risiko, dan kontrol keamanan ditentukan oleh tim.

## Tugas 1 Kriptografi — AES-256-GCM

- **Alat:** ChatGPT.
- **Tujuan:** membantu menyusun desain komponen enkripsi/dekripsi, implementasi AES-256-GCM, pengujian otomatis, dan dokumentasi.
- **Ringkasan perintah:** meminta implementasi untuk rubrik tugas: kebutuhan kriptografi, masukan–proses–keluaran, sumber keacakan, minimal empat skenario tes, README, dan AI_LOG.
- **Bagian yang digunakan/diubah:** `lib/security/encryption.ts`, `tests/crypto.test.ts`, `docs/security/crypto-design.md`, dan bagian README kriptografi. Tinjau serta sesuaikan sebelum digabung ke repository.
- **Cara memeriksa:** jalankan `npm run test:crypto`; periksa round-trip, IV acak, modifikasi payload, kunci salah, panjang kunci tidak valid, dan JSON rusak.
- **Catatan:** tes memakai kunci acak dan data sintetis. Komponen belum terintegrasi otomatis dengan database/UI FindSeat. Mahasiswa harus memahami kode sebelum demonstrasi.
