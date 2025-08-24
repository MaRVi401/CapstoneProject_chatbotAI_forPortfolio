# Portfolio Chatbot

Proyek ini adalah demonstrasi portofolio yang menampilkan keahlian dalam pengembangan web dan integrasi AI. Halaman ini memiliki chatbot interaktif yang ditenagai oleh model AI **IBM Granite** dari **Replicate**, yang dirancang untuk menjawab pertanyaan tentang profil profesional saya.

## Fitur Utama

- **Halaman Portofolio Dinamis**: Menampilkan profil, minat, dan riwayat edukasi.
- **Chatbot AI Interaktif**: Berinteraksi dengan pengguna untuk menjawab pertanyaan spesifik tentang saya sebagai seorang profesional.
- **Backend Serverless**: Menggunakan Netlify Functions untuk mengelola logika chat dan memproses permintaan ke Replicate API.
- **Frontend Pop-up**: Chatbot muncul sebagai pop-up overlay yang tidak mengganggu tata letak halaman utama, dibangun dengan HTML, CSS, dan JavaScript.
- **Deployment Otomatis**: Dirancang untuk di-deploy ke Netlify untuk ketersediaan global yang mudah.

---

## Teknologi yang Digunakan

* **Frontend**: HTML, CSS, JavaScript
* **Backend**: Netlify Functions (Node.js)
* **AI Model**: IBM Granite (via Replicate API)
* **Deployment**: Netlify

---

## Cara Menjalankan Proyek Secara Lokal

Ikuti langkah-langkah di bawah ini untuk menjalankan proyek di komputer lokal kamu.

### Prasyarat

* [Node.js](https://nodejs.org/) dan npm terinstal.
* Akun [Replicate](https://replicate.com/) dengan API Token.

### Langkah-langkah

1.  **Clone repositori** atau unduh file proyek.
2.  Buka terminal di direktori proyek.
3.  **Instal dependensi** yang diperlukan:
    ```bash
    npm install
    ```
4.  **Konfigurasi API Token**. Buat file `.env` di direktori utama proyek dan tambahkan API token dari Replicate. **Jangan masukkan file ini ke repositori publik.**
    ```dotenv
    REPLICATE_API_TOKEN="TOKEN_ANDA_DI_SINI"
    ```
5.  Karena arsitektur proyek ini dirancang untuk Netlify Functions, kamu tidak bisa menjalankannya secara langsung dengan `node index.js`. Sebagai gantinya, kamu bisa menguji serverless functions secara lokal menggunakan **Netlify CLI**.
    * Instal Netlify CLI: `npm install -g netlify-cli`
    * Jalankan server lokal: `netlify dev`
6.  Buka browser dan kunjungi `http://localhost:(port)` untuk melihat proyek berjalan.

---

## Deployment

Proyek ini dirancang untuk di-deploy dengan mudah ke Netlify.

1.  Hubungkan repositori GitHub/GitLab kamu ke Netlify.
2.  Netlify akan secara otomatis mendeteksi konfigurasi `netlify/functions` dan folder `public`.
3.  **Konfigurasi Fungsi Serverless**. Pastikan file `netlify/functions/chatbot.js` sudah disesuaikan dengan format Netlify Function (menggunakan `exports.handler`), bukan struktur Express.js. Ini penting agar logika backend dapat berjalan dengan benar di lingkungan serverless Netlify.
4.  **Tambahkan variabel lingkungan** `REPLICATE_API_TOKEN` di pengaturan Netlify Site. Caranya, buka **Site settings** > **Build & deploy** > **Environment**.

---

## Tentang Saya

**Ahmad Yassin**
* Full Stack Developer & Junior Cyber Security
* Mahasiswa Software Engineering dari Politeknik Negeri Indramayu

Proyek ini adalah demonstrasi keahlian saya dalam pengembangan web yang aman dan integrasi teknologi AI IBM Granite. Semoga bermanfaat dan bisa masuk nominasi 20 besar, wkwkwkwkwkwk.