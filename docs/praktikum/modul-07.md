# Dokumen Teknis Modul 7 — Debugging dan Telaah Kode

**Nama:** M. Rizki Ruswan  
**NIM:** 105224018  
**Repositori:** https://github.com/mrizkiruswan-lab/105224018-FindSeat  

> **Catatan pengisian:** Dokumen ini disesuaikan dengan aplikasi FindSeat. Bagian bertanda **[PERLU DIISI]** atau **[BELUM DIVERIFIKASI]** harus dilengkapi menggunakan hasil praktik dan bukti asli. Jangan mengklaim pengujian, screenshot, issue, commit, atau persetujuan PR yang belum dilakukan.

## 1. Lingkungan dan Konfigurasi Debugger

### 1.1 Lingkungan pengembangan

| Komponen | Versi / informasi |
|---|---|
| Sistem operasi | Windows |
| Node.js | v26.13.0 |
| npm | v11.20.0 |
| Next.js | v16.4.0 |
| React | v19.3.0 |
| TypeScript | ^5 |
| Prisma ORM | v7.10.1 |
| Basis data | PostgreSQL |
| Peramban | Google Chrome v158 |
| Repositori | `mrizkiruswan-lab/105224018-FindSeat` |
| Branch praktikum | **week-7** |

Versi di atas merupakan informasi lingkungan yang telah digunakan pada pengembangan FindSeat. Periksa kembali versi aktual pada saat pengumpulan melalui terminal.

### 1.2 Konfigurasi debugger VS Code

Buat berkas `.vscode/launch.json` di akar repositori. Konfigurasi berikut menyediakan debugger server Next.js dan debugger Chrome untuk sisi klien.

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Next.js: debug server-side",
      "type": "node-terminal",
      "request": "launch",
      "command": "npm run dev -- --inspect"
    },
    {
      "name": "Next.js: debug client-side",
      "type": "chrome",
      "request": "launch",
      "url": "http://localhost:3000"
    }
  ]
}
```

Jalankan debugger melalui menu **Run and Debug** di VS Code. Pilih konfigurasi server-side untuk menelusuri Server Component dan Server Action. Pilih konfigurasi client-side atau gunakan Chrome DevTools untuk menelusuri Client Component.

**Bukti yang perlu dilampirkan:**
- [PERLU DIISI] Screenshot VS Code ketika breakpoint pada Server Component atau Server Action berhenti.
- [PERLU DIISI] Screenshot panel Variables dan Call Stack.
- [PERLU DIISI] Hash commit awal dari `git log --oneline -1`.

### 1.3 Konfigurasi log Prisma

Pada FindSeat, Prisma Client dibuat melalui `lib/prisma.ts`. Untuk praktikum, aktifkan log query, peringatan, dan error pada konfigurasi `PrismaClient`.

Contoh konfigurasi yang dapat disesuaikan dengan inisialisasi Prisma 7 pada proyek:

```ts
new PrismaClient({
  adapter,
  log: ["query", "warn", "error"],
});
```

Setelah mengubah konfigurasi, hentikan server development dan jalankan kembali agar instance Prisma yang tersimpan selama proses development menggunakan konfigurasi terbaru. Log query digunakan untuk memeriksa apakah operasi basis data benar-benar dijalankan.

Jangan menampilkan atau mengunggah nilai rahasia dari `.env` maupun kredensial basis data ke screenshot atau repositori.

## 2. Daftar Galat

| No. | Issue | Gejala saat bug direproduksi | Lapisan | Akar penyebab | Status pengujian |
|---|---|---|---|---|---|
| 1 | Bug validasi ID kursi | Saat pengguna memilih kursi yang tersedia dan melakukan check-in, aplikasi menampilkan pesan `ID kursi tidak valid.` | Server Action (`app/tempat/[id]/actions.ts`) | Kondisi validasi `seatId` terbalik, yaitu menggunakan `data.seatId > 0` sehingga ID kursi positif yang seharusnya valid justru ditolak. | Berhasil direproduksi dan diperbaiki. |
| 2 | Bug pemilihan kursi berstatus ditinggalkan | Kursi berwarna kuning (`ditinggalkan`) tidak dapat dipilih. Setelah pemilihan di sisi client dibuka, proses check-in masih ditolak dengan pesan `Kursi sudah tidak tersedia.` | Client Component, Server Action, dan pembaruan data Prisma | Pemeriksaan status hanya mengizinkan `tersedia`, baik pada komponen pemilihan kursi maupun operasi pembaruan status di server. | Berhasil direproduksi, diperbaiki sementara untuk pengujian, dan hasil check-in berhasil diverifikasi. |


## 3. Catatan Penelusuran

### 3.1 Bug 1 — Validasi ID kursi terbalik

**Kondisi awal dan reproduksi**

1. Buka halaman detail tempat FindSeat.
2. Pilih salah satu kursi yang berstatus tersedia.
3. Isi formulir check-in dan lakukan konfirmasi.
4. Saat bug aktif, aplikasi menampilkan pesan `ID kursi tidak valid.` meskipun ID kursi yang dikirim merupakan bilangan bulat positif.

**Akar penyebab**

Pada `app/tempat/[id]/actions.ts`, kondisi validasi `seatId` sengaja diubah dari `data.seatId <= 0` menjadi `data.seatId > 0`. Akibatnya, nilai ID kursi positif justru dianggap tidak valid.

**Perbaikan**

Kondisi validasi dikembalikan menjadi:

```ts
if (!Number.isSafeInteger(data.seatId) || data.seatId <= 0) {
  return {
    success: false,
    message: "ID kursi tidak valid.",
  };
}
```

**Hasil pengujian setelah perbaikan**

Setelah kondisi validasi dikembalikan, proses check-in pada kursi yang tersedia berhasil. Aplikasi menampilkan pesan `Check-in berhasil dan data tersimpan ke database.`

**Bukti**

- Screenshot sebelum perbaikan: tampilkan kursi yang dipilih dan pesan `ID kursi tidak valid.`
- Screenshot sesudah perbaikan: tampilkan pesan keberhasilan check-in.

**Status:** Bug berhasil direproduksi, penyebab ditemukan, dan perbaikan berhasil diuji.

### 3.2 Bug 2 — Kursi berstatus ditinggalkan tidak dapat dipilih

**Kondisi awal dan reproduksi**

1. Buka halaman detail tempat FindSeat yang memiliki kursi berstatus `ditinggalkan` (ditampilkan dengan warna kuning).
2. Coba pilih kursi kuning tersebut.
3. Pada kondisi awal, kursi tidak dapat dipilih karena komponen hanya mengizinkan status `tersedia`.
4. Untuk menelusuri masalah, kondisi pemilihan pada `components/SeatMap.tsx` diubah sementara. Pemeriksaan pada komponen induk `DetailTempatClient.tsx` kemudian ditemukan masih menolak status selain `tersedia`.
5. Setelah validasi komponen induk disesuaikan, formulir check-in dapat ditampilkan. Namun, saat check-in dikonfirmasi, server masih menolak permintaan dengan pesan `Kursi sudah tidak tersedia.`

**Akar penyebab**

Pemeriksaan status kursi dilakukan pada beberapa lapisan. `SeatMap.tsx` menentukan apakah kursi dapat diklik, `DetailTempatClient.tsx` memeriksa kembali status sebelum menyimpan pilihan, dan Server Action pada `app/tempat/[id]/actions.ts` hanya memperbarui kursi jika statusnya `tersedia`. Karena itu, perubahan pada komponen tampilan saja belum cukup untuk membuat check-in kursi `ditinggalkan` berhasil.

**Perbaikan sementara untuk pengujian**

Untuk membuktikan alur secara menyeluruh, validasi pada komponen induk dan kondisi `updateMany` di Server Action disesuaikan sementara agar status `ditinggalkan` juga dapat diproses. Pada operasi Prisma, kondisi status yang diuji mengizinkan `tersedia` dan `ditinggalkan`.

**Hasil pengujian**

- Kursi nomor 06 yang berwarna kuning berhasil dipilih.
- Formulir konfirmasi check-in berhasil ditampilkan.
- Setelah tombol Konfirmasi Check-in ditekan, aplikasi menampilkan pesan `Check-in berhasil dan data tersimpan ke database.`
- Setelah halaman dimuat ulang, perubahan status kursi tetap tersimpan.

**Bukti**

- Screenshot saat kursi nomor 06 berwarna kuning dipilih dan formulir check-in muncul.
- Screenshot setelah konfirmasi yang menampilkan pesan keberhasilan.
- Hasil pemeriksaan setelah refresh untuk memastikan perubahan status tersimpan.

**Pengembalian perubahan eksperimen**

Setelah pengujian Bug 2 selesai, perubahan yang secara khusus mengizinkan kursi `ditinggalkan` dikembalikan ke logika awal FindSeat. Dengan demikian, pengujian Bug 2 didokumentasikan sebagai eksperimen debugging dan tidak mengubah aturan pemilihan kursi pada kode akhir.

**Status:** Bug berhasil direproduksi, titik validasi pada client dan server ditemukan, dan alur pengujian berhasil diverifikasi.


## 4. Keputusan Teknis

### 4.1 Validasi masukan dan konversi tipe

Validasi masukan dilakukan di sisi server menggunakan Zod agar data yang diterima Server Action tidak langsung dipercaya. Untuk nilai boolean yang dikirim sebagai string dari formulir HTML, konversi harus memperhatikan representasi string tersebut.

Pada Zod 4, `z.stringbool()` dapat digunakan untuk mengubah string seperti `"true"` dan `"false"` menjadi boolean secara tepat. Hal ini berbeda dari `z.coerce.boolean()` yang menggunakan perilaku `Boolean(input)`. Akibatnya, string tidak kosong seperti `"false"` akan menghasilkan `true`.

Penerapan pada FindSeat perlu disesuaikan dengan field formulir yang benar-benar mengirim nilai boolean sebagai string. Jangan mengganti skema yang tidak menggunakan input tersebut hanya demi mengikuti contoh modul.

### 4.2 Aturan perubahan dan penghapusan data FindSeat

FindSeat memiliki data tempat, kursi, status kursi, dan check-in. Operasi yang mengubah status kursi harus divalidasi di server. Status kursi tidak boleh hanya mengandalkan nilai yang dikirim oleh browser.

Pada kondisi kode akhir setelah eksperimen Modul 7 dikembalikan, proses check-in menggunakan operasi bersyarat untuk mengubah kursi hanya jika statusnya `tersedia`, kemudian mencatat check-in. Pola ini membantu mencegah dua pengguna mengambil kursi yang sama secara bersamaan. Pada pengujian Bug 2, kondisi tersebut sementara diperluas agar kursi `ditinggalkan` dapat diproses, lalu perubahan eksperimen dikembalikan setelah bukti pengujian diperoleh.

Untuk penghapusan data tempat atau kursi, aturan relasi harus mengikuti skema Prisma yang benar-benar digunakan. Data check-in yang masih terkait perlu dipertimbangkan agar penghapusan tidak menimbulkan pelanggaran foreign key atau menghilangkan riwayat secara tidak sengaja.


### 4.3 Nilai turunan saat render dibandingkan `useEffect`

Nilai yang dapat dihitung langsung dari props atau state sebaiknya dihitung saat render. `useEffect` tidak diperlukan hanya untuk menyalin nilai turunan ke state lain.

Sebagai contoh, apabila jumlah kursi tersedia dihitung dari daftar kursi, jumlah tersebut dapat dihitung dari data kursi yang sudah tersedia. Pendekatan ini menghindari state ganda yang berpotensi tidak sinkron.

`useEffect` tetap digunakan untuk efek samping yang memang memerlukan sinkronisasi dengan sistem eksternal, bukan untuk perhitungan sederhana yang dapat dilakukan saat render.

### 4.4 Penanganan galat pada Server Action dan `error.tsx`

Galat yang diperkirakan dan dapat ditangani, seperti masukan tidak valid atau kursi yang sudah tidak tersedia, sebaiknya dikembalikan sebagai status atau pesan yang dapat ditampilkan pada formulir.

Galat tak terduga perlu dicatat dengan informasi teknis yang memadai dan diteruskan ke error boundary apabila memang harus ditangani pada tingkat segmen halaman. Jangan menggunakan `catch` yang hanya menampilkan pesan umum lalu menelan objek galat.

Pada Next.js, `redirect()` bekerja dengan mekanisme khusus yang melempar galat internal. Karena itu, `redirect()` tidak boleh diletakkan di dalam blok `try` yang menangkap galat tersebut. Letakkan pemanggilan `redirect()` setelah blok `try/catch` atau setelah operasi yang perlu ditangani selesai.

## 5. Telaah Kode

### 5.1 Tanggapan atas komentar yang diterima

| Komentar / catatan review | Keputusan | Alasan teknis | Commit tindak lanjut |
|---|---|---|---|
| Validasi `seatId` pada proses check-in perlu memastikan ID positif diterima dan hanya ID yang tidak valid yang ditolak. | Diterapkan | Kondisi validasi dikembalikan menjadi `!Number.isSafeInteger(data.seatId) || data.seatId <= 0`. Setelah perbaikan, check-in pada kursi tersedia berhasil. | Belum ada commit yang diverifikasi |
| Pemilihan kursi perlu memeriksa konsistensi validasi pada `SeatMap.tsx`, `DetailTempatClient.tsx`, dan Server Action agar penyebab kursi `ditinggalkan` ditolak dapat ditemukan. | Diuji sementara; perubahan eksperimen dikembalikan | Pemeriksaan client dan kondisi `updateMany` disesuaikan sementara untuk menguji alur kursi `ditinggalkan`. Check-in kursi 06 berhasil dan tersimpan setelah refresh. Setelah bukti diperoleh, aturan awal aplikasi dipulihkan. | Belum ada commit yang diverifikasi |

**Catatan:** Dua baris di atas merangkum catatan review/debugging yang kita lakukan pada dua bug FindSeat. Jika dosen meminta komentar reviewer dari pull request pasangan, ganti atau lengkapi tabel ini dengan komentar asli yang benar-benar diterima pada PR tersebut. Jangan menyebutnya sebagai komentar reviewer eksternal jika komentar itu tidak pernah diberikan.

## 6. Kendala dan Penyelesaian

### 6.1 Validasi ID kursi menolak ID positif

Ketika Bug 1 diaktifkan, check-in gagal dengan pesan `ID kursi tidak valid.` Pemeriksaan kode menunjukkan bahwa operator perbandingan pada validasi `seatId` terbalik. Kondisi dikembalikan menjadi `data.seatId <= 0`, kemudian check-in diuji kembali dan berhasil.

### 6.2 Kursi berstatus ditinggalkan ditolak pada beberapa lapisan

Pada Bug 2, kursi kuning tidak dapat dipilih karena pemeriksaan status di `SeatMap.tsx` dan `DetailTempatClient.tsx` hanya mengizinkan kursi `tersedia`. Setelah pemilihan di sisi client diperbaiki untuk keperluan pengujian, Server Action masih menolak kursi tersebut karena operasi `updateMany` juga hanya memfilter status `tersedia`.

Validasi komponen induk dan kondisi pembaruan Prisma kemudian disesuaikan sementara untuk menguji status `ditinggalkan`. Check-in kursi nomor 06 berhasil dan perubahan status tetap tersimpan setelah refresh. Setelah bukti pengujian diperoleh, perubahan eksperimen Bug 2 dikembalikan ke logika awal.


## 7. Lokasi dan Daftar Bukti Screenshot

Simpan screenshot di dalam repositori agar bukti ikut terbawa saat folder proyek dikumpulkan atau di-push ke Git. Buat folder berikut dari akar proyek:

```text
docs/
└── praktikum/
    └── bukti/
        └── modul-07/
            ├── bug-1-sebelum.png
            ├── bug-1-sesudah.png
            ├── bug-2-kursi-kuning-dipilih.png
            ├── bug-2-check-in-berhasil.png
```

Gunakan nama file yang sesuai dengan isi screenshot. Bukti yang disarankan:

| Nama file | Isi screenshot |
|---|---|
| `bug-1-sebelum.png` | Kondisi Bug 1 saat check-in ditolak dengan pesan `ID kursi tidak valid.` |
| `bug-1-sesudah.png` | Check-in berhasil setelah validasi `seatId` diperbaiki. |
| `bug-2-kursi-kuning-dipilih.png` | Kursi nomor 06 berwarna kuning dipilih dan formulir check-in tampil. |
| `bug-2-check-in-berhasil.png` | Pesan `Check-in berhasil dan data tersimpan ke database.` setelah konfirmasi. |

Setelah screenshot dimasukkan ke folder tersebut, tautkan gambar di dokumen Markdown menggunakan path relatif, misalnya:

```md
![Bug 1 sebelum perbaikan](bukti/modul-07/bug-1-sebelum.png)
```

Jika dokumen ini tetap disimpan di luar folder `docs/praktikum/`, sesuaikan path relatifnya. Jangan membuat gambar bukti baru atau memakai screenshot yang tidak sesuai dengan keterangan. Screenshot yang memperlihatkan nama, email, atau informasi pribadi sebaiknya disamarkan sebelum dibagikan.

## 8. Catatan Pemanfaatan AI

AI digunakan sebagai alat bantu untuk:
1. Membantu membaca dan memahami instruksi Dokumen Teknis Modul 7.
2. Membantu menyusun kerangka dokumentasi sesuai struktur pada modul.
3. Membantu menelusuri Bug 1 pada validasi ID kursi di Server Action.
4. Membantu menelusuri Bug 2 pada pemilihan kursi berstatus `ditinggalkan` di komponen client dan Server Action.
5. Membantu merumuskan langkah pemeriksaan dan dokumentasi hasil debugging.

Bagian yang dibantu AI adalah penyusunan kerangka dan penjelasan teknis. Pemeriksaan kode, reproduksi masalah, keputusan perubahan, pengujian ulang, pengambilan screenshot, pembuatan issue, dan telaah pull request harus dilakukan serta diverifikasi oleh pengembang.

**Verifikasi yang dilakukan:** dua bug pada alur pemilihan kursi dan check-in FindSeat telah direproduksi dan diuji. Bug 1 berkaitan dengan kondisi validasi `seatId` yang terbalik dan berhasil diperbaiki. Bug 2 berkaitan dengan penolakan kursi berstatus `ditinggalkan` pada komponen client dan Server Action; alur tersebut berhasil diuji sementara hingga check-in tersimpan setelah refresh, kemudian perubahan eksperimen dikembalikan ke logika awal.

**Catatan:** Dokumen ini hanya mencatat dua bug yang dikerjakan pada Modul 7. Lengkapi tautan issue, hash commit, screenshot, dan bagian telaah PR pasangan berdasarkan bukti praktik yang benar-benar tersedia. Jangan mengisi informasi yang belum dilakukan.
