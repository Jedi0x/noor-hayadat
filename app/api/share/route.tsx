import { ImageResponse } from 'next/og'
import { NextRequest } from 'next/server'

export const runtime = 'edge'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const arabic = searchParams.get('ar') || 'بِسْمِ اللهِ الرَّحْمٰنِ الرَّحِيْمِ'
    const ref = searchParams.get('ref') || 'القرآن الكريم'

    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#F5F0E8',
            padding: '40px',
            border: '20px solid #0D3B2E',
          }}
        >
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#FFFDF6',
              height: '100%',
              width: '100%',
              borderRadius: '40px',
              padding: '60px',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
              position: 'relative',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                fontSize: 40,
                fontWeight: 'bold',
                color: '#C9A84C',
                marginBottom: '40px',
              }}
            >
              QuranScan.app
            </div>
            
            <div
              style={{
                fontSize: 60,
                color: '#1A1008',
                marginBottom: '40px',
                lineHeight: 1.5,
                wordBreak: 'break-word',
                display: 'flex',
                flexDirection: 'row-reverse',
              }}
            >
              {arabic}
            </div>

            <div
              style={{
                fontSize: 30,
                color: '#0D3B2E',
                opacity: 0.6,
                fontWeight: 'bold',
              }}
            >
              {ref}
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    )
  } catch (e: any) {
    return new Response(`Failed to generate OG image`, { status: 500 })
  }
}
