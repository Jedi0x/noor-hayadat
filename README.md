# QuranScan

Identify Quranic verses, Hadith, and Azkar from screenshots using Google Gemini Vision AI. Results are displayed with authentic Indo-Pak Arabic typography, full diacritical marks (shadda, maddah, harakat), and Urdu translations in a shareable card format.

---

## Features

- AI-powered recognition of Quran, Hadith, and Azkar from images
- Authentic Indo-Pak Mushaf fonts with complete tashkeel
- Urdu translation in Nastaliq calligraphy
- English transliteration and meaning
- Download result as high-resolution image or share via Web Share API
- Audio playback for Quranic verses

---

## Prerequisites

- Node.js 18+
- MySQL server (WAMP, XAMPP, or standalone)
- Google Gemini API key — [Get one here](https://aistudio.google.com/app/apikey)

---

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
DATABASE_URL="mysql://root:@localhost:3306/quran_scanner"
GEMINI_API_KEY="your_key_here"
```

### 3. Create the database

```sql
CREATE DATABASE quran_scanner CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Push schema

```bash
npm run db:push
```

### 5. Seed Quran data

```bash
npm run seed:quran
```

> Takes 5–10 minutes. Seeds all 114 surahs and 6,236 verses with full diacritics in Uthmani script, Indo-Pak script, and Urdu translation.

Optionally seed Hadith and Azkar:

```bash
npm run seed:hadith
npm run seed:azkar
# or everything at once:
npm run seed:all
```

### 6. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Production build |
| `npm run db:push` | Push Prisma schema to database |
| `npm run db:studio` | Open Prisma Studio |
| `npm run seed:quran` | Seed complete Quran (required) |
| `npm run seed:hadith` | Seed Hadith collections |
| `npm run seed:azkar` | Seed morning/evening supplications |
| `npm run seed:all` | Seed everything |

---

## Project Structure

```
├── app/                  # Next.js App Router pages and API routes
├── components/           # UI components
│   ├── layout/           # Header, Footer
│   ├── result/           # Result card, Arabic display, action bar
│   ├── scanner/          # Scanning overlay, progress steps
│   ├── ui/               # Shared UI elements
│   └── upload/           # Dropzone, image cropper
├── lib/                  # Core logic (Gemini, lookups, Arabic utils)
├── prisma/               # Schema and seed scripts
├── public/fonts/         # Arabic and Urdu font files
└── styles/               # Arabic typography CSS
```

---

## Fonts (optional)

The app uses Google Fonts (Amiri Quran, Scheherazade New) by default. For authentic Indo-Pak Mushaf rendering, place these font files in `public/fonts/`:

- **Al Qalam Quran** / **PDMS Saleem QuranFont** — Indo-Pak script
- **Nafees Nastaleeq** — Urdu Nastaliq

See `public/fonts/README.md` for download links and instructions.

---

## Why seeding matters

Without seeding the database, the app falls back to AI-extracted text which may be missing diacritical marks. After running `npm run seed:quran`, the app retrieves verified Quranic text with complete tashkeel directly from the database.

---

## Tech stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: MySQL via Prisma ORM
- **AI**: Google Gemini 1.5 Flash
- **Animations**: Framer Motion
- **Image processing**: Sharp, html2canvas

---

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `DATABASE_URL` | Yes | MySQL connection string |
| `GEMINI_API_KEY` | Yes | Google AI Studio key |
| `NEXT_PUBLIC_APP_URL` | No | Deployed app URL |
| `SUNNAH_API_KEY` | No | Sunnah.com API key |

---

## Credits

- Quran data: [quran.com API](https://quran.com)
- Hadith data: [sunnah.com](https://sunnah.com)
- Azkar: Hisnul Muslim
- Fonts: PDMS, Nafees, Amiri, Scheherazade
