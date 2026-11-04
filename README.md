# FindSeat

FindSeat adalah aplikasi web untuk membantu pengguna mencari tempat duduk yang tersedia di fasilitas umum, seperti perpustakaan, ruang belajar bersama, dan coworking space.

Pengguna dapat melihat daftar tempat, memeriksa denah tempat duduk, memilih kursi yang tersedia, dan melakukan check-in. Pada pengembangan Milestone 2, FindSeat telah dilengkapi dengan backend dan database PostgreSQL sehingga pengelolaan data tempat, kursi, dan check-in dapat dilakukan secara persisten.

FindSeat dikembangkan secara bertahap mulai dari Milestone 1 (v0.1) hingga Milestone 2 (v0.2).

## Versi Produk

| Versi | Perkembangan |
|---|---|
| v0.1 | Pengembangan antarmuka web responsif, daftar tempat, denah kursi, dan simulasi check-in. |
| v0.2 | Integrasi logika server, PostgreSQL, Prisma ORM 7, CRUD Venue dan Seat, serta validasi server menggunakan Zod. |

## Fitur

- **Daftar tempat:** menampilkan lokasi, kategori, dan informasi tempat.
- **Pencarian tempat:** mencari tempat berdasarkan informasi yang tersedia.
- **Denah kursi:** menampilkan status kursi tersedia, digunakan, dan ditinggalkan.
- **Pemilihan kursi:** memilih kursi yang masih tersedia.
- **Check-in:** memproses check-in dan menyimpan catatan ke database.
- **CRUD Venue:** menambahkan, menampilkan, mengubah, dan menghapus data tempat.
- **CRUD Seat:** menambahkan, menampilkan, mengubah, dan menghapus data kursi.
- **Validasi server:** memvalidasi masukan menggunakan Zod sebelum diproses atau disimpan.
- **Relasi database:** menghubungkan Venue dengan Seat serta Seat dengan CheckIn.
- **Transaksi database:** menjaga konsistensi data ketika proses check-in berlangsung.
- **Desain responsif:** mendukung tampilan mobile, tablet, dan desktop.
- **Komponen kriptografi:** menyediakan fungsi enkripsi dan dekripsi data menggunakan AES-256-GCM, termasuk pemeriksaan integritas data.

## Teknologi

- Next.js 16 dengan App Router
- React 19
- TypeScript
- Tailwind CSS
- PostgreSQL 18
- Prisma ORM 7
- Zod
- Node.js `crypto` untuk komponen AES-256-GCM
- `tsx` untuk menjalankan script dan pengujian TypeScript

## Persyaratan

- Node.js yang kompatibel dengan versi proyek.
- npm.
- PostgreSQL.
- pgAdmin 4 (opsional, untuk pengelolaan database).

## Instalasi dan Menjalankan Aplikasi

### 1. Clone Repository

```bash
git clone https://github.com/mrizkiruswan-lab/105224018-FindSeat.git
```

### 2. Masuk ke Folder Proyek

```bash
cd 105224018-FindSeat
```

### 3. Instal Dependensi

```bash
npm install
```

### 4. Konfigurasi Environment

Buat file `.env` berdasarkan contoh konfigurasi:

```bash
cp .env.example .env
```

Sesuaikan `DATABASE_URL` dengan konfigurasi PostgreSQL lokal.

Contoh format:

```env
DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/findseat_db?schema=public"
FINDSEAT_ENCRYPTION_KEY="BASE64_32_BYTE_SECRET_KEY"
```

Ganti placeholder dengan konfigurasi lokal yang sesuai. Jangan mengunggah file `.env` atau kredensial sebenarnya ke repository.

### 5. Membuat Database

Buat database PostgreSQL dengan nama:

```text
findseat_db
```

### 6. Menjalankan Prisma Generate

```bash
npx prisma generate
```

Perintah tersebut digunakan untuk menghasilkan Prisma Client berdasarkan schema proyek.

### 7. Menjalankan Migration

