<p align="center">
  <img src="https://img.shields.io/badge/versi-1.0-blue?style=for-the-badge" alt="Versi 1.0">
  <img src="https://img.shields.io/badge/lesen-MIT-green?style=for-the-badge" alt="Lesen MIT">
  <img src="https://img.shields.io/badge/data-JSON-orange?style=for-the-badge" alt="JSON">
  <img src="https://img.shields.io/badge/ilmu-8-red?style=for-the-badge" alt="8 Ilmu">
</p>

<h1 align="center">📖 Quran 8 Ilmu API</h1>

<p align="center"><strong>API Statik Al-Quran dengan 8 Bidang Ilmu</strong><br>
<em>Tajwid, Makhraj, Sifat, Tarannum, Fawasil, Lughah, Qiraat, dan Tafsir – dalam satu JSON</em></p>

---

## 🌟 Visi

Membina **satu sumber kebenaran** untuk data Al-Quran digital yang lengkap, terbuka, dan boleh digunakan oleh mana-mana aplikasi – dari laman web ke peranti mudah alih, dari bot Telegram ke sistem AI.

Setiap surah diwakili dalam satu fail JSON yang menggabungkan **8 cabang ilmu Al-Quran**, membolehkan para pembangun mencipta pengalaman pembelajaran yang kaya tanpa perlu mengumpul data dari pelbagai sumber.

---

## 🎯 8 Ilmu yang Disokong

| # | Ilmu | Penerangan dalam JSON |
|---|------|-----------------------|
| 1 | **Tajwid** | Hukum bacaan (mad, idgham, izhar, dll.) |
| 2 | **Makhraj** | Tempat keluar setiap huruf |
| 3 | **Sifat Huruf** | Sifat berlawanan & tunggal |
| 4 | **Tarannum** | Cadangan maqam, tempo, notasi `do-re-mi` |
| 5 | **Fawasil** | Hujung ayat, pola rima, penomboran |
| 6 | **Lughah** | Nahwu, Sorof, Balaghah per-kalimah |
| 7 | **Qiraat** | Variasi Qiraat Sab'ah & 'Asyarah |
| 8 | **Tafsir** | Ringkasan Tafsir Ibnu Kathir (Bahasa Melayu) |

---

## 🗂 Struktur API

Data boleh dicapai melalui GitHub Pages atau `raw.githubusercontent.com`:

```
# Versi mentah (JSON)
https://raw.githubusercontent.com/pengurusanemediamasjidkampungs-dotcom/quran-8ilmu-api/main/api/v1/surah/1.json

# Melalui GitHub Pages (web demo)
https://pengurusanemediamasjidkampungs-dotcom.github.io/quran-8ilmu-api/
```

Setiap fail JSON mengikut skema yang didokumenkan sepenuhnya dalam [API_SPEC.md](docs/API_SPEC.md).

---

## 📁 Struktur Repositori

```
quran-8ilmu-api/
├── api/
│   └── v1/
│       ├── surah/
│       │   ├── 1.json             # Al-Fatihah (lengkap 8 ilmu)
│       │   └── ...
│       ├── juzuk/
│       │   └── ...
│       ├── index.json             # Metadata semua surah
│       └── 8ilmu-schema.json      # Skema rujukan JSON
├── docs/
│   ├── API_SPEC.md                # Spesifikasi teknikal API
│   ├── ILMU.md                    # Huraian 8 ilmu
│   ├── CONTRIBUTING.md            # Panduan menyumbang
│   └── TUTORIAL.md                # Tutorial guna API
├── tools/
│   ├── validator.js               # Skrip sahkan JSON ikut skema
│   └── generator.html             # Alat bina JSON secara GUI
├── examples/
│   └── web-demo/                  # Demo laman web interaktif
│       ├── index.html             # Antara muka utama
│       ├── style.css              # Gaya responsif + 3 tema
│       └── script.js              # Logik tema, tab, dan pemuatan API
├── index.html                     # Alihan automatik ke demo (GitHub Pages)
├── LICENSE.txt
├── .gitignore
└── README.md
```

---

## 🚀 Panduan Pantas

### Lihat Demo Langsung

1. **Buka GitHub Pages:**  
   [https://pengurusanemediamasjidkampungs-dotcom.github.io/quran-8ilmu-api/](https://pengurusanemediamasjidkampungs-dotcom.github.io/quran-8ilmu-api/)  
   (Pastikan tetapan GitHub Pages diarahkan ke branch `main` dan folder root `/ (root)`).

2. **Navigasi:**  
   - Tab **Ayat 1–7** di bahagian atas.  
   - Sub‑tab **8 ilmu** di bawah setiap ayat.

### Guna API dalam Kod

```javascript
fetch('https://raw.githubusercontent.com/pengurusanemediamasjidkampungs-dotcom/quran-8ilmu-api/main/api/v1/surah/1.json')
  .then(res => res.json())
  .then(data => {
    console.log(data.ayahs[0].words[0].tajwid);   // Hukum tajwid
    console.log(data.ayahs[0].lughah.nahwu);       // Analisis nahwu
    console.log(data.ayahs[0].qiraat);             // Variasi qiraat
  });
```

### Guna dalam Aplikasi Anda

- **Web:** Gunakan `fetch()` atau `axios`.
- **Mobile (Flutter):** Guna `http` package.
- **Bot Telegram:** Ambil data JSON dan format sebagai mesej.

Tiada kunci API, tiada had kadar – **percuma selamanya**.

---

## 📚 Dokumentasi

| Fail | Penerangan |
|------|------------|
| [API_SPEC.md](docs/API_SPEC.md) | Spesifikasi teknikal penuh |
| [ILMU.md](docs/ILMU.md) | Huraian 8 ilmu dalam sistem |
| [TUTORIAL.md](docs/TUTORIAL.md) | Tutorial langkah demi langkah |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Panduan untuk penyumbang |

---

## 🧩 Contoh Penggunaan

### 1. Laman Web Pendidikan Al-Quran
Paparkan setiap ayat dengan tab untuk Tajwid, Makhraj, Lughah, dan Qiraat – semua diambil dari satu JSON.

### 2. Aplikasi Mudah Alih
Bina aplikasi hafalan Al-Quran yang memaparkan tempat keluar huruf secara visual, lengkap dengan audio dan variasi qiraat.

### 3. Chatbot AI
Latih model AI dengan data berstruktur untuk menjawab soalan tentang tajwid, tafsir, atau qiraat.

---

## 📊 Statistik

| Item | Jumlah |
|------|--------|
| Surah tersedia | 1 (Al-Fatihah) – akan datang: Juzuk 30 |
| Ayat dianalisis | 7 |
| Kalimah dengan 8 ilmu | 29 |
| Saiz fail JSON | ~25 KB per surah |
| Qiraat disokong | 10 (Hafs, Warsh, dll.) |

---

## 🛠 Pembangunan

### Ingin Menyumbang?

1. Fork repo ini.
2. Tambah surah baharu atau lengkapkan data.
3. Sahkan JSON menggunakan `tools/validator.js`.
4. Hantar Pull Request.

Lihat [CONTRIBUTING.md](docs/CONTRIBUTING.md) untuk panduan penuh.

---

## 📜 Lesen

Projek ini dilesenkan di bawah [Lesen MIT](LICENSE.txt). Anda bebas menggunakan, mengubah suai, dan mengedarkan data ini untuk sebarang tujuan, termasuk komersial.

---

<p align="center">
  <strong>"Sebaik-baik kalian adalah yang mempelajari Al-Quran dan mengajarkannya."</strong><br>
  – Hadis Riwayat Al-Bukhari<br><br>
  Dibina dengan ❤️ untuk ummah.<br>
  🌙 Semoga menjadi amal jariah.
</p>
```

---
