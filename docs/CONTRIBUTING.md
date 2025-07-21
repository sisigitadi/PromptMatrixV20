# Panduan Kontribusi untuk Prompt Matrix 2.0

Kami sangat menghargai kontribusi Anda untuk proyek Prompt Matrix 2.0! Dengan mengikuti panduan ini, Anda dapat membantu kami menjaga kualitas kode, konsistensi, dan pengalaman pengembangan yang positif.

## Cara Berkontribusi

1.  **Fork Repositori:** Mulailah dengan melakukan fork repositori `PromptMatrix-2.0` ke akun GitHub Anda.

2.  **Kloning Repositori:** Kloning repositori yang sudah Anda fork ke mesin lokal Anda:
    ```bash
    git clone https://github.com/YOUR_USERNAME/PromptMatrix-2.0.git
    cd PromptMatrix-2.0
    ```

3.  **Instal Dependensi:** Instal semua dependensi proyek:
    ```bash
    npm install
    ```

4.  **Buat Branch Baru:** Buat branch baru untuk fitur atau perbaikan bug Anda. Gunakan nama branch yang deskriptif (misalnya, `feature/tambah-fitur-x` atau `fix/perbaiki-bug-y`):
    ```bash
    git checkout -b feature/nama-fitur-anda
    ```

5.  **Lakukan Perubahan:** Lakukan perubahan kode Anda. Pastikan untuk mengikuti konvensi pengkodean yang ada dan menjaga konsistensi gaya.

6.  **Jalankan Tes:** Sebelum melakukan commit, pastikan semua tes lulus dan tidak ada regresi yang diperkenalkan:
    ```bash
    npm test
    ```
    Jika Anda menambahkan fitur baru, pastikan untuk menulis tes yang sesuai.

7.  **Format Kode:** Pastikan kode Anda diformat dengan benar menggunakan Prettier:
    ```bash
    npm run format
    ```

8.  **Lint Kode:** Pastikan kode Anda melewati pemeriksaan linting:
    ```bash
    npm run lint
    ```

9.  **Commit Perubahan:** Commit perubahan Anda dengan pesan commit yang jelas dan ringkas. Ikuti konvensi pesan commit jika ada (misalnya, Conventional Commits):
    ```bash
    git add .
    git commit -m "feat: tambahkan fitur baru untuk X"
    ```

10. **Push ke Branch Anda:** Push perubahan Anda ke repositori yang sudah Anda fork:
    ```bash
    git push origin feature/nama-fitur-anda
    ```

11. **Buat Pull Request:** Buka Pull Request (PR) baru dari branch Anda ke branch `main` di repositori utama. Berikan deskripsi yang jelas tentang perubahan Anda dan referensikan masalah terkait jika ada.

## Pedoman Kode

*   **Gaya Kode:** Kami menggunakan Prettier dan ESLint untuk menjaga konsistensi gaya kode. Pastikan Anda menjalankan `npm run format` dan `npm run lint` sebelum melakukan commit.
*   **TypeScript:** Proyek ini menggunakan TypeScript. Pastikan kode Anda memiliki tipe yang benar dan tidak ada kesalahan tipe.
*   **Komentar:** Tambahkan komentar yang jelas dan ringkas untuk menjelaskan logika kompleks atau bagian kode yang tidak jelas.

## Melaporkan Bug

Jika Anda menemukan bug, silakan buka masalah baru di [halaman Issues](https://github.com/sisigitadi/PromptMatrix-2.0/issues) repositori ini. Berikan informasi sebanyak mungkin untuk membantu kami mereproduksi dan memperbaiki bug tersebut, termasuk:

*   Langkah-langkah untuk mereproduksi bug.
*   Perilaku yang diharapkan.
*   Perilaku aktual.
*   Versi browser dan sistem operasi Anda.

Terima kasih atas kontribusi Anda!
