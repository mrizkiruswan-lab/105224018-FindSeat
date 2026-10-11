# FindSeat

FindSeat adalah aplikasi web untuk membantu pengguna mencari tempat duduk yang tersedia di fasilitas umum, seperti perpustakaan, ruang belajar bersama, dan coworking space.

Pengguna dapat melihat daftar tempat, memeriksa denah tempat duduk, memilih kursi yang tersedia, dan melakukan simulasi check-in.

## Fitur

- **Daftar tempat:** menampilkan lokasi, kategori, dan informasi tempat.
- **Pencarian tempat:** mencari tempat berdasarkan informasi yang tersedia.
- **Denah kursi:** menampilkan status kursi tersedia, digunakan, dan ditinggalkan.
- **Pemilihan kursi:** memilih kursi yang masih tersedia.
- **Formulir check-in:** memvalidasi data pengguna sebelum menampilkan pesan simulasi check-in.
- **Desain responsif:** mendukung tampilan mobile, tablet, dan desktop.

## Teknologi

- Next.js
- React
- TypeScript
- Tailwind CSS

## Persyaratan

- Node.js yang kompatibel dengan versi Next.js proyek ini.
- npm.

## Instalasi dan Menjalankan Aplikasi

1. Clone repository:

   ```bash
   https://github.com/mrizkiruswan-lab/105224018-FindSeat.git
   ```

2. Masuk ke folder proyek:

   ```bash
   cd findseat-web
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

## Pemeriksaan Kualitas

Jalankan ESLint:

```bash
npm run lint
```

Jalankan production build:

```bash
npm run build
```

Pengujian manual dilakukan pada fitur pencarian tempat, pemilihan kursi, validasi formulir, dan tampilan responsif. Audit Lighthouse Accessibility juga dilakukan dengan hasil yang memenuhi target minimal 85.

## Batasan Versi 0.1

FindSeat pada versi ini menggunakan data simulasi. Check-in belum terhubung ke backend atau basis data. Status kursi belum diperbarui secara real-time, sedangkan fitur temporary leave dan auto release belum diimplementasikan.

## Pengembangan Berikutnya

- Integrasi backend dan basis data.
- Pembaruan status kursi secara real-time.
- Fitur temporary leave dan auto release.
- Pengelolaan check-in dan check-out pengguna.

## Pengembang

Nama: M Rizki Ruswan (105224018)
Program Studi: Ilmu Komputer
Universitas: Universitas Pertamina
