import { NextRequest, NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { analyzeImage } from '@/lib/gemini'
import { lookupAyat } from '@/lib/quran-lookup'
import { lookupHadith } from '@/lib/hadith-lookup'
import { lookupAzkar } from '@/lib/azkar-lookup'
import { generateHash } from '@/lib/image-hash'
import {
  mergeGeminiMetadata,
  buildSupplicationFallback,
  buildQuranFallback,
  buildHadithFallback,
  buildUnknownFallback,
} from '@/lib/merge-analyze-result'
import sharp from 'sharp'
import { fileTypeFromBuffer } from 'file-type'
import fs from 'fs/promises'
import path from 'path'

const MAX_SIZE = 10 * 1024 * 1024 // 10MB
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads')

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get('image') as File | null

    if (!file) {
      return NextResponse.json({ error: 'No image provided' }, { status: 400 })
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: 'Image too large (Max 10MB)' }, { status: 400 })
    }

    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Validate magic bytes
    const type = await fileTypeFromBuffer(buffer)
    if (!type || !['image/jpeg', 'image/png', 'image/webp'].includes(type.mime)) {
      return NextResponse.json({ error: 'Invalid file type' }, { status: 400 })
    }

    // Save to uploads folder
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
    const fileName = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.]/g, '_')}`
    await fs.writeFile(path.join(UPLOAD_DIR, fileName), buffer)

    // Cache lookup
    const hash = generateHash(buffer)
    const cached = await prisma.search_cache.findUnique({
      where: { image_hash: hash }
    })
    
    if (cached && cached.result_json) {
      return NextResponse.json({
        ...cached.result_json as object,
        cached: true
      })
    }

    // Preprocessing
    const processedBuffer = await sharp(buffer)
      .resize({ width: 2048, withoutEnlargement: true })
      .modulate({ brightness: 1.1, contrast: 1.2 })
      .toBuffer()

    // AI Analysis
    const geminiResult = await analyzeImage(processedBuffer, type.mime)

    // Resolution Engine
    let finalResult: any = null

    switch (geminiResult.type) {
      case 'AYAT':
        finalResult = await lookupAyat(geminiResult)
        break
      case 'HADITH':
        finalResult = await lookupHadith(geminiResult)
        break
      case 'AZKAR':
      case 'DUA':
        finalResult = await lookupAzkar(geminiResult)
        if (!finalResult) {
          finalResult = buildSupplicationFallback(geminiResult)
        } else {
          finalResult = mergeGeminiMetadata(
            finalResult as Record<string, unknown>,
            geminiResult
          ) as typeof finalResult
        }
        break
      default:
        finalResult = buildUnknownFallback(geminiResult)
    }

    if (!finalResult) {
      if (geminiResult.type === 'AYAT') {
        finalResult = buildQuranFallback(geminiResult)
      } else if (geminiResult.type === 'HADITH') {
        finalResult = buildHadithFallback(geminiResult)
      } else {
        finalResult = buildSupplicationFallback(geminiResult)
      }
    } else if (geminiResult.type === 'AYAT') {
      finalResult = mergeGeminiMetadata(
        finalResult as Record<string, unknown>,
        geminiResult
      ) as typeof finalResult
    } else if (geminiResult.type === 'HADITH') {
      finalResult = mergeGeminiMetadata(
        finalResult as Record<string, unknown>,
        geminiResult
      ) as typeof finalResult
    }

    let response = {
      ...finalResult,
      confidence: geminiResult.confidence,
      notes: geminiResult.notes,
      cached: false,
    }

    response = mergeGeminiMetadata(
      response as Record<string, unknown>,
      geminiResult
    ) as typeof response

    // Save to cache
    await prisma.search_cache.create({
      data: {
        image_hash: hash,
        extracted_ar: geminiResult.extracted_arabic,
        result_type: geminiResult.type,
        result_json: response as any
      }
    }).catch(e => console.error('Cache save error:', e))

    return NextResponse.json(response)

  } catch (error: any) {
    console.error('Analyze API Error:', error)
    return NextResponse.json({ error: error.message || 'Analysis failed' }, { status: 500 })
  }
}
