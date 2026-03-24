import { GoogleGenerativeAI } from "@google/generative-ai";
import { z } from "zod";
import { extractTextWithOCR } from "./ocr";

const API_KEY = process.env.GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

export const GeminiResultSchema = z.object({
  type: z.enum(["AYAT", "HADITH", "DUA", "AZKAR", "UNKNOWN"]),
  /** All Arabic script from the image (for matching) */
  extracted_arabic: z.string(),
  /** Only the core Arabic dhikr/ayah/dua for the main card — no Urdu */
  primary_arabic: z.string().nullable().optional(),
  /** Urdu title, hadith chain, narration from the image (not the Arabic block) */
  image_context_ur: z.string().nullable().optional(),
  is_complete: z.boolean(),
  surah_name: z.string().nullable().optional(),
  surah_number: z.number().nullable().optional(),
  ayat_start: z.number().nullable().optional(),
  ayat_end: z.number().nullable().optional(),
  hadith_book: z.string().nullable().optional(),
  hadith_number: z.string().nullable().optional(),
  azkar_category: z.enum(["morning", "evening", "sleep", "salah", "general"]).nullable().optional(),
  dua_name: z.string().nullable().optional(),
  dua_name_en: z.string().nullable().optional(),
  reference_in_image: z.string().nullable().optional(),
  /** Latin letters, e.g. Allahumma inni as'aluka 'ilman nafi'an... */
  transliteration_en: z.string().nullable().optional(),
  /** Short English meaning */
  translation_en: z.string().nullable().optional(),
  /** Urdu translation in Urdu script if you can infer it */
  translation_ur: z.string().nullable().optional(),
  confidence: z.enum(["HIGH", "MEDIUM", "LOW"]),
  notes: z.string().nullable().optional()
});

export type GeminiResult = z.infer<typeof GeminiResultSchema>;

export const MASTER_PROMPT = `
You are an expert Islamic scholar and Arabic text recognition specialist.

I am sending you a screenshot that contains Arabic text from the Quran, a Hadith, a Dua, or an Islamic Azkar (remembrance).

YOUR TASK:
1. Put ALL Arabic-script text in "extracted_arabic" — PRESERVE ALL DIACRITICS (shadda ّ, sukun ْ, fatha َ, kasra ِ, damma ُ, tanween, maddah ٓ, etc.). These marks are ESSENTIAL for Quranic text.
2. Put ONLY the main Arabic lines (dhikr, ayah, dua) in "primary_arabic" — KEEP ALL DIACRITICS. If Urdu headings or Urdu hadith text appear in the image, put that Urdu in "image_context_ur", NOT in primary_arabic. If the image is Arabic-only, set primary_arabic to null or same as extracted_arabic.
3. Identify the TYPE of content: [AYAT | HADITH | DUA | AZKAR | UNKNOWN]
   - Use DUA for standalone supplications (e.g. Zamzam dua, morning/evening duas) that are NOT a single Quranic ayah citation
   - Use AYAT only for Quran verses (with or without surah/ayah visible)
4. If AYAT: Identify the Surah name and Ayat number(s) when possible
5. If HADITH: Identify which hadith book, chapter, and number if visible
6. If DUA/AZKAR: Give common name in Arabic (dua_name) and English (dua_name_en) when known
7. "transliteration_en": Latin letters for primary_arabic only (not Urdu from image_context_ur)
8. "translation_en": English meaning of the primary Arabic only
9. "translation_ur": standard Urdu translation of primary Arabic (separate from image_context_ur)
10. Extract any reference information already shown in the image
11. Note if the text appears COMPLETE or PARTIAL

CRITICAL: ALWAYS preserve shadda (ّ), maddah (ٓ), and ALL harakat (tashkeel) marks in extracted_arabic and primary_arabic. These are NOT optional for Quranic text.

RESPOND ONLY in this exact JSON format:
{
  "type": "AYAT|HADITH|DUA|AZKAR|UNKNOWN",
  "extracted_arabic": "all arabic script from image WITH ALL DIACRITICS",
  "primary_arabic": "only main arabic lines WITH ALL DIACRITICS or null",
  "image_context_ur": "urdu from image or null",
  "is_complete": true|false,
  "surah_name": "if AYAT — arabic surah name",
  "surah_number": null or integer,
  "ayat_start": null or integer,
  "ayat_end": null or integer,
  "hadith_book": "if HADITH — book name",
  "hadith_number": "if HADITH — hadith number",
  "azkar_category": "if AZKAR — morning|evening|sleep|salah|general",
  "dua_name": "if DUA/AZKAR — common Arabic name or short label",
  "dua_name_en": "if DUA/AZKAR — English title e.g. Dua when drinking Zamzam",
  "reference_in_image": "any reference text visible in image",
  "transliteration_en": "Latin for primary_arabic / core arabic only",
  "translation_en": "English meaning of the text",
  "translation_ur": "Urdu in Urdu script or null",
  "confidence": "HIGH|MEDIUM|LOW",
  "notes": "any important observations"
}

IMPORTANT:
- PRESERVE ALL DIACRITICS (ّ ْ َ ِ ُ ٓ ً ٍ ٌ ٰ etc.) — these are REQUIRED for proper Quranic rendering
- Never put Urdu script inside primary_arabic
- transliteration_en and translation_en are REQUIRED (empty string only if impossible)
- Do not confuse a well-known dua with a Quranic ayah if it is not from the Mushaf as a cited verse
- If confidence is LOW, still try your best and mark it accordingly
`;

