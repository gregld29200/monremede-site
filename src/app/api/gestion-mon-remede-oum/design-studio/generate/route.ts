import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/writeClient'
import { createTask, getEstimatedCost } from '@/lib/kie-ai'
import { BRAND_KIT, type GenerateImageRequest } from '@/types/design-studio'

export async function POST(request: NextRequest) {
  try {
    const body: GenerateImageRequest = await request.json()

    if (!body.prompt) {
      return NextResponse.json(
        { error: 'Le prompt est requis' },
        { status: 400 }
      )
    }

    // Append brand kit suffix to prompt
    const fullPrompt = `${body.prompt}\n\n${BRAND_KIT.promptSuffix}`

    // Create task with KIE.AI
    const kieResponse = await createTask({
      prompt: fullPrompt,
      aspectRatio: body.aspectRatio || '16:9',
      resolution: body.resolution || '2K',
      referenceImages: body.referenceImageUrl ? [body.referenceImageUrl] : undefined,
    })

    if (kieResponse.code !== 200 || !kieResponse.data?.taskId) {
      return NextResponse.json(
        { error: `KIE.AI error: ${kieResponse.msg}` },
        { status: 500 }
      )
    }

    const taskId = kieResponse.data.taskId

    // Create generatedImage document in Sanity
    const doc: Record<string, unknown> = {
      _type: 'generatedImage',
      prompt: body.prompt, // Store original prompt without suffix
      kieTaskId: taskId,
      status: 'pending',
      aspectRatio: body.aspectRatio || '16:9',
      resolution: body.resolution || '2K',
      purpose: body.purpose || 'mainImage',
      cost: getEstimatedCost(body.resolution || '2K'),
    }

    // Only add linkedPost if articleId is provided
    if (body.articleId) {
      doc.linkedPost = {
        _type: 'reference',
        _ref: body.articleId,
      }
    }

    console.log('Creating Sanity document:', JSON.stringify(doc, null, 2))
    const newDoc = await writeClient.create(doc)
    console.log('Created document:', newDoc._id)

    return NextResponse.json({
      taskId,
      documentId: newDoc._id,
    })
  } catch (error) {
    console.error('Generate image error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('Error details:', errorMessage)
    return NextResponse.json(
      { error: `Erreur: ${errorMessage}` },
      { status: 500 }
    )
  }
}
