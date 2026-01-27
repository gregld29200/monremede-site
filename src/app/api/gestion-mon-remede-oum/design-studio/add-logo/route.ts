import { NextRequest, NextResponse } from 'next/server'
import sharp from 'sharp'
import path from 'path'
import fs from 'fs/promises'

type LogoPosition = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
type LogoColor = 'dark' | 'light'
type OutputFormat = 'png' | 'webp' | 'jpeg'

interface AddLogoRequest {
  imageUrl: string
  position: LogoPosition
  size: number
  logoColor: LogoColor
  format?: OutputFormat
}

export async function POST(request: NextRequest) {
  try {
    const body: AddLogoRequest = await request.json()
    const { imageUrl, position, size, logoColor, format = 'png' } = body

    const mimeTypes: Record<OutputFormat, string> = {
      png: 'image/png',
      webp: 'image/webp',
      jpeg: 'image/jpeg',
    }

    if (!imageUrl) {
      return NextResponse.json({ error: 'Image URL required' }, { status: 400 })
    }

    // Fetch the generated image
    const imageResponse = await fetch(imageUrl)
    if (!imageResponse.ok) {
      return NextResponse.json({ error: 'Failed to fetch image' }, { status: 500 })
    }

    const imageBuffer = Buffer.from(await imageResponse.arrayBuffer())

    // If size is 0, just return the image without logo (proxy mode)
    if (size === 0) {
      return new NextResponse(new Uint8Array(imageBuffer), {
        headers: {
          'Content-Type': 'image/png',
          'Content-Disposition': `attachment; filename="monremede-${Date.now()}.png"`,
        },
      })
    }

    // Get image metadata
    const metadata = await sharp(imageBuffer).metadata()
    const imgWidth = metadata.width || 1024
    const imgHeight = metadata.height || 1024

    // Read the logo file
    const logoPath = path.join(process.cwd(), 'public', 'logo.png')
    const logoBuffer = await fs.readFile(logoPath)

    // Calculate logo size (relative to image width)
    const logoWidth = Math.round(size * (imgWidth / 500))

    // Resize logo
    let logoSharp = sharp(logoBuffer).resize(logoWidth)

    // If light logo requested, invert colors (make it white)
    if (logoColor === 'light') {
      logoSharp = logoSharp.negate({ alpha: false })
    }

    const resizedLogoBuffer = await logoSharp.toBuffer()
    const logoMetadata = await sharp(resizedLogoBuffer).metadata()
    const logoHeight = logoMetadata.height || logoWidth

    // Calculate position
    const padding = Math.round(30 * (imgWidth / 500))
    let x = padding
    let y = padding

    switch (position) {
      case 'top-left':
        x = padding
        y = padding
        break
      case 'top-right':
        x = imgWidth - logoWidth - padding
        y = padding
        break
      case 'bottom-left':
        x = padding
        y = imgHeight - logoHeight - padding
        break
      case 'bottom-right':
        x = imgWidth - logoWidth - padding
        y = imgHeight - logoHeight - padding
        break
    }

    // Composite the logo onto the image
    const resultBuffer = await sharp(imageBuffer)
      .composite([
        {
          input: resizedLogoBuffer,
          left: x,
          top: y,
        },
      ])
      .png()
      .toBuffer()

    // Return the image as a response
    return new NextResponse(new Uint8Array(resultBuffer), {
      headers: {
        'Content-Type': 'image/png',
        'Content-Disposition': `attachment; filename="monremede-${Date.now()}.png"`,
      },
    })
  } catch (error) {
    console.error('Add logo error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to process image' },
      { status: 500 }
    )
  }
}