```bash
npx prisma migrate dev
```

Perintah ini menerapkan migration yang tersedia pada database pengembangan.

### 8. Menjalankan Seed Data

```bash
npx prisma db seed
```

Perintah ini mengisi database dengan data sintetis yang telah disiapkan pada `prisma/seed.ts`.

Data awal terdiri dari tiga venue dan 74 kursi.

### 9. Menjalankan Aplikasi

```bash
npm run dev
```

Buka aplikasi melalui:

```text
http://localhost:3000
```

## Implementasi Backend dan Database

Pada Milestone 2 (v0.2), FindSeat menggunakan PostgreSQL sebagai penyimpanan data dan Prisma ORM 7 untuk mengelola interaksi antara aplikasi dan database.

### Struktur Database

Database FindSeat memiliki tiga model utama:

| Model | Fungsi |
|---|---|
| Venue | Menyimpan informasi tempat atau lokasi. |
| Seat | Menyimpan nomor, status, dan relasi kursi ke tempat. |
| CheckIn | Menyimpan catatan pengguna yang melakukan check-in. |

### Relasi Antartabel

- **Venue – Seat:** satu venue dapat memiliki banyak kursi (one-to-many).
- **Seat – CheckIn:** satu kursi dapat memiliki banyak catatan check-in (one-to-many).

Relasi menggunakan foreign key untuk menjaga konsistensi data. Penghapusan data yang masih memiliki relasi tertentu dibatasi menggunakan aturan `onDelete: Restrict`.

### Implementasi CRUD

Operasi CRUD telah diintegrasikan ke dalam antarmuka aplikasi.

**CRUD Venue**

- Create: menambahkan data venue.
- Read: menampilkan daftar venue dan informasi terkait.
- Update: memperbarui informasi venue.
- Delete: menghapus venue sesuai aturan relasi database.

**CRUD Seat**

- Create: menambahkan kursi pada venue.
- Read: menampilkan data kursi.
- Update: memperbarui nomor atau status kursi.
- Delete: menghapus kursi sesuai aturan relasi database.

### Server Actions dan Validasi

Server Actions digunakan untuk memproses operasi pengelolaan data dari sisi server.

Validasi masukan menggunakan Zod untuk memastikan data memenuhi ketentuan sebelum diproses atau disimpan.

Validasi mencakup:

- Kelengkapan informasi venue.
- Format dan nilai masukan.
- Nomor kursi berupa bilangan bulat positif.
- Pemilihan venue yang tersedia.
- Status kursi sesuai enum yang ditentukan.
- Keunikan kombinasi nomor kursi dan venue.

### Integrasi Check-In

Proses check-in menggunakan Server Action dan transaksi database.

Tahapan proses:

1. Sistem mencari kursi berdasarkan ID.
2. Sistem memeriksa keberadaan dan status kursi.
3. Sistem membuat catatan check-in.
4. Sistem memperbarui status kursi menjadi `digunakan`.
5. Sistem memperbarui halaman terkait menggunakan `revalidatePath`.

Transaksi digunakan agar perubahan catatan check-in dan status kursi tetap konsisten.

## Kebutuhan Kriptografi

Komponen kriptografi FindSeat dirancang untuk melindungi data sensitif yang dipilih untuk dienkripsi. Tidak semua data perlu dienkripsi; pemilihan kontrol disesuaikan dengan kebutuhan keamanan data.

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

Komponen menghasilkan payload JSON yang memuat:

- `version`: versi format payload.
- `algorithm`: algoritma yang digunakan.
- `iv`: initialization vector dalam format Base64URL.
- `ciphertext`: hasil enkripsi dalam format Base64URL.
- `tag`: authentication tag dalam format Base64URL.

Saat dekripsi, komponen memvalidasi struktur payload dan authentication tag. Jika data dimodifikasi atau kunci salah, proses dekripsi ditolak.

### Sumber Keacakan dan Pengelolaan Kunci

