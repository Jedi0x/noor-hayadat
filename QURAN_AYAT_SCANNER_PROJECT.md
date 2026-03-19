# 📖 Quran Ayat & Azkar Scanner WebApp
## Complete Project Blueprint — Solution Architecture & Developer Specification

---

> **Document Type:** Full Project Specification  
> **Version:** 1.0.0  
> **Audience:** Full-Stack Developers, Solution Architects, AI Integration Engineers  
> **Stack:** Next.js 14 · Node.js · MySQL · Google Gemini Vision API · Arabic NLP  

---

## 🎯 Project Goal

Build a **web application** where a user uploads a screenshot containing **Quranic Ayat, Dua, or Azkar** (from any source — WhatsApp, social media, books, etc.). The AI vision model analyzes the Arabic text in the image, **identifies the exact ayat or supplication**, fetches its verified reference, and returns a beautifully rendered card with:

- ✅ Complete Arabic text in **IndoPak Quranic font**
- ✅ Urdu translation
- ✅ Exact reference (Surah name + Ayat number OR Hadith book + chapter + number)
- ✅ Transliteration (optional toggle)
- ✅ Shareable/downloadable card output

---

## 🧭 Problem Statement

Muslims in Pakistan and India regularly encounter Quranic ayat and Islamic supplications shared as screenshots on social media. These screenshots often:

- Are poorly formatted
- Lack full context (only partial ayat shown)
- Have missing or unverified references
- Are in low-resolution images
- Use inconsistent Arabic script styles

This app **solves the verification and completeness problem** by using AI vision to extract partial Arabic from any screenshot, complete it from a verified Quran/Hadith database, and present it in a dignified, scholarly format.

---

## 🗺️ High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                             │
│  Next.js 14 App Router · TailwindCSS · Arabic Font (IndoPak)        │
│                                                                      │
│   [Upload Screenshot] ──► [Preview + Crop UI] ──► [Submit]          │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ HTTPS multipart/form-data
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                       API LAYER (Next.js API Routes)                │
│                                                                      │
│  /api/analyze  ──► Image Preprocessing ──► Gemini Vision API        │
│                                                  │                  │
│                                                  ▼                  │
│                         Arabic Text Extraction + Classification      │
│                         (Ayat | Dua | Azkar | Unknown)              │
│                                                  │                  │
│                                                  ▼                  │
│                    ┌─────────────────────────────────┐              │
│                    │   Reference Resolution Engine    │              │
│                    │                                 │              │
│                    │  Quran DB  ◄──► Fuzzy Match      │              │
│                    │  Hadith DB ◄──► Semantic Search  │              │
│                    │  External Quran API (fallback)   │              │
│                    └─────────────────────────────────┘              │
│                                                  │                  │
│                                                  ▼                  │
│                         Response Builder (Arabic + Urdu + Ref)      │
└────────────────────────────────┬────────────────────────────────────┘
                                 │ JSON Response
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     DATABASE LAYER                                   │
│                                                                      │
│  PostgreSQL / MySQL                                                  │
│  ├── quran_surahs      (114 surahs with metadata)                    │
│  ├── quran_ayahs       (6,236 ayahs, Arabic + Urdu translations)     │
│  ├── quran_editions    (IndoPak, Uthmani, Simple scripts)            │
│  ├── hadith_books      (Bukhari, Muslim, Abu Dawud, Tirmidhi, etc.)  │
│  ├── azkar             (morning, evening, salah, sleep azkar)        │
│  └── search_cache      (cached AI lookups to reduce API calls)       │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend
| Layer | Technology | Rationale |
|---|---|---|
| Framework | **Next.js 14** (App Router) | SSR + API routes in one project |
| Styling | **TailwindCSS** + custom CSS | Utility-first + Arabic RTL support |
| Arabic Font | **PDMS Saleem / Noor-e-Hira / Noto Naskh Arabic** (IndoPak style) | Authentic IndoPak script rendering |
| State | **Zustand** or React Context | Lightweight, no Redux overhead |
| Image Crop | **react-image-crop** | Let user crop the relevant part |
| Animations | **Framer Motion** | Result card entrance animations |
| Icons | **Lucide React** | Consistent iconography |
| Share | **html2canvas** + **FileSaver.js** | Download result as image card |

### Backend
| Layer | Technology | Rationale |
|---|---|---|
| Runtime | **Node.js 20+** via Next.js API routes | Unified codebase |
| AI Vision | **Google Gemini 1.5 Flash** (free tier) | Free, multimodal, strong Arabic OCR |
| AI Fallback | **GPT-4o-mini** or **Groq Llama Vision** | Backup if Gemini quota exceeded |
| Fuzzy Search | **Fuse.js** (client) + **pg_trgm** (DB) | Fuzzy Arabic string matching |
| ORM | **Prisma** | Type-safe DB access |
| Validation | **Zod** | Schema validation for API inputs |
| Rate Limiting | **Upstash Redis** (free tier) | Prevent API abuse |

### Database
| Source | Description |
|---|---|
| **AbdullahGhanem/quran-database** | MySQL dump — surahs, ayahs, editions, ayah_edition tables |
| **quran.com API (v4)** | Public REST API for Quran text + Urdu translations (free) |
| **sunnah.com API** | Hadith API for Bukhari, Muslim, etc. (free tier) |
| **Local Azkar DB** | Curated JSON/SQL of Hisnul Muslim azkar with references |

### Infrastructure (Suggested Free Tier)
| Service | Provider |
|---|---|
| Hosting | **Vercel** (Next.js native) |
| Database | **MySQL** (WAMP/XAMPP or local installation) |
| File Storage | **Cloudinary** free tier (image upload/processing) |
| AI API | **Google AI Studio** (Gemini free quota) |
| Cache/Rate Limit | **MySQL** (internal search_cache table) |

---

## 🗄️ Database Schema

### Based on AbdullahGhanem/quran-database

The original repo contains a MySQL dump (`quran.sql.zip`) with these tables. We extend it:

```sql
-- ORIGINAL TABLES (from AbdullahGhanem/quran-database) --

CREATE TABLE surahs (
  id          INT PRIMARY KEY,         -- 1-114
  name        VARCHAR(50),             -- Arabic name e.g. الفاتحة
  name_simple VARCHAR(50),             -- Al-Fatihah
  revelation  ENUM('Meccan','Medinan'),
  ayahs_count INT
);

CREATE TABLE editions (
  id         INT PRIMARY KEY,
  identifier VARCHAR(50),              -- e.g. 'quran-uthmani', 'ur.ahmedali'
  language   VARCHAR(10),
  name       VARCHAR(100),
  type       ENUM('quran','translation','transliteration')
);

CREATE TABLE ayahs (
  id        INT PRIMARY KEY,
  surah_id  INT REFERENCES surahs(id),
  number    INT,                        -- ayah number within surah
  text      TEXT                        -- Arabic Uthmani text
);

CREATE TABLE ayah_editions (
  id         INT PRIMARY KEY,
  ayah_id    INT REFERENCES ayahs(id),
  edition_id INT REFERENCES editions(id),
  text       TEXT                        -- Translated/script variant text
);

-- EXTENDED TABLES (added by this project) --

CREATE TABLE ayahs_indopak (
  ayah_id   INT PRIMARY KEY REFERENCES ayahs(id),
  text_ip   TEXT NOT NULL               -- IndoPak script Arabic
);

CREATE TABLE ayahs_urdu (
  ayah_id      INT PRIMARY KEY REFERENCES ayahs(id),
  translation  TEXT NOT NULL,           -- Urdu translation (Mufti Taqi Usmani preferred)
  translator   VARCHAR(100)
);

CREATE TABLE hadith_books (
  id         SERIAL PRIMARY KEY,
  name_ar    VARCHAR(100),              -- e.g. صحيح البخاري
  name_en    VARCHAR(100),              -- Sahih al-Bukhari
  name_ur    VARCHAR(100),              -- صحیح بخاری
  identifier VARCHAR(50) UNIQUE         -- bukhari, muslim, abudawud, tirmidhi, nasai, ibnmajah
);

CREATE TABLE hadiths (
  id           SERIAL PRIMARY KEY,
  book_id      INT REFERENCES hadith_books(id),
  chapter_no   INT,
  hadith_no    VARCHAR(20),             -- Can be "1234" or "1234a"
  text_ar      TEXT,
  text_ur      TEXT,
  chain        TEXT,                    -- Isnad (narrator chain)
  grade        VARCHAR(50)              -- Sahih, Hasan, Da'if, etc.
);

CREATE TABLE azkar (
  id           SERIAL PRIMARY KEY,
  category     VARCHAR(100),            -- morning, evening, sleep, after_salah, etc.
  text_ar      TEXT NOT NULL,
  text_ar_ip   TEXT,                    -- IndoPak script
  text_ur      TEXT,
  transliteration TEXT,
  reference    TEXT,                    -- e.g. Hisnul Muslim #123
  source_book  VARCHAR(100),
  repetitions  INT DEFAULT 1,
  benefits     TEXT
);

CREATE TABLE search_cache (
  id           SERIAL PRIMARY KEY,
  image_hash   VARCHAR(64) UNIQUE,      -- SHA256 of uploaded image
  extracted_ar TEXT,                    -- What Gemini extracted
  result_type  VARCHAR(20),             -- ayat | hadith | azkar | unknown
  result_id    INT,
  result_json  JSONB,
  created_at   TIMESTAMP DEFAULT NOW()
);
```

---

## 🤖 AI Integration — Google Gemini Vision

### API: Gemini 1.5 Flash (Free Tier)
- **Endpoint:** `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent`
- **Free Quota:** 15 requests/minute, 1,500 requests/day (as of 2025)
- **Setup:** Get API key from [Google AI Studio](https://aistudio.google.com/app/apikey)

### Master AI Prompt (send with image)

```
You are an expert Islamic scholar and Arabic text recognition specialist.

I am sending you a screenshot that contains Arabic text from the Quran, a Hadith, a Dua, or an Islamic Azkar (remembrance).

YOUR TASK:
1. Extract ALL Arabic text visible in the image, reading right-to-left
2. Identify the TYPE of content: [AYAT | HADITH | DUA | AZKAR | UNKNOWN]
3. If AYAT: Identify the Surah name and Ayat number(s)
4. If HADITH: Identify which hadith book, chapter, and number if visible
5. If DUA/AZKAR: Identify the common name of this supplication
6. Extract any reference information already shown in the image
7. Note if the text in the image appears COMPLETE or PARTIAL

RESPOND ONLY in this exact JSON format:
{
  "type": "AYAT|HADITH|DUA|AZKAR|UNKNOWN",
  "extracted_arabic": "exact arabic text from image",
  "is_complete": true|false,
  "surah_name": "if AYAT — arabic surah name",
  "surah_number": null or integer,
  "ayat_start": null or integer,
  "ayat_end": null or integer,
  "hadith_book": "if HADITH — book name",
  "hadith_number": "if HADITH — hadith number",
  "azkar_category": "if AZKAR — morning|evening|sleep|salah|general",
  "dua_name": "common name of dua if known",
  "reference_in_image": "any reference text visible in image",
  "confidence": "HIGH|MEDIUM|LOW",
  "notes": "any important observations"
}

IMPORTANT:
- Be precise with Arabic text extraction
- If Surah/Ayat numbers are identifiable from context even without labels, include them
- Do NOT translate — only extract and identify
- If confidence is LOW, still try your best and mark it accordingly
```

---

## 🗺️ User Journey — Step by Step

### Step 1: Landing Page
- User arrives at the homepage
- Sees a clean, elegant UI with Islamic geometric design motifs
- Hero section: "اسکین کریں، پہچانیں، محفوظ کریں" (Scan, Identify, Preserve)
- Single prominent **Upload Button** in center
- Examples of output cards shown below (static previews)

### Step 2: Upload & Preview
- User clicks upload or **drags and drops** a screenshot
- Accepted formats: PNG, JPG, WEBP (max 10MB)
- Image preview appears immediately in the UI
- Optional: **Crop tool** slides in — user can crop to focus on just the Arabic text
- A **"Scan Now"** button becomes active

### Step 3: Processing State
- User clicks "Scan Now"
- Animated scanning overlay on the image (scanning line moves top to bottom)
- Arabic loading text: "...جاری ہے تلاش" (Search in progress...)
- 3 micro-steps shown with checkmarks as they complete:
  - ✅ تصویر پڑھی جا رہی ہے (Reading image)
  - ✅ عربی متن پہچانا جا رہا ہے (Recognizing Arabic text)
  - ✅ حوالہ تلاش کیا جا رہا ہے (Finding reference)
- Estimated time: 3-8 seconds

### Step 4: Result Card
Result displays as a beautiful card with:

```
┌─────────────────────────────────────────────────────┐
│  [Surah Badge] سورة البقرة — آیت ٢٥٥               │
│                                                     │
│  ╔═══════════════════════════════════════════════╗  │
│  ║                                               ║  │
│  ║   اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ الْحَيُّ   ║  │
│  ║   الْقَيُّومُ ۚ لَا تَأْخُذُهُ سِنَةٌ وَلَا  ║  │
│  ║   نَوْمٌ ۚ ...                                ║  │
│  ║   [Full IndoPak Arabic — Large Font]          ║  │
│  ║                                               ║  │
│  ╚═══════════════════════════════════════════════╝  │
│                                                     │
│  ── اردو ترجمہ ──────────────────────────────────  │
│  "اللہ ہی ہے جس کے سوا کوئی معبود نہیں،            │
│   وہ زندہ ہے، سب کا تھامنے والا ہے..."             │
│                                                     │
│  ── حوالہ ──────────────────────────────────────   │
│  📖 القرآن الکریم | سورة البقرة | آیت: ٢٥٥         │
│     ترجمہ: مفتی تقی عثمانی                         │
│                                                     │
│  [🔊 سنیں] [📋 کاپی] [📥 ڈاؤنلوڈ] [📤 شیئر]      │
└─────────────────────────────────────────────────────┘
```

### Step 5: Actions Available
- **Copy Arabic** — copies IndoPak Arabic text to clipboard
- **Copy Urdu** — copies Urdu translation
- **Download Card** — saves as PNG image (using html2canvas)
- **Share** — Web Share API for WhatsApp/Telegram sharing
- **Listen** — plays audio recitation (via everyayah.com CDN for Quran)
- **New Scan** — resets and allows new upload

### Step 6: Error States
- **Low Confidence Result:** Yellow warning banner — "یہ نتیجہ یقینی نہیں — براہ کرم تصدیق کریں"
- **Not Found:** Show extracted Arabic + Google search link
- **Unreadable Image:** Ask user to try better quality or crop more carefully
- **Network Error:** Retry button with cached last result if available

---

## 📁 Project Folder Structure

```
quran-scanner/
├── app/                            # Next.js 14 App Router
│   ├── (main)/
│   │   ├── page.tsx                # Landing + Upload page
│   │   ├── result/page.tsx         # Result display page
│   │   └── layout.tsx
│   ├── api/
│   │   ├── analyze/route.ts        # Main AI analysis endpoint
│   │   ├── lookup/
│   │   │   ├── ayat/route.ts       # Quran ayat lookup
│   │   │   ├── hadith/route.ts     # Hadith lookup
│   │   │   └── azkar/route.ts      # Azkar lookup
│   │   └── share/route.ts          # OG image generation for sharing
│   └── globals.css
│
├── components/
│   ├── upload/
│   │   ├── DropZone.tsx            # Drag & drop upload area
│   │   ├── ImageCropper.tsx        # Crop tool overlay
│   │   └── UploadPreview.tsx       # Image preview with reset
│   ├── scanner/
│   │   ├── ScanningOverlay.tsx     # Animated scan line overlay
│   │   └── ProgressSteps.tsx       # 3-step progress indicator
│   ├── result/
│   │   ├── ResultCard.tsx          # Main output card
│   │   ├── ArabicDisplay.tsx       # IndoPak Arabic text renderer
│   │   ├── UrduTranslation.tsx     # Urdu text block
│   │   ├── ReferenceBar.tsx        # Surah/Hadith reference badge
│   │   ├── ActionBar.tsx           # Copy/Download/Share buttons
│   │   └── ConfidenceBadge.tsx     # High/Medium/Low indicator
│   ├── ui/
│   │   ├── IslamicPattern.tsx      # SVG geometric background pattern
│   │   └── LoadingDots.tsx
│   └── layout/
│       ├── Header.tsx
│       └── Footer.tsx
│
├── lib/
│   ├── gemini.ts                   # Gemini Vision API client + prompt
│   ├── quran-lookup.ts             # Fuzzy search against Quran DB
│   ├── hadith-lookup.ts            # Hadith DB search
│   ├── azkar-lookup.ts             # Azkar DB search
│   ├── image-hash.ts               # SHA256 for cache key
│   ├── arabic-utils.ts             # Arabic text normalization helpers
│   └── prisma.ts                   # Prisma client singleton
│
├── prisma/
│   ├── schema.prisma               # Full DB schema
│   └── seed/
│       ├── seed-quran.ts           # Import quran.sql from GitHub repo
│       ├── seed-hadith.ts          # Import hadith data
│       └── seed-azkar.ts           # Import Hisnul Muslim azkar
│
├── public/
│   ├── fonts/
│   │   ├── NoorHiraArabic.woff2    # IndoPak Quranic font
│   │   ├── NafeesWebNaskh.woff2    # Urdu Nastaliq font
│   │   └── PDMS_Saleem.woff2       # Alternate IndoPak font
│   └── audio/                      # Sample recitation clips
│
├── styles/
│   └── arabic.css                  # RTL, font-face, ayat display styles
│
├── types/
│   └── index.ts                    # TypeScript interfaces
│
├── hooks/
│   ├── useAnalyze.ts               # Upload + analyze hook
│   └── useShare.ts                 # Sharing logic hook
│
├── .env.local.example
├── next.config.js
├── tailwind.config.js
├── prisma/schema.prisma
└── package.json
```

---

## 🔌 API Endpoints

### POST `/api/analyze`
**Purpose:** Main endpoint — accepts image, returns full result

**Request:**
```
Content-Type: multipart/form-data
Body: { image: File, language_pref: "ur" }
```

**Response:**
```json
{
  "success": true,
  "type": "AYAT",
  "confidence": "HIGH",
  "arabic_indopak": "اللَّهُ لَا إِلَٰهَ إِلَّا هُوَ...",
  "arabic_uthmani": "...",
  "urdu_translation": "اللہ ہی ہے جس کے سوا کوئی معبود نہیں...",
  "transliteration": "Allahu la ilaha illa huwal hayyul qayyum...",
  "reference": {
    "type": "quran",
    "surah_name_ar": "البقرة",
    "surah_name_ur": "البقرہ",
    "surah_number": 2,
    "ayat_start": 255,
    "ayat_end": 255,
    "juz": 3,
    "page": 42
  },
  "audio_url": "https://everyayah.com/data/Alafasy_128kbps/002255.mp3",
  "cached": false
}
```

---

## 🧠 Reference Resolution Logic

The backend follows this **waterfall resolution chain**:

```
Image uploaded
      │
      ▼
[1] Check search_cache by image SHA256 hash
      │ Found? → Return cached result immediately
      │ Not found? ↓
      ▼
[2] Send to Gemini Vision API with master prompt
      │
      ▼
[3] Parse Gemini JSON response
      │ type == AYAT? → [4a]
      │ type == HADITH? → [4b]
      │ type == AZKAR/DUA? → [4c]
      │ type == UNKNOWN? → [4d]
      ▼
[4a] AYAT RESOLUTION:
  (a) If surah_number + ayat_number found → Direct DB lookup → Done ✅
  (b) If only surah name → Look up surah_id, then fuzzy match Arabic in ayahs
  (c) If neither → pg_trgm fuzzy search across all 6,236 ayahs
  (d) Fallback → quran.com API search endpoint
      ▼
[4b] HADITH RESOLUTION:
  (a) If book + hadith_number → Direct DB lookup
  (b) If only text → Semantic similarity in hadiths table
  (c) Fallback → sunnah.com API
      ▼
[4c] AZKAR RESOLUTION:
  (a) Fuzzy match extracted_arabic against azkar.text_ar
  (b) Category filtering if azkar_category known
  (c) Return closest match above 80% similarity threshold
      ▼
[4d] UNKNOWN:
  - Return extracted Arabic as-is
  - Suggest manual lookup with Google/Quran.com links
  - Confidence: LOW
      │
      ▼
[5] Enrich result:
  - Fetch IndoPak text from ayahs_indopak table
  - Fetch Urdu translation from ayahs_urdu table
  - Build audio URL (everyayah.com CDN pattern)
  - Format reference string
      │
      ▼
[6] Cache result in search_cache (by image hash)
      │
      ▼
[7] Return JSON to frontend
```

---

## 🎨 UI Design Specification

### Theme & Aesthetic
- **Color Palette:**
  - Primary Background: Deep emerald `#0D3B2E` / Cream `#F5F0E8`
  - Gold accent: `#C9A84C`
  - Arabic text color: `#1A1008`
  - Card background: `#FFFDF6`
- **Pattern:** Subtle Islamic geometric (star polygon) SVG background
- **Mode:** Light default, dark mode optional
- **Direction:** RTL for all Arabic/Urdu content, LTR for English labels

### Typography
```css
/* IndoPak Quranic Arabic */
@font-face {
  font-family: 'NoorHira';
  src: url('/fonts/NoorHiraArabic.woff2') format('woff2');
}

/* Urdu Nastaliq */
@font-face {
  font-family: 'NafeesWeb';
  src: url('/fonts/NafeesWebNaskh.woff2') format('woff2');
}

.arabic-indopak {
  font-family: 'NoorHira', 'PDMS_Saleem', serif;
  font-size: clamp(1.8rem, 4vw, 3rem);
  line-height: 2.2;
  direction: rtl;
  text-align: right;
  letter-spacing: 0;
}

.urdu-text {
  font-family: 'NafeesWeb', 'Noto Nastaliq Urdu', serif;
  font-size: clamp(1.1rem, 2vw, 1.4rem);
  line-height: 2;
  direction: rtl;
  text-align: right;
}
```

### Key Font Sources (Free & Open)
| Font | Source | License |
|---|---|---|
| Noor-e-Hira Arabic | pdms.com / islamicfonts.org | Free |
| PDMS Saleem | PDMS | Free for non-commercial |
| Noto Nastaliq Urdu | Google Fonts | OFL |
| Scheherazade New | SIL / Google Fonts | OFL |
| Noto Naskh Arabic | Google Fonts | OFL |

**Google Fonts CDN import:**
```html
<link href="https://fonts.googleapis.com/css2?family=Noto+Naskh+Arabic:wght@400;700&family=Noto+Nastaliq+Urdu&family=Scheherazade+New:wght@400;700&display=swap" rel="stylesheet">
```

---

## ⚙️ Environment Variables

```env
# .env.local

# Google Gemini
GEMINI_API_KEY=your_google_ai_studio_key

# Database (Supabase/PlanetScale)
DATABASE_URL=postgresql://user:password@host:5432/qurandb

# Optional: Cloudinary for image hosting
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=

# Optional: Upstash Redis for rate limiting
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=

# Optional fallback APIs
SUNNAH_API_KEY=your_sunnah_api_key

# App Config
NEXT_PUBLIC_APP_URL=https://your-domain.com
MAX_IMAGE_SIZE_MB=10
RATE_LIMIT_PER_MINUTE=10
```

---

## 🗂️ Data Seeding Plan

### Step 1: Import Quran Database
```bash
# Download from AbdullahGhanem/quran-database
wget https://github.com/AbdullahGhanem/quran-database/raw/main/quran.sql.zip
unzip quran.sql.zip

# Import to PostgreSQL (convert from MySQL)
pgloader mysql://root@localhost/quran_source postgresql://user@localhost/qurandb
```

### Step 2: Enrich with IndoPak & Urdu Translations
```bash
# Seed script fetches from quran.com API v4
# Urdu translation ID: 97 (Mufti Taqi Usmani), 158 (Dr. Fateh Muhammad Jallandhari)
npx ts-node prisma/seed/seed-quran.ts

# quran.com API endpoint used:
# GET https://api.quran.com/api/v4/verses/by_chapter/{chapter_id}
#     ?translations=97&fields=text_indopak,text_uthmani,verse_key
```

### Step 3: Import Hadith Data
```bash
# Using sunnah.com API (free, no key needed for read)
# Books: bukhari, muslim, abudawud, tirmidhi, nasai, ibnmajah
npx ts-node prisma/seed/seed-hadith.ts
```

### Step 4: Import Azkar (Hisnul Muslim)
```bash
# Hisnul Muslim data available from:
# https://github.com/abdullahio/hisnul-muslim-app (MIT License)
npx ts-node prisma/seed/seed-azkar.ts
```

---

## 🔐 Security & Rate Limiting

### Image Upload Security
```typescript
// Validate file type (magic bytes, not just extension)
import { fileTypeFromBuffer } from 'file-type';
const detected = await fileTypeFromBuffer(buffer);
if (!['image/jpeg', 'image/png', 'image/webp'].includes(detected?.mime)) {
  throw new Error('Invalid file type');
}

// Max size check
if (buffer.byteLength > 10 * 1024 * 1024) {
  throw new Error('File too large — max 10MB');
}
```

### Rate Limiting (Upstash Redis)
```typescript
import { Ratelimit } from '@upstash/ratelimit';
const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, '1 m'), // 10 req/minute per IP
});
```

### API Key Protection
- Gemini API key **NEVER** exposed to client
- All AI calls made server-side in Next.js API routes
- Image files not persisted — processed in memory, then discarded
- Optional: store only SHA256 hash for cache, never the image itself

---

## 📋 Development Phases & Milestones

### Phase 1 — Foundation (Week 1-2)
- [ ] Next.js 14 project setup with TailwindCSS
- [ ] Database setup (Supabase PostgreSQL)
- [ ] Import quran.sql from AbdullahGhanem/quran-database
- [ ] Seed Quran IndoPak text + Urdu translations via quran.com API
- [ ] Basic upload UI (DropZone component)
- [ ] Gemini API integration (send image, get JSON back)
- [ ] Test Arabic extraction accuracy on sample screenshots

### Phase 2 — Core Engine (Week 3-4)
- [ ] Quran reference resolution engine (fuzzy + exact match)
- [ ] Hadith lookup integration (sunnah.com API)
- [ ] Azkar database seeded + fuzzy matching
- [ ] Result card UI with IndoPak font rendering
- [ ] Urdu translation display
- [ ] Reference badge component
- [ ] Confidence indicator

### Phase 3 — Polish & UX (Week 5)
- [ ] Image crop tool
- [ ] Scanning animation overlay
- [ ] Copy/Download/Share actions
- [ ] Audio playback for Quran ayat
- [ ] Error states (low confidence, not found, bad image)
- [ ] Search cache for repeated images
- [ ] Mobile responsive layout

### Phase 4 — Launch (Week 6)
- [ ] Deploy to Vercel
- [ ] Configure Supabase production DB
- [ ] Rate limiting (Upstash Redis)
- [ ] Performance testing (LCP < 2.5s)
- [ ] Accessibility audit (RTL/screen-reader)
- [ ] Cross-browser testing (Chrome, Safari, Firefox)

---

## 🧪 Testing Strategy

### Unit Tests (Jest)
- Arabic text normalization functions
- Fuzzy search match scoring
- Reference resolution logic
- JSON parsing from Gemini response

### Integration Tests
- Upload → Gemini → DB lookup → Response chain
- Cache hit vs miss scenarios
- Error handling for corrupt images

### Manual QA Checklist
- [ ] Upload Surah Al-Baqarah screenshot → correct ayat displayed
- [ ] Upload partial ayat screenshot → completed correctly
- [ ] Upload Hadith screenshot → correct book/number reference
- [ ] Upload morning azkar screenshot → matched from Hisnul Muslim
- [ ] Upload non-Arabic image → graceful "not found" error
- [ ] Upload blurry image → "improve quality" message
- [ ] Test on mobile (iOS Safari + Android Chrome)
- [ ] Test RTL rendering on all result card components
- [ ] Download card → verify IndoPak font renders in image

---

## 📦 Key NPM Packages

```json
{
  "dependencies": {
    "next": "^14.2.0",
    "react": "^18.3.0",
    "typescript": "^5.4.0",
    "@google/generative-ai": "^0.15.0",
    "@prisma/client": "^5.15.0",
    "tailwindcss": "^3.4.0",
    "framer-motion": "^11.0.0",
    "react-image-crop": "^11.0.0",
    "fuse.js": "^7.0.0",
    "html2canvas": "^1.4.1",
    "file-saver": "^2.0.5",
    "file-type": "^19.0.0",
    "zod": "^3.23.0",
    "@upstash/redis": "^1.31.0",
    "@upstash/ratelimit": "^2.0.0",
    "sharp": "^0.33.0"
  },
  "devDependencies": {
    "prisma": "^5.15.0",
    "@types/react": "^18.3.0",
    "@types/node": "^20.0.0",
    "jest": "^29.0.0",
    "@testing-library/react": "^16.0.0"
  }
}
```

---

## 🔗 External Resources & APIs

| Resource | URL | Notes |
|---|---|---|
| Quran DB (source) | github.com/AbdullahGhanem/quran-database | MySQL dump with surahs/ayahs/editions |
| quran.com API v4 | api.quran.com/api/v4 | Free, no key required |
| sunnah.com API | sunnah.com/api | Free tier available |
| Hisnul Muslim data | github.com/abdullahio/hisnul-muslim-app | MIT license JSON |
| Google AI Studio | aistudio.google.com | Gemini API key |
| EveryAyah CDN | everyayah.com/data | Free Quran audio MP3 |
| Noto Nastaliq Urdu | fonts.google.com | Google Fonts CDN |
| Scheherazade New | fonts.google.com | SIL Open Font License |

---

## 📤 Sharing / Export Spec

### Download Card (PNG)
- Use `html2canvas` to rasterize the ResultCard component
- Target resolution: 1080×1350 (portrait, Instagram-safe)
- Include: Arabic text, Urdu translation, reference, app watermark
- Watermark: subtle "QuranScan.app" at bottom in light opacity

### Web Share API
```typescript
const shareData = {
  title: `${surahName} — آیت ${ayatNumber}`,
  text: `${arabicText}\n\n${urduTranslation}\n\nحوالہ: ${reference}`,
  url: `${APP_URL}/result/${resultId}`
};
await navigator.share(shareData);
```

### OG Image for Links
- Generate via `/api/share/[id]` using `@vercel/og`
- Shows Arabic text + reference formatted beautifully
- Size: 1200×630px

---

## ⚠️ Known Limitations & Mitigations

| Limitation | Mitigation |
|---|---|
| Gemini may misread heavily stylized Arabic calligraphy | Provide image preprocessing (contrast boost via `sharp`) |
| Partial ayat identification may match wrong surah | Show confidence score + offer "Did you mean?" alternatives |
| Hadith text has many variant narrations | Match on key phrases, show grade (Sahih/Hasan/Da'if) |
| IndoPak fonts not available offline | Preload fonts in `<head>`, fallback to Naskh |
| Free Gemini quota: 1,500/day | Implement cache aggressively; future paid tier upgrade path |
| sunnah.com API rate limits | Local hadith DB as primary; API as fallback only |

---

## 🌐 Deployment Checklist

```bash
# Vercel deployment
vercel --prod

# Environment variables set in Vercel Dashboard:
# GEMINI_API_KEY
# DATABASE_URL
# UPSTASH_REDIS_REST_URL
# UPSTASH_REDIS_REST_TOKEN

# Database migration
npx prisma migrate deploy

# Seed production DB (run once)
npx ts-node prisma/seed/seed-quran.ts
npx ts-node prisma/seed/seed-hadith.ts
npx ts-node prisma/seed/seed-azkar.ts

# Verify deployment
curl -X POST https://your-domain.com/api/analyze \
  -F "image=@test-ayat.png" | jq .
```

---

## 📊 Performance Targets

| Metric | Target |
|---|---|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 2.5s |
| AI Analysis Response Time | < 6s (P95) |
| Cache Hit Response Time | < 200ms |
| Lighthouse Score | > 90 |
| Mobile Usability | 100% |

---

## 🧩 Future Enhancements (v2+)

- [ ] **Batch Upload** — scan multiple screenshots at once
- [ ] **Browser Extension** — scan any Quranic image directly from browser
- [ ] **WhatsApp Bot Integration** — send screenshot, get result in chat
- [ ] **Tajweed Highlighting** — color-code tajweed rules on Arabic text
- [ ] **Tafseer Integration** — brief tafseer from Ibn Kathir / Maarif-ul-Quran
- [ ] **Personal Collection** — save favorite ayat/azkar with auth
- [ ] **Print Mode** — formatted PDF export for Quran classes
- [ ] **Multi-language** — English translation alongside Urdu

---

## 📝 Summary

| Attribute | Detail |
|---|---|
| **App Name** | QuranScan (قرآن اسکین) |
| **Core Function** | Screenshot → AI Vision → Verified Arabic + Urdu + Reference |
| **Primary AI** | Google Gemini 1.5 Flash (Free) |
| **Database Source** | AbdullahGhanem/quran-database + quran.com API + sunnah.com |
| **Script Style** | IndoPak (PDMS/Noor-e-Hira) for Arabic, Nastaliq for Urdu |
| **Framework** | Next.js 14, TailwindCSS, Prisma, PostgreSQL |
| **Hosting** | Vercel + Supabase (fully free tier viable for MVP) |
| **Target Users** | Pakistani & Indian Muslims (Urdu speakers) |
| **MVP Timeline** | 6 weeks for solo developer |
| **Cost at MVP** | $0/month on free tiers |

---

*"وَلَقَدْ يَسَّرْنَا الْقُرْآنَ لِلذِّكْرِ فَهَلْ مِن مُّدَّكِرٍ"*  
*And We have certainly made the Quran easy for remembrance, so is there any who will remember?*  
— Surah Al-Qamar 54:17

---

**Document prepared by:** Solution Architecture Specification  
**Last Updated:** March 2026  
**License:** MIT (for the application code)  
**Quran Data:** Sourced from public Islamic databases — for educational and religious use
