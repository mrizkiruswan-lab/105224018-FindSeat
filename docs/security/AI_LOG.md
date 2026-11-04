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

## Tugas 2 — Enkripsi Terautentikasi dan Integritas Data

### Penggunaan AI
- **Alat:** ChatGPT
- **Tujuan:** Membantu mengevaluasi implementasi AES-256-GCM, memperkuat validasi input, menyusun dokumentasi keputusan kriptografi, dan menambahkan skenario pengujian.
- **Bagian yang dibantu:** `docs/security/KEPUTUSAN.md`, `lib/security/encryption.ts`, dan `tests/crypto.test.ts`.

### Ringkasan Bantuan
1. Mengevaluasi penggunaan AES-256-GCM sebagai mekanisme AEAD.
2. Membantu menyusun dokumentasi parameter kriptografi, meliputi panjang kunci, nonce/IV, AAD, dan authentication tag.
3. Membantu memperkuat validasi format Base64URL, panjang kunci, struktur payload, dan ukuran data.
4. Membantu menambahkan pengujian manipulasi authentication tag.
5. Membantu mengevaluasi hasil pengujian otomatis.

### Verifikasi dan Hasil
Seluruh implementasi diperiksa dan diuji kembali secara lokal menggunakan perintah:

`npm run test:crypto`

Hasil pengujian:
- Total pengujian: 7
- Berhasil: 7
- Gagal: 0

Seluruh pengujian menggunakan data sintetis. Hasil akhir diverifikasi melalui terminal lokal.

### Tanggung Jawab Pengembang
Pengembang melakukan pemeriksaan, penyesuaian kode, menjalankan pengujian, dan memastikan implementasi sesuai dengan kebutuhan tugas.