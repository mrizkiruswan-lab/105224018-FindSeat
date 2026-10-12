# FindSeat

FindSeat adalah aplikasi web untuk membantu pengguna mencari tempat duduk yang tersedia di fasilitas umum, seperti perpustakaan, ruang belajar bersama, dan coworking space.

Pengguna dapat melihat daftar tempat, memeriksa denah tempat duduk, memilih kursi yang tersedia, dan melakukan simulasi check-in. Pada pengembangan keamanan, FindSeat juga memiliki komponen kriptografi awal untuk melindungi data sensitif menggunakan algoritma AES-256-GCM.

## Fitur

- **Daftar tempat:** menampilkan lokasi, kategori, dan informasi tempat.
- **Pencarian tempat:** mencari tempat berdasarkan informasi yang tersedia.
- **Denah kursi:** menampilkan status kursi tersedia, digunakan, dan ditinggalkan.
- **Pemilihan kursi:** memilih kursi yang masih tersedia.
- **Formulir check-in:** memvalidasi data pengguna sebelum menampilkan pesan simulasi check-in.
- **Desain responsif:** mendukung tampilan mobile, tablet, dan desktop.
- **Komponen kriptografi:** menyediakan fungsi enkripsi dan dekripsi data menggunakan AES-256-GCM, termasuk pemeriksaan integritas data.

## Teknologi

- Next.js
- React
- TypeScript
- Tailwind CSS
- Node.js `crypto` untuk komponen AES-256-GCM
- `tsx` untuk menjalankan pengujian otomatis TypeScript

## Persyaratan

- Node.js yang kompatibel dengan versi Next.js proyek ini.
- npm.

## Instalasi dan Menjalankan Aplikasi

1. Clone repository:

   ```bash
   git clone https://github.com/mrizkiruswan-lab/105224018-FindSeat.git
   ```

2. Masuk ke folder proyek:

   ```bash
   cd 105224018-FindSeat
   ```

3. Instal dependensi:

   ```bash
   npm install
   ```

4. Jalankan server pengembangan:

   ```bash
   npm run dev
   ```

5. Buka `http://localhost:3000` di browser.

## Kebutuhan Kriptografi

Komponen kriptografi awal FindSeat dirancang untuk melindungi data sensitif yang dipilih untuk dienkripsi. Tidak semua data perlu dienkripsi; pemilihan kontrol disesuaikan dengan kebutuhan keamanan data.

| Data | Tujuan keamanan | Prioritas |
|---|---|---|
| Metadata penggunaan kursi yang dipilih untuk perlindungan | Menjaga kerahasiaan dan integritas data | Tinggi |
| Data profil sintetis untuk demonstrasi | Menjaga kerahasiaan data | Tinggi |
| Data venue dan denah kursi | Menjaga integritas informasi | Sedang |
| Password akun | Menjaga kerahasiaan kredensial menggunakan password hashing, bukan enkripsi reversibel | Sangat tinggi |

## Rancangan Komponen Kriptografi

Komponen kriptografi FindSeat menggunakan AES-256-GCM dari modul `node:crypto` bawaan Node.js. Algoritma ini menyediakan enkripsi sekaligus autentikasi integritas data.

### Masukan

- Plaintext berupa string UTF-8.
- Kunci AES berukuran 256 bit atau 32 byte.

### Proses

1. Menghasilkan initialization vector (IV) acak sepanjang 12 byte menggunakan `randomBytes`.
2. Mengenkripsi plaintext menggunakan AES-256-GCM.
3. Menggunakan additional authenticated data (AAD) tetap, yaitu `findseat:sensitive-data:v1`.
4. Menghasilkan authentication tag sepanjang 16 byte untuk memverifikasi integritas data ketika dekripsi.

### Keluaran

Komponen menghasilkan payload JSON dengan struktur berikut:

- `version`: versi format payload.
- `algorithm`: algoritma yang digunakan.
- `iv`: initialization vector dalam format Base64URL.
- `ciphertext`: hasil enkripsi dalam format Base64URL.
- `tag`: authentication tag dalam format Base64URL.

Saat dekripsi, komponen memvalidasi struktur payload dan authentication tag. Jika data dimodifikasi atau kunci salah, proses dekripsi ditolak.

### Sumber Keacakan dan Pengelolaan Kunci

IV dibuat menggunakan `randomBytes` dari modul `node:crypto`, yang menggunakan sumber keacakan kriptografis dari runtime dan sistem operasi.

Kunci enkripsi dibaca dari environment variable `FINDSEAT_ENCRYPTION_KEY`, berupa Base64 yang merepresentasikan tepat 32 byte. Kunci harus disimpan secara aman dan tidak boleh ditulis langsung di source code atau dimasukkan ke repository publik.

Komponen ini hanya digunakan di sisi server. Kunci tidak boleh dikirim ke browser atau diimpor ke Client Component.

Dokumentasi rancangan lengkap tersedia pada [`docs/security/crypto-design.md`](docs/security/crypto-design.md).

## Pengujian Otomatis Kriptografi

Pengujian menggunakan data sintetis dan kunci acak sementara. Pengujian tidak memerlukan kunci dari `.env.local`.

Jalankan pengujian:

```bash
npm run test:crypto
```

Skenario pengujian meliputi:

1. **Round-trip:** data berhasil dienkripsi dan dikembalikan melalui dekripsi.
2. **IV acak:** dua enkripsi atas plaintext yang sama menghasilkan IV berbeda.
3. **Integritas data:** payload yang dimodifikasi ditolak.
4. **Kunci salah:** payload tidak dapat didekripsi menggunakan kunci yang berbeda.
5. **Validasi panjang kunci:** kunci dengan panjang selain 32 byte ditolak.
6. **Payload tidak valid:** JSON yang rusak ditolak.

Hasil pengujian harus diverifikasi melalui keluaran terminal sebelum dilaporkan sebagai berhasil.

## Pemeriksaan Kualitas

Jalankan ESLint:

```bash
npm run lint
```

Jalankan production build:

```bash
npm run build
```

Jalankan pengujian kriptografi:

```bash
npm run test:crypto
```

Pengujian manual sebelumnya mencakup fitur pencarian tempat, pemilihan kursi, validasi formulir, dan tampilan responsif. Audit Lighthouse Accessibility juga telah dilakukan dengan hasil yang memenuhi target minimal 85.

## Batasan Versi 0.1

FindSeat menggunakan data simulasi. Check-in belum terhubung ke backend atau basis data, dan status kursi belum diperbarui secara real-time. Fitur temporary leave dan auto release juga belum diimplementasikan.

Komponen AES-256-GCM merupakan implementasi kriptografi awal yang dapat dijalankan dan diuji secara mandiri. Komponen ini belum terintegrasi otomatis dengan penyimpanan data aplikasi atau basis data FindSeat.

Enkripsi AES-256-GCM tidak menggantikan autentikasi, otorisasi, HTTPS/TLS, atau password hashing. Data password harus dilindungi menggunakan algoritma password hashing yang sesuai, bukan enkripsi reversibel.

## Pengembangan Berikutnya

- Integrasi backend dan basis data.
- Pembaruan status kursi secara real-time.
- Implementasi fitur temporary leave dan auto release.
- Pengelolaan check-in dan check-out pengguna.
- Integrasi komponen kriptografi dengan penyimpanan data yang memang membutuhkan perlindungan.
- Pengelolaan kunci yang aman, termasuk rotasi kunci dan prosedur pemulihan.

## Pengembang

- **Nama:** M Rizki Ruswan (105224018)
- **Program Studi:** Ilmu Komputer
- **Universitas:** Universitas Pertamina

## Catatan Penggunaan AI

Penggunaan AI dalam pengembangan FindSeat dicatat pada [`AI_LOG.md`](AI_LOG.md). Catatan tersebut mencakup bantuan untuk threat modeling, analisis risiko, rancangan kriptografi, implementasi, dokumentasi, dan pengujian.

Seluruh implementasi harus diperiksa dan dipahami oleh pengembang sebelum dikumpulkan.