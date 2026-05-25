# 🔌 Al‑Fatihah Analysis System – API_SPEC.md

> **Endpoint & Data Schema Reference** for the Al‑Fatihah interactive learning app.  
> This specification defines the data model used across the system and outlines a hypothetical RESTful API for dynamic content delivery.

---

## 0. Important Note: Current Implementation

The current system is **fully static**. All data is hard‑coded directly into HTML files. There is no live API serving content.

This document serves **two purposes**:

1. **Data Schema Definition** – Formally defines the data model currently embedded in the HTML (per‑word analysis, translations, etc.).
2. **Future API Blueprint** – Provides a reference for anyone who wishes to build a dynamic backend (e.g., a headless CMS, a Node.js/Express API, or a CDN‑hosted JSON endpoint) to serve Al‑Fatihah content to the frontend.

---

## 1. Data Model (Core Schema)

### 1.1 `Ayah` Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `integer` | ✅ | Ayah number (1–7) |
| `surah_number` | `integer` | ✅ | Always `1` (Al‑Fatihah) |
| `arabic_full` | `string` | ✅ | Full Arabic text of the ayah |
| `translation_malay` | `string` | ✅ | Complete Malay translation |
| `words` | `array` of `Word` | ✅ | Per‑word analysis (see §1.2) |
| `metadata` | `Metadata` | ❌ | Additional ayah info (see §1.4) |

### 1.2 `Word` Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `index` | `integer` | ✅ | Position within the ayah (1‑based) |
| `arabic` | `string` | ✅ | The Arabic word |
| `meaning_malay` | `string` | ✅ | Malay gloss (per‑kata) |
| `tajwid` | `TajwidAnalysis` | ✅ | Hukum tajwid for this word |
| `makhraj` | `MakhrajAnalysis` | ✅ | Articulation points for each letter |
| `sifat` | `SifatAnalysis` | ✅ | Sifat huruf for each letter |

### 1.3 Sub‑Objects

**`TajwidAnalysis`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rules` | `array` of `string` | ✅ | List of hukum tajwid applied to this word |

**`MakhrajAnalysis`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `letters` | `array` of `LetterMakhraj` | ✅ | One entry per letter in the word |

**`LetterMakhraj`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `letter` | `string` | ✅ | Single Arabic character |
| `makhraj` | `string` | ✅ | Articulation point in Malay (e.g., `"Lisan (hujung lidah – gusi)"`) |
| `category` | `string` | ❌ | Broad category (`"Jauf"`, `"Halq"`, `"Lisan"`, `"Syafatain"`, `"Khaisyum"`) |

**`SifatAnalysis`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `letters` | `array` of `LetterSifat` | ✅ | One entry per letter in the word |

**`LetterSifat`**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `letter` | `string` | ✅ | Single Arabic character |
| `sifat_opposite` | `array` of `string` | ✅ | Sifat berlawanan (e.g., `["Jahr", "Syiddah"]`) |
| `sifat_single` | `array` of `string` | ❌ | Sifat tunggal if any (e.g., `["Safir"]`, `["Qalqalah"]`) |

### 1.4 `Metadata` Object (Optional)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string` | ❌ | Common name of the ayah (e.g., `"Basmalah"`) |
| `number_of_words` | `integer` | ❌ | Word count |
| `number_of_letters` | `integer` | ❌ | Letter count |
| `tafsir_summary` | `string` | ❌ | Short tafsir note (from Ibnu Kathir) |

---

## 2. JSON Example: Ayat 1 (Basmalah)

```json
{
  "id": 1,
  "surah_number": 1,
  "arabic_full": "بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ",
  "translation_malay": "Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani.",
  "words": [
    {
      "index": 1,
      "arabic": "بِسْمِ",
      "meaning_malay": "Dengan nama",
      "tajwid": {
        "rules": [
          "Izhar: Huruf س (sin) sukun disebut jelas tanpa dengung."
        ]
      },
      "makhraj": {
        "letters": [
          { "letter": "ب", "makhraj": "Syafatain (kedua bibir)", "category": "Syafatain" },
          { "letter": "س", "makhraj": "Asnan (hujung lidah – gigi bawah)", "category": "Lisan" },
          { "letter": "م", "makhraj": "Syafatain (kedua bibir)", "category": "Syafatain" }
        ]
      },
      "sifat": {
        "letters": [
          { "letter": "ب", "sifat_opposite": ["Jahr", "Syiddah", "Istifal", "Infitah"], "sifat_single": ["Idzlaq"] },
          { "letter": "س", "sifat_opposite": ["Hams", "Rakhawah", "Istifal", "Infitah"], "sifat_single": ["Safir"] },
          { "letter": "م", "sifat_opposite": ["Jahr", "Rakhawah", "Istifal", "Infitah"], "sifat_single": ["Idzlaq"] }
        ]
      }
    },
    {
      "index": 2,
      "arabic": "ٱللَّهِ",
      "meaning_malay": "Allah",
      "tajwid": {
        "rules": [
          "Hamzatul Wasl: Digugurkan (bersambung).",
          "Idgham Syamsi: Lam ta'rif masuk ke lam Jalalah (syaddah).",
          "Lam Tarqiq: Lam dibaca nipis (didahului kasrah)."
        ]
      },
      "makhraj": {
        "letters": [
          { "letter": "ا", "makhraj": "Jauf (rongga mulut)", "category": "Jauf" },
          { "letter": "ل", "makhraj": "Lisan (tepi lidah – lelangit atas)", "category": "Lisan" },
          { "letter": "ه", "makhraj": "Halq (pangkal tekak paling dalam)", "category": "Halq" }
        ]
      },
      "sifat": {
        "letters": [
          { "letter": "ا", "sifat_opposite": ["Jahr", "Rakhawah", "Istifal", "Infitah"], "sifat_single": [] },
          { "letter": "ل", "sifat_opposite": ["Jahr", "Rakhawah", "Istifal", "Infitah"], "sifat_single": ["Inhiraf"] },
          { "letter": "ه", "sifat_opposite": ["Hams", "Rakhawah", "Istifal", "Infitah"], "sifat_single": [] }
        ]
      }
    },
    {
      "index": 3,
      "arabic": "ٱلرَّحْمَـٰنِ",
      "meaning_malay": "Yang Maha Pemurah",
      "tajwid": {
        "rules": [
          "Hamzatul Wasl: Digugurkan.",
          "Idgham Syamsi: Lam ta'rif masuk ke ر (ra) (syaddah).",
          "Ra Tafkhim: Ra berbaris fathah → tebal.",
          "Mad Thabi'i: Ha (ح) diikuti alif → 2 harakat."
        ]
      },
      "makhraj": {
        "letters": [
          { "letter": "ر", "makhraj": "Lisan (hujung lidah – gusi atas)", "category": "Lisan" },
          { "letter": "ح", "makhraj": "Halq (tengah tekak)", "category": "Halq" },
          { "letter": "م", "makhraj": "Syafatain (kedua bibir)", "category": "Syafatain" },
          { "letter": "ن", "makhraj": "Lisan (hujung lidah – gusi atas)", "category": "Lisan" }
        ]
      },
      "sifat": {
        "letters": [
          { "letter": "ر", "sifat_opposite": ["Jahr", "Rakhawah", "Istifal", "Infitah"], "sifat_single": ["Takrir", "Inhiraf"] },
          { "letter": "ح", "sifat_opposite": ["Hams", "Rakhawah", "Istifal", "Infitah"], "sifat_single": [] },
          { "letter": "م", "sifat_opposite": ["Jahr", "Rakhawah", "Istifal", "Infitah"], "sifat_single": ["Idzlaq"] },
          { "letter": "ن", "sifat_opposite": ["Jahr", "Rakhawah", "Istifal", "Infitah"], "sifat_single": ["Idzlaq"] }
        ]
      }
    },
    {
      "index": 4,
      "arabic": "ٱلرَّحِيمِ",
      "meaning_malay": "Lagi Maha Mengasihani",
      "tajwid": {
        "rules": [
          "Hamzatul Wasl: Digugurkan.",
          "Idgham Syamsi: Lam ta'rif masuk ke ر (ra) (syaddah).",
          "Ra Tafkhim: Ra berbaris fathah → tebal.",
          "Mad Thabi'i: Ha (ح) diikuti ya sukun → 2 harakat."
        ]
      },
      "makhraj": {
        "letters": [
          { "letter": "ر", "makhraj": "Lisan (hujung lidah – gusi atas)", "category": "Lisan" },
          { "letter": "ح", "makhraj": "Halq (tengah tekak)", "category": "Halq" },
          { "letter": "ي", "makhraj": "Jauf (rongga mulut) – mad", "category": "Jauf" },
          { "letter": "م", "makhraj": "Syafatain (kedua bibir)", "category": "Syafatain" }
        ]
      },
      "sifat": {
        "letters": [
          { "letter": "ر", "sifat_opposite": ["Jahr", "Rakhawah", "Istifal", "Infitah"], "sifat_single": ["Takrir", "Inhiraf"] },
          { "letter": "ح", "sifat_opposite": ["Hams", "Rakhawah", "Istifal", "Infitah"], "sifat_single": [] },
          { "letter": "ي", "sifat_opposite": ["Jahr", "Rakhawah", "Istifal", "Infitah"], "sifat_single": [] },
          { "letter": "م", "sifat_opposite": ["Jahr", "Rakhawah", "Istifal", "Infitah"], "sifat_single": ["Idzlaq"] }
        ]
      }
    }
  ],
  "metadata": {
    "name": "Basmalah",
    "number_of_words": 4,
    "number_of_letters": 19
  }
}
```

---

## 3. Hypothetical REST API Endpoints

If a backend were to serve this data, the following endpoints are proposed.

### 3.1 Base URL

```
https://api.alfatihah.com/v1
```

### 3.2 Endpoints

#### `GET /surah/1`

Retrieve all 7 ayahs with full analysis.

**Response** `200 OK`
```json
{
  "surah_number": 1,
  "surah_name": "Al‑Fatihah",
  "ayahs": [ ... ]  // array of Ayah objects
}
```

---

#### `GET /surah/1/ayah/{id}`

Retrieve a single ayah by its number (1‑7).

**Path Parameters**
| Name | Type | Description |
|------|------|-------------|
| `id` | `integer` | Ayah number (1‑7) |

**Response** `200 OK`
```json
{
  "id": 1,
  "surah_number": 1,
  "arabic_full": "...",
  ...
}
```

**Error** `404 Not Found`
```json
{ "error": "Ayah not found. Surah Al‑Fatihah has 7 ayahs." }
```

---

#### `GET /surah/1/ayah/{id}/words`

Retrieve only the word‑level analysis for an ayah.

**Response** `200 OK`
```json
{
  "id": 1,
  "words": [ ... ]  // array of Word objects
}
```

---

#### `GET /themes`

Returns available theme definitions (colours, variables) for the frontend. Useful if themes are to be managed server‑side.

**Response** `200 OK`
```json
{
  "themes": {
    "light": {
      "bg": "#ffffff",
      "text": "#1e1e1e",
      "accent": "#2c3e50",
      "...": "..."
    },
    "dark": { ... },
    "coffee": { ... }
  }
}
```

---

## 4. Data Consistency Rules

1. **Arabic text** must be encoded in UTF‑8 with full diacritics.
2. **Word order** must match the ayah exactly; `index` fields must be consecutive.
3. **Letter arrays** (`makhraj.letters`, `sifat.letters`) must list each letter of the word in the correct RTL order.
4. **Sifat** must include at least 5 opposite pairs (`Jahr/Hams`, `Syiddah/Rakhawah`, `Isti'la'/Istifal`, `Itbaq/Infitah`, `Idzlaq/Ismat`). Single sifat are optional extras.
5. All **Malay text** (meanings, hukum descriptions) should be in standard Bahasa Melayu.

---

## 5. Static vs Dynamic: Migration Path

Currently, the frontend reads data directly from hard‑coded HTML.

To migrate to a dynamic backend:

1. **Extract JSON**: Convert the in‑HTML data into JSON files matching the schema above.
2. **Serve JSON**: Host the JSON files on a CDN or a simple API server.
3. **Update Frontend**: Replace the inner HTML blocks with `fetch()` calls that populate the `ayat-content` divs dynamically.
4. **Fallback**: Keep the static HTML as a fallback for offline use (the static site can be the offline bundle).

This architecture provides a clear upgrade path without breaking the current design.

---

*API specification for the Al‑Fatihah Analysis System – defines the data model and future endpoints.*  
🔌
```