IV dibuat menggunakan `randomBytes` dari modul `node:crypto`, yang menggunakan sumber keacakan kriptografis dari runtime dan sistem operasi.

Kunci enkripsi dibaca dari environment variable `FINDSEAT_ENCRYPTION_KEY`, berupa Base64 yang merepresentasikan tepat 32 byte.

Kunci harus disimpan secara aman dan tidak boleh ditulis langsung di source code atau dimasukkan ke repository publik.

Komponen ini hanya digunakan di sisi server. Kunci tidak boleh dikirim ke browser atau diimpor ke Client Component.

Dokumentasi rancangan lengkap tersedia pada [`docs/security/crypto-design.md`](docs/security/crypto-design.md).

## Pengujian Otomatis Kriptografi

Pengujian menggunakan data sintetis dan kunci acak sementara.

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

Komponen kriptografi ini masih merupakan implementasi awal yang belum terintegrasi otomatis dengan penyimpanan data aplikasi.

## Pemeriksaan Kualitas

Jalankan pemeriksaan TypeScript:

```bash
npx tsc --noEmit
```

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

Pengujian aplikasi juga mencakup pengelolaan Venue dan Seat, integrasi database, check-in, pembatasan penghapusan berdasarkan relasi, dan rollback transaksi.

## Dokumentasi dan Bukti Implementasi

Dokumentasi praktikum dan bukti pengerjaan tersedia pada direktori `docs/praktikum/`.

Dokumentasi yang tersedia:

- [`docs/praktikum/modul-06.md`](docs/praktikum/modul-06.md)

Bukti implementasi tersimpan pada:

```text
docs/praktikum/evidence/
```

Screenshot tersebut mencakup:

- Konfigurasi database PostgreSQL.
- Prisma Studio dan migration.
- Create, Update, dan Delete Venue.
- Create, Update, dan Delete Seat.
- Check-in.
- Pembatasan penghapusan berdasarkan relasi.
- Pengujian rollback transaksi.

Bukti antarmuka Milestone 1 juga tersedia pada direktori `docs/bukti/`.

## Batasan Produk v0.2

Pada versi ini, FindSeat telah memiliki integrasi database dan pengelolaan data melalui CRUD serta Server Actions.

Namun, beberapa pengembangan lanjutan masih diperlukan:

- Autentikasi dan otorisasi pengguna belum diimplementasikan.
- Halaman administrasi masih digunakan untuk pengujian lokal dan belum dilindungi autentikasi admin.
- Pembaruan status kursi belum menggunakan mekanisme real-time.
- Fitur temporary leave dan auto release belum diimplementasikan.
- Komponen AES-256-GCM belum terintegrasi otomatis dengan penyimpanan data aplikasi atau database.

Aplikasi tidak boleh dipublikasikan sebagai layanan administrasi publik sebelum pengamanan akses diterapkan.

## Pengembangan Berikutnya

- Implementasi autentikasi dan otorisasi pengguna.
- Penguatan keamanan akses administrasi.
- Pembaruan status kursi secara real-time.
- Implementasi temporary leave dan auto release.
- Penyempurnaan pengelolaan check-in dan check-out.
- Integrasi komponen kriptografi dengan penyimpanan data yang membutuhkan perlindungan.
- Pengelolaan kunci yang aman, termasuk rotasi kunci dan prosedur pemulihan.

## Pengembang

- **Nama:** M. Rizki Ruswan (105224018)
- **Program Studi:** Ilmu Komputer
- **Universitas:** Universitas Pertamina

## Catatan Penggunaan AI

Penggunaan AI dalam pengembangan FindSeat dicatat pada [`docs/security/AI_LOG.md`](docs/security/AI_LOG.md).

Catatan tersebut mencakup bantuan untuk threat modeling, analisis risiko, rancangan kriptografi, implementasi, dokumentasi, dan pengujian.

Seluruh implementasi harus diperiksa dan dipahami oleh pengembang sebelum dikumpulkan.