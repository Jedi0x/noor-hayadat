# 📖 Quran Ayat & Azkar Scanner WebApp (QuranScan)

QuranScan is a modern web application that identifies Quranic Ayat, Hadith, or Azkar from screenshots using Google Gemini Vision AI. It provides accurate references, IndoPak Arabic text, and Urdu translations in a beautifully rendered, shareable card format.

---

## 🚀 Step-by-Step Setup Guide

Follow these instructions to get the project running on your local machine.

### 1. Prerequisites

Ensure you have the following installed:
- **Node.js 18+**
- **MySQL Server** (WAMP, XAMPP, or a standalone MySQL installation)
- **Google Gemini API Key** (Get it from [Google AI Studio](https://aistudio.google.com/app/apikey))

---

### 2. Database Setup (MySQL)

1.  **Start MySQL**: Ensure your MySQL server is running (e.g., start WAMP/XAMPP).
2.  **Create Database**: Open your MySQL terminal or a tool like phpMyAdmin and create a new database named `quran_scanner`:
    ```sql
    CREATE DATABASE quran_scanner CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
    ```

---

### 3. Project Initialization

1.  **Clone/Open the Project**: Open the project folder in your IDE (e.g., Cursor or VS Code).
2.  **Install Dependencies**:
    ```bash
    npm install
    ```

---

### 4. Configuration

1.  **Create `.env.local`**: Copy the contents of `.env.local.example` into a new file named `.env.local`.
    ```bash
    cp .env.local.example .env.local
    ```
2.  **Edit `.env.local`**: Update the following variables:
    - `DATABASE_URL`: Change this to your MySQL connection string.
      - Format: `mysql://USER:PASSWORD@localhost:3306/quran_scanner`
      - *Note: If you are using WAMP with no password, it might look like: `mysql://root:@localhost:3306/quran_scanner`*
    - `GEMINI_API_KEY`: Paste your API key from Google AI Studio.

---

### 5. Font Assets

For the IndoPak Arabic and Urdu Nastaliq fonts to render correctly, ensure the following files are in the `public/fonts/` directory:
- `NoorHiraArabic.woff2`
- `NafeesWebNaskh.woff2`

---

### 6. Database Migration & Seeding

1.  **Sync Database Schema**: Run the Prisma migration to create the tables in your MySQL database:
    ```bash
    npx prisma db push
    ```
2.  **Seed Data**: Run the seed scripts to populate the database with Quranic surahs, Hadith books, and sample Azkar:
    ```bash
    # Seed Surahs (fetches from quran.com API)
    npm run seed:quran

    # Seed Hadith Books
    npm run seed:hadith

    # Seed Sample Azkar
    npm run seed:azkar
    ```

---

### 7. Running the Application

1.  **Start the Development Server**:
    ```bash
    npm run dev
    ```
2.  **Open in Browser**: Navigate to [http://localhost:3000](http://localhost:3000).

---

## 🛠 Project Structure

- `app/`: Next.js 14 App Router (Pages & API routes)
- `components/`: Reusable UI components (Upload, Result Card, etc.)
- `lib/`: Core logic (Gemini API, Reference lookup, Arabic utils)
- `prisma/`: Database schema and seed scripts
- `styles/`: Custom CSS (Tailwind + Arabic font styles)
- `public/`: Static assets (Fonts, Images)

---

## 📜 Key Commands

- `npm run dev`: Starts the development server.
- `npx prisma studio`: Opens a GUI to view and edit your database records.
- `npx prisma generate`: Regenerates the Prisma client (run this after changing `schema.prisma`).
- `npx prisma db push`: Pushes the Prisma schema to the database.

---

## 🤝 Support

If you encounter any issues, please ensure your MySQL connection string is correct and your Gemini API key is active.
