# Panduan Penggunaan Interaktif Prompt Matrix 2.0

Selamat datang di Prompt Matrix 2.0! Panduan ini akan membantu Anda memahami cara menggunakan aplikasi ini secara efektif untuk membuat, mengelola, dan mengoptimalkan prompt AI Anda.

## 1. Memilih Kategori dan Kerangka Kerja

Di panel navigasi kiri, Anda akan melihat daftar kategori utama. Klik pada salah satu kategori untuk melihat sub-kategori yang tersedia. Setiap sub-kategori berisi daftar kerangka kerja prompt yang spesifik.

*   **Kategori Utama**: Domain luas seperti "Teks & Konten", "Gambar & Desain", dll.
*   **Sub-Kategori**: Fokus yang lebih spesifik dalam kategori utama, misalnya "Penulisan & Konten" di bawah "Teks & Konten".
*   **Kerangka Kerja**: Template prompt spesifik yang akan Anda gunakan.

## 2. Mengisi Formulir Kerangka Kerja

Setelah Anda memilih kerangka kerja, panel tengah (`FrameworkPane`) akan menampilkan formulir dinamis dengan berbagai bidang input. Bidang-bidang ini dirancang untuk mengumpulkan informasi yang dibutuhkan AI untuk menghasilkan prompt yang relevan dan berkualitas tinggi.

*   **`VARIABEL_INPUT`**: Ini adalah bidang-bidang yang perlu Anda isi. Setiap bidang memiliki:
    *   **Label**: Nama bidang (misalnya, "Topik Utama Blog").
    *   **Deskripsi (`info`)**: Penjelasan singkat tentang apa yang diharapkan dari input tersebut.
    *   **Placeholder**: Contoh atau format input yang disarankan.
    *   **Tipe Input**: Bisa berupa teks, angka, pilihan (dropdown), area teks panjang, dll.
*   **Validasi Input**: Aplikasi akan memberikan umpan balik jika input Anda tidak memenuhi persyaratan (misalnya, panjang minimum karakter).

## 3. Melihat dan Menggunakan Output Prompt

Setelah Anda mengisi formulir, panel kanan (`OutputDisplay`) akan secara otomatis menghasilkan dua versi prompt:

*   **Prompt Bahasa Alami**: Versi prompt yang mudah dibaca manusia, siap untuk disalin dan digunakan di model AI.
*   **Prompt JSON**: Versi terstruktur dari prompt, berguna untuk integrasi otomatis atau analisis lebih lanjut.

Anda dapat:
*   **Menyalin Output**: Gunakan tombol "Salin" untuk menyalin prompt ke clipboard Anda.
*   **Menyimpan Prompt**: Klik tombol "Simpan Prompt" untuk menyimpan prompt yang dihasilkan ke koleksi Anda. Anda dapat memberikan nama khusus untuk prompt yang disimpan.
*   **Menggunakan sebagai Input (Chaining)**: Fitur ini memungkinkan Anda menggunakan output dari satu prompt sebagai input untuk prompt lain, memungkinkan alur kerja yang kompleks. Klik "Gunakan sebagai Input" dan pilih bidang input target di kerangka kerja lain.

## 4. Mengelola Prompt yang Disimpan

Anda dapat mengakses prompt yang Anda simpan melalui tombol "Prompt Tersimpan" di header aplikasi. Di sana, Anda dapat:

*   **Memuat Prompt**: Pilih prompt dari daftar untuk mengisi ulang formulir kerangka kerja.
*   **Menghapus Prompt**: Hapus prompt yang tidak lagi Anda butuhkan.
*   **Mengganti Nama Prompt**: Ubah nama prompt yang disimpan untuk memudahkan identifikasi.
*   **Ekspor/Impor**: Ekspor semua prompt Anda ke file JSON untuk cadangan atau berbagi, dan impor kembali jika diperlukan.

## 5. Fitur Pencarian dan Filter

*   **Bilah Pencarian**: Gunakan bilah pencarian di panel navigasi untuk menemukan kerangka kerja berdasarkan nama, deskripsi, ID, atau bahkan teks di dalam opsi dropdown dan detail komponen input.
*   **Filter Tipe Alat**: Gunakan dropdown filter untuk menampilkan kerangka kerja berdasarkan jenis output AI yang mereka hasilkan (misalnya, "text", "image-generation", "planning").



*   **Eksperimen**: Jangan ragu untuk mencoba berbagai kerangka kerja dan kombinasi input.
*   **Spesifik**: Semakin spesifik input Anda, semakin baik output yang akan dihasilkan AI.
*   **Umpan Balik**: Jika Anda memiliki saran atau menemukan masalah, jangan ragu untuk memberikan umpan balik.

Selamat menggunakan Prompt Matrix 2.0!