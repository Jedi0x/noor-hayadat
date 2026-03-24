# Indo-Pak Quran & Urdu Fonts

## ✅ Installed Fonts

Your `public/fonts/` directory contains the following authentic Indo-Pak Quranic fonts:

### 1. **Al Qalam Quran** (`Al Qalam Quran.ttf`)
- Traditional calligraphic Quranic font
- Excellent for Indo-Pak Mushaf rendering
- **Priority #1** in the font stack

### 2. **PDMS Saleem QuranFont** (`PDMS_Saleem_QuranFont.ttf` & `.woff2`)
- Most popular Indo-Pak Mushaf font
- Full harakat support
- **Priority #2** in the font stack

### 3. **Al Majeed Quranic Font** (`Al Majeed Quranic Font_shiped.ttf`)
- Elegant Mushaf-style typography
- Great diacritic rendering
- **Priority #3** in the font stack

### 4. **Hafs** (`Hafs.ttf`)
- Classic Quranic font
- Standard Naskh with tashkeel
- Used for general Arabic text

### 5. **Nabi** (`Nabi.ttf`)
- Decorative Quranic font
- Beautiful for titles and headers
- Alternative style option

---

## 🎨 How Fonts Are Used

The app uses a **cascading font stack** for the best rendering:

### Main Quranic Arabic (`.arabic-indopak`)
```css
font-family: 'Al Qalam Quran', 'PDMS Saleem QuranFont', 'Al Majeed Quranic', 
             'Hafs', 'Amiri Quran', 'Scheherazade New'...
```

The browser tries fonts in order:
1. **Al Qalam Quran** (local) - if available
2. **PDMS Saleem QuranFont** (local) - if available
3. **Al Majeed Quranic** (local) - if available
4. **Hafs** (local) - if available
5. **Amiri Quran** (Google Fonts) - always available
6. **Scheherazade New** (Google Fonts) - fallback

### Urdu Nastaliq (`.urdu-text`)
```css
font-family: 'Nafees Nastaleeq', 'Noto Nastaliq Urdu'...
```

---

## 📥 Optional: Add More Fonts

### Recommended: Nafees Nastaleeq (Urdu)

**Download:** [cle.org.pk/software/localization/Fonts/nafeesNastaleeq.html](https://www.cle.org.pk/software/localization/Fonts/nafeesNastaleeq.html)

**Steps:**
1. Download `Nafees_Nastaleeq.ttf`
2. Optional: Convert to WOFF2 for faster loading: [cloudconvert.com/ttf-to-woff2](https://cloudconvert.com/ttf-to-woff2)
3. Place in this folder:
   - `Nafees_Nastaleeq.woff2`
   - `Nafees_Nastaleeq.ttf`
4. Restart dev server: `npm run dev`

---

## 🔧 Font File Formats

### TTF (TrueType Font)
- Universal compatibility
- Larger file size
- Your current fonts are TTF

### WOFF2 (Web Open Font Format 2)
- Optimized for web (50-70% smaller)
- Faster loading
- Recommended for production

**Convert your fonts:**
1. Go to [cloudconvert.com/ttf-to-woff2](https://cloudconvert.com/ttf-to-woff2)
2. Upload each TTF file
3. Download WOFF2 versions
4. Place alongside TTF files

The CSS is already configured to use WOFF2 first (if present), then fall back to TTF.

---

## 🎯 Font Features

All fonts support:
- ✅ Full harakat (fatha, kasra, damma, sukun, tanween)
- ✅ Shadda (ّ) - gemination mark
- ✅ Maddah (ٓ) - elongation mark
- ✅ Hamza variants
- ✅ Pause marks (۝ ۩ ۞)
- ✅ Unicode Arabic range (U+0600 to U+06FF)

---

## 🌟 Current Configuration

Your `styles/arabic.css` is configured to use all your fonts with optimized settings:

- **Font size:** `clamp(2.5rem, 6.5vw, 4.5rem)` (responsive)
- **Line height:** `2.75` (proper spacing for diacritics)
- **Letter spacing:** `0.015em` (traditional Mushaf spacing)
- **Word spacing:** `0.2em` (improved readability)
- **Font features:** Kerning, ligatures, contextual alternates

---

## 🚀 Result

With these fonts, your QuranScan now renders Arabic text **exactly like a printed Indo-Pak Mushaf** with:
- Authentic calligraphic style
- Proper diacritic placement
- Traditional spacing and flow
- Beautiful, reverent appearance

No additional setup needed—the fonts are ready to use!
