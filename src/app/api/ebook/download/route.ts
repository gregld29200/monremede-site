import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'

interface PurchaseRecord {
  _id: string
  status: string
  downloadTokenExpiresAt: string
  downloadCount: number
}

export async function GET(request: NextRequest) {
  try {
    const token = request.nextUrl.searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { error: 'Token manquant' },
        { status: 400 }
      )
    }

    // Find the purchase by token
    const purchase = await writeClient.fetch(
      `*[_type == "ebookPurchase" && downloadToken == $token][0]{
        _id,
        status,
        downloadTokenExpiresAt,
        downloadCount
      }`,
      { token } as unknown as Record<string, never>
    ) as PurchaseRecord | null

    if (!purchase) {
      return NextResponse.json(
        { error: 'Lien invalide' },
        { status: 404 }
      )
    }

    // Check if already downloaded
    if (purchase.status === 'downloaded') {
      return NextResponse.json(
        { error: 'Ce lien a déjà été utilisé. Contactez-nous si vous avez besoin d\'un nouveau lien.' },
        { status: 410 }
      )
    }

    // Check if expired
    const expiresAt = new Date(purchase.downloadTokenExpiresAt)
    if (new Date() > expiresAt) {
      // Mark as expired
      await writeClient
        .patch(purchase._id)
        .set({ status: 'expired' })
        .commit()

      return NextResponse.json(
        { error: 'Ce lien a expiré. Contactez-nous pour obtenir un nouveau lien.' },
        { status: 410 }
      )
    }

    // Check if refunded
    if (purchase.status === 'refunded') {
      return NextResponse.json(
        { error: 'Cet achat a été remboursé.' },
        { status: 403 }
      )
    }

    // Fetch the EPUB from Vercel Blob
    const blobUrl = process.env.EBOOK_BLOB_URL
    if (!blobUrl) {
      console.error('EBOOK_BLOB_URL not configured')
      return NextResponse.json(
        { error: 'Configuration serveur manquante' },
        { status: 500 }
      )
    }

    const blobResponse = await fetch(blobUrl)
    if (!blobResponse.ok) {
      console.error('Failed to fetch EPUB from Blob:', blobResponse.status)
      return NextResponse.json(
        { error: 'Erreur lors de la récupération du fichier' },
        { status: 500 }
      )
    }

    // Mark as downloaded BEFORE sending the file
    // This ensures the token is invalidated even if the download fails midway
    await writeClient
      .patch(purchase._id)
      .set({
        status: 'downloaded',
        downloadedAt: new Date().toISOString(),
        downloadCount: (purchase.downloadCount || 0) + 1,
      })
      .commit()

    // Stream the file to the client
    const fileBuffer = await blobResponse.arrayBuffer()

    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/epub+zip',
        'Content-Disposition': 'attachment; filename="La-Sante-dans-lassiette.epub"',
        'Content-Length': fileBuffer.byteLength.toString(),
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache',
      },
    })
  } catch (error) {
    console.error('Erreur téléchargement e-book:', error)

    return NextResponse.json(
      { error: 'Erreur lors du téléchargement' },
      { status: 500 }
    )
  }
}