export async function analyzeImage(imageBuffer: Buffer, mimeType: string): Promise<GeminiResult> {
  if (!API_KEY) {
    throw new Error("GEMINI_API_KEY is not set");
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash-lite" });

    const result = await model.generateContent([
      MASTER_PROMPT,
      {
        inlineData: {
          data: imageBuffer.toString("base64"),
          mimeType: mimeType
        }
      }
    ]);

    const response = await result.response;
    return parseGeminiResponse(response.text());
  } catch (error: any) {
    console.warn("Vision API Error, attempting OCR + Text-only fallback:", error.message);
    
    // Always attempt fallback for Vision errors (429, 404, safety block, etc.)
    return fallbackToOCRAndTextOnly(imageBuffer);
  }
}

async function fallbackToOCRAndTextOnly(imageBuffer: Buffer): Promise<GeminiResult> {
  try {
    console.log("Starting OCR fallback process...");
    const ocrText = await extractTextWithOCR(imageBuffer);
    
    if (!ocrText || ocrText.trim().length < 5) {
      throw new Error("Local OCR could not find meaningful Arabic text in the image.");
    }

    console.log("OCR successful, calling text-only AI identification...");
    // Use the most stable text-only model as fallback
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" }); 

    const prompt = `
      THE FOLLOWING TEXT WAS EXTRACTED FROM AN IMAGE VIA LOCAL OCR:
      "${ocrText}"
      
      BECAUSE THE TEXT WAS EXTRACTED AUTOMATICALLY, IT MAY CONTAIN TYPOS OR MISSING DIACRITICS. 
      YOUR JOB:
      1. Reconstruct the FULL Arabic text with ALL diacritics (shadda ّ, maddah ٓ, harakat, tanween)
      2. Identify if this is a Quranic Ayat, Hadith, or Azkar
      3. Return the metadata in JSON as per the rules below:
      
      ${MASTER_PROMPT}
      
      NOTE: 
      - Even if OCR text is missing diacritics, YOU MUST add the correct diacritics in your output
      - Set confidence to "MEDIUM" or "LOW" if you had to reconstruct heavily
      - For Quranic verses, ensure shadda, maddah, and all harakat are present
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return parseGeminiResponse(response.text());
  } catch (error: any) {
    console.error("Critical Failure in OCR Fallback:", error);
    throw new Error(`Analysis completely failed: ${error.message || "Unknown error"}. Please check image quality.`);
  }
}

function parseGeminiResponse(text: string): GeminiResult {
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("Failed to extract JSON from Gemini response");
  }

  try {
    const json = JSON.parse(jsonMatch[0]);
    return GeminiResultSchema.parse(json);
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    throw new Error("Failed to parse Gemini response");
  }
}
