# FAQ & Pemecahan Masalah Prompt Matrix 2.0

Berikut adalah beberapa pertanyaan umum dan tips pemecahan masalah untuk membantu Anda menggunakan Prompt Matrix 2.0.

## Pertanyaan Umum (FAQ)

### Q1: Apa itu Prompt Matrix 2.0?
A1: Prompt Matrix 2.0 adalah aplikasi yang dirancang untuk membantu Anda membuat, mengelola, dan mengoptimalkan prompt untuk berbagai model AI generatif. Ini menyediakan kerangka kerja terstruktur untuk menyederhanakan proses rekayasa prompt.

### Q2: Bagaimana cara kerja Prompt Matrix 2.0?
A2: Anda memilih kerangka kerja prompt dari kategori yang tersedia, mengisi bidang input yang relevan, dan aplikasi akan menghasilkan prompt yang siap digunakan untuk model AI. Anda juga dapat menyimpan, mengelola, dan merantai prompt.

### Q3: Bisakah saya menyimpan prompt yang saya buat?
A3: Ya, Anda dapat menyimpan prompt yang dihasilkan ke koleksi Anda. Prompt yang disimpan akan tersimpan secara lokal di browser Anda. Anda juga dapat mengekspor dan mengimpor prompt yang disimpan.

### Q4: Apa itu fitur "Chaining Prompt"?
A4: Fitur "Chaining Prompt" memungkinkan Anda menggunakan output (hasil) dari satu prompt sebagai input untuk prompt berikutnya. Ini sangat berguna untuk membangun alur kerja AI yang kompleks dan multi-langkah.

### Q5: Apakah data saya aman di aplikasi ini?
A5: Prompt Matrix 2.0 memproses dan menyimpan data Anda (seperti prompt yang disimpan) secara lokal di browser Anda (`localStorage` dan `sessionStorage`). Data ini tidak dikirim ke server eksternal mana pun oleh aplikasi ini.

## Pemecahan Masalah (Troubleshooting)

### Masalah: Sub-kategori atau kerangka kerja tidak muncul setelah memuat ulang halaman.
**Solusi:** Pastikan Anda telah memilih kategori utama. Secara default, sub-kategori akan ditampilkan dalam keadaan tertutup (collapsed) sampai Anda mengklik kategori atau menggunakan fungsi pencarian/filter.

### Masalah: Hasil pencarian tidak akurat atau tidak lengkap.
**Solusi:**
*   Periksa kembali ejaan kata kunci pencarian Anda.
*   Pastikan Anda tidak memiliki filter "Tipe Alat" yang aktif yang mungkin membatasi hasil pencarian Anda secara tidak sengaja. Jika ada, coba setel ulang filter tersebut.
*   Coba gunakan kata kunci yang lebih umum atau sinonim.

### Masalah: Aplikasi terlihat aneh atau tidak berfungsi dengan benar setelah pembaruan.
**Solusi:**
*   Coba bersihkan cache browser Anda dan muat ulang halaman secara paksa (Ctrl+F5 atau Cmd+Shift+R).
*   Jika masalah berlanjut, laporkan bug dengan menyertakan detail langkah-langkah untuk mereproduksinya.

### Masalah: Prompt yang dihasilkan tidak sesuai dengan yang saya harapkan.
**Solusi:**
*   Periksa kembali input Anda di formulir kerangka kerja. Pastikan semua bidang diisi dengan informasi yang relevan dan spesifik.
*   Baca bagian `perspektif_user` dan `logika_ai` dari kerangka kerja yang Anda gunakan untuk memahami bagaimana AI dirancang untuk memproses permintaan.
*   Coba sesuaikan `konteks_tambahan_instruksi_khusus` untuk memberikan panduan yang lebih spesifik kepada AI.

### Masalah: Tombol atau fitur tertentu tidak responsif.
**Solusi:**
*   Coba muat ulang halaman.
*   Periksa konsol pengembang browser Anda (F12) untuk melihat apakah ada pesan error yang muncul. Pesan error ini dapat memberikan petunjuk tentang masalah yang terjadi.

Jika Anda mengalami masalah yang tidak tercakup di sini, atau memerlukan bantuan lebih lanjut, silakan hubungi tim dukungan atau lihat dokumentasi lengkap kami.
