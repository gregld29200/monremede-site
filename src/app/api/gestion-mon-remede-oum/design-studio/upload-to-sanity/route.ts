import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import { downloadImage } from '@/lib/kie-ai'
import type { UploadToSanityRequest } from '@/types/design-studio'
import { nanoid } from 'nanoid'

interface GeneratedImageDoc {
  _id: string
  resultUrl?: string
  linkedPost?: { _ref: string }
  linkedRecipe?: { _ref: string }
  prompt: string
}

export async function POST(request: NextRequest) {
  try {
    const body: UploadToSanityRequest = await request.json()

    if (!body.generatedImageId) {
      return NextResponse.json(
        { error: 'generatedImageId est requis' },
        { status: 400 }
      )
    }

    // Get the generated image document
    const doc = await client.fetch<GeneratedImageDoc | null>(
      `*[_type == "generatedImage" && _id == $id][0]{
        _id,
        resultUrl,
        linkedPost,
        linkedRecipe,
        prompt
      }`,
      { id: body.generatedImageId }
    )

    if (!doc) {
      return NextResponse.json(
        { error: 'Document non trouvé' },
        { status: 404 }
      )
    }

    if (!doc.resultUrl) {
      return NextResponse.json(
        { error: 'L\'image n\'est pas encore prête' },
        { status: 400 }
      )
    }

    // Download image from KIE.AI
    const imageBuffer = await downloadImage(doc.resultUrl)

    // Upload to Sanity
    const asset = await writeClient.assets.upload('image', imageBuffer, {
      filename: `generated-${doc._id}.png`,
      contentType: 'image/png',
    })

    // Update the generatedImage document with the Sanity image reference
    await writeClient.patch(doc._id).set({
      sanityImage: {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
      },
    }).commit()

    // If targetDocumentId is provided, update the target document
    const targetDocId = body.targetDocumentId || doc.linkedPost?._ref || doc.linkedRecipe?._ref

    if (targetDocId && body.targetField) {
      const imageRef = {
        _type: 'image',
        asset: {
          _type: 'reference',
          _ref: asset._id,
        },
        alt: doc.prompt.slice(0, 100),
      }

      if (body.targetField === 'mainImage') {
        await writeClient.patch(targetDocId).set({
          mainImage: imageRef,
        }).commit()
      } else if (body.targetField === 'gallery') {
        // Append to gallery array
        await writeClient.patch(targetDocId).setIfMissing({ gallery: [] }).append('gallery', [{
          _key: nanoid(),
          ...imageRef,
        }]).commit()
      }
    }

    return NextResponse.json({
      success: true,
      assetId: asset._id,
      assetUrl: asset.url,
    })
  } catch (error) {
    console.error('Upload to Sanity error:', error)
    return NextResponse.json(
      { error: 'Erreur lors du téléchargement vers Sanity' },
      { status: 500 }
    )
  }
}
