# Keputusan Mekanisme Kriptografi FindSeat

## 1. Tujuan

Dokumen ini menjelaskan keputusan pemilihan mekanisme kriptografi untuk melindungi kerahasiaan dan integritas data sensitif pada produk FindSeat. Implementasi menggunakan mekanisme Authenticated Encryption with Associated Data (AEAD) melalui algoritma AES-256-GCM dari modul `node:crypto` bawaan Node.js.

Komponen ini merupakan implementasi demonstrasi untuk data sintetis dan belum secara otomatis mengenkripsi seluruh data yang tersimpan di database FindSeat.

## 2. Kebutuhan Perlindungan Data

| Jenis Data | Kebutuhan Keamanan | Mekanisme yang Dibutuhkan |
|---|---|---|
| Catatan pengguna | Kerahasiaan dan integritas | Enkripsi terautentikasi |
| Metadata penggunaan kursi | Kerahasiaan dan integritas | Enkripsi terautentikasi |
| Data profil pengguna | Kerahasiaan dan integritas | Enkripsi terautentikasi |
| Data venue dan denah kursi publik | Integritas | Validasi dan kontrol akses |
| Password pengguna | Perlindungan kredensial | Password hashing, bukan enkripsi reversibel |

## 3. Mekanisme yang Dipilih

Mekanisme yang dipilih adalah **AES-256-GCM (Advanced Encryption Standard with 256-bit key dalam mode Galois/Counter Mode)**.

AES-256-GCM merupakan mekanisme AEAD yang menyediakan dua perlindungan sekaligus:

- **Confidentiality:** isi data tidak dapat dibaca tanpa kunci yang benar.
- **Integrity dan authenticity:** perubahan ciphertext, authentication tag, atau konteks autentikasi menyebabkan proses dekripsi gagal.

Implementasi menggunakan modul `node:crypto` bawaan Node.js sehingga tidak memerlukan pustaka kriptografi tambahan.

## 4. Parameter Kriptografi

| Parameter | Nilai | Keterangan |
|---|---|---|
| Algoritma | AES-256-GCM | Mekanisme AEAD |
| Panjang kunci | 256 bit (32 byte) | Kunci rahasia |
| Panjang nonce/IV | 96 bit (12 byte) | Dibuat secara acak untuk setiap enkripsi |
| AAD | `findseat:sensitive-data:v1` | Konteks autentikasi yang tidak dienkripsi |
| Authentication tag | 128 bit (16 byte) | Memverifikasi integritas dan autentisitas |
| Encoding payload | Base64URL | Representasi data biner dalam JSON |

## 5. Pengelolaan Kunci dan Keacakan

Kunci enkripsi dibangkitkan menggunakan Cryptographically Secure Pseudo-Random Number Generator (CSPRNG) melalui fungsi `randomBytes()` dari modul `node:crypto`.

Kunci AES-256 harus memiliki panjang tepat 32 byte. Kunci direpresentasikan dalam format Base64 untuk penyimpanan pada environment variable `FINDSEAT_ENCRYPTION_KEY`.

Kunci disimpan di file environment lokal yang tidak dimasukkan ke repository. Untuk lingkungan produksi, kunci sebaiknya disimpan menggunakan secret manager.

Nonce atau IV dibuat menggunakan `randomBytes(12)` untuk setiap proses enkripsi. Nonce tidak boleh digunakan kembali dengan kunci yang sama.

## 6. Additional Authenticated Data (AAD)

AAD yang digunakan adalah:

`findseat:sensitive-data:v1`

AAD tidak ikut dienkripsi, tetapi menjadi bagian dari proses autentikasi AES-GCM. Dengan demikian, data hanya dapat didekripsi apabila konteks AAD yang digunakan sesuai dengan konteks ketika enkripsi dilakukan.

## 7. Validasi Masukan dan Fail-Closed

Implementasi menerapkan validasi terhadap masukan sebelum proses enkripsi maupun dekripsi.

Validasi meliputi:

- Kunci harus berupa Buffer dengan panjang tepat 32 byte.
- Plaintext harus berupa string.
- Payload harus memiliki struktur JSON yang valid.
- Versi dan algoritma payload harus sesuai.
- IV harus memiliki panjang 12 byte.
- Authentication tag harus memiliki panjang 16 byte.
- Representasi Base64URL harus sesuai format yang diharapkan.

Apabila validasi gagal, proses dihentikan dan menghasilkan kesalahan.

Pada proses dekripsi, fungsi `decipher.final()` melakukan verifikasi autentikasi. Jika ciphertext, tag, AAD, atau kunci tidak sesuai, proses dekripsi ditolak. Plaintext tidak dikembalikan apabila autentikasi gagal.

Prinsip ini menerapkan pendekatan fail-closed.

## 8. Alasan Pemilihan

AES-256-GCM dipilih karena menyediakan kerahasiaan dan integritas dalam satu mekanisme AEAD. Penggunaan authentication tag membantu mendeteksi perubahan data, sedangkan AAD memungkinkan konteks data ikut diverifikasi tanpa harus dienkripsi.

Selain itu, modul `node:crypto` merupakan modul bawaan Node.js yang menyediakan fungsi kriptografi terpelihara dan dapat digunakan tanpa menambahkan dependensi eksternal.

## 9. Batasan Implementasi

- Komponen kriptografi hanya dijalankan pada sisi server.
- Kunci tidak boleh dikirim ke browser atau disimpan dalam repository.
- Implementasi belum terintegrasi secara otomatis dengan seluruh penyimpanan database FindSeat.
- Password tidak menggunakan enkripsi reversibel, melainkan memerlukan mekanisme password hashing.
- Enkripsi tidak menggantikan autentikasi, otorisasi, dan komunikasi aman menggunakan HTTPS/TLS.

## 10. Kesimpulan

Berdasarkan kebutuhan perlindungan data FindSeat, AES-256-GCM dipilih sebagai mekanisme enkripsi terautentikasi karena mampu melindungi kerahasiaan dan integritas data. Penggunaan kunci 256 bit, nonce acak 12 byte, AAD, dan authentication tag 16 byte menjadi parameter utama implementasi.

Validasi masukan dan penolakan proses dekripsi ketika autentikasi gagal diterapkan untuk memastikan data yang tidak sah tidak diproses lebih lanjut.