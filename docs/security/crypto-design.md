# Rancangan Komponen Kriptografi — FindSeat

## Tujuan
Mendemonstrasikan enkripsi terautentikasi untuk data sensitif sintetis menggunakan AES-256-GCM dari modul `node:crypto` bawaan Node.js. Komponen ini belum otomatis mengenkripsi seluruh data database FindSeat.

## Kebutuhan kriptografi

| Data | Tujuan keamanan | Prioritas |
|---|---|---|
| Metadata penggunaan kursi yang dipilih untuk perlindungan | Kerahasiaan dan integritas | Tinggi |
| Data profil sintetis demonstrasi | Kerahasiaan | Tinggi |
| Data venue dan denah kursi publik | Integritas; tidak selalu memerlukan enkripsi | Sedang |
| Password akun | Password hashing, bukan enkripsi reversibel | Sangat tinggi |

## Masukan–proses–keluaran
- **Masukan:** string UTF-8 dan kunci AES 256-bit (32 byte).
- **Proses:** buat IV 12 byte dengan `randomBytes`; enkripsi AES-256-GCM; gunakan AAD `findseat:sensitive-data:v1`; hasilkan authentication tag 16 byte.
- **Keluaran:** JSON `version`, `algorithm`, `iv`, `ciphertext`, `tag`; byte direpresentasikan sebagai Base64URL.
- **Dekripsi:** validasi format, autentikasi tag, dan pulihkan plaintext. Payload yang diubah atau kunci salah ditolak.

## Keacakan dan kunci
IV dibuat oleh `randomBytes` dari `node:crypto` yang menggunakan sumber keacakan kriptografis runtime/OS. Kunci dibaca dari `FINDSEAT_ENCRYPTION_KEY`, berupa Base64 dari tepat 32 byte. Buat kunci lokal dengan `node -e "console.log(require('node:crypto').randomBytes(32).toString('base64'))"` dan simpan hanya di `.env.local` yang tidak di-commit. Untuk deployment, gunakan secret manager.

## Batasan
Modul hanya untuk server; jangan impor ke Client Component atau mengirim kunci ke browser. Password tidak boleh dilindungi dengan enkripsi reversibel. AES-GCM tidak menggantikan autentikasi, otorisasi, HTTPS/TLS, atau password hashing. Kode ini belum terintegrasi otomatis dengan database FindSeat.

## Pengujian
Jalankan `npm run test:crypto`. Tes meliputi round-trip, IV berbeda, payload dimodifikasi, kunci salah, panjang kunci tidak valid, dan JSON rusak. Semua tes menggunakan data sintetis.
