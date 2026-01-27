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
    const doc = {
      _type: 'generatedImage' as const,
      prompt: body.prompt, // Store original prompt without suffix
      kieTaskId: taskId,
      status: 'pending',
      aspectRatio: body.aspectRatio || '16:9',
      resolution: body.resolution || '2K',
      purpose: body.purpose || 'mainImage',
      cost: getEstimatedCost(body.resolution || '2K'),
      linkedPost: body.articleId ? {
        _type: 'reference' as const,
        _ref: body.articleId,
      } : undefined,
    }

    const newDoc = await writeClient.create(doc)

    return NextResponse.json({
      taskId,
      documentId: newDoc._id,
    })
  } catch (error) {
    console.error('Generate image error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la génération de l\'image' },
      { status: 500 }
    )
  }
}
