import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import { getTaskStatus } from '@/lib/kie-ai'
import type { GenerationStatus, TaskStatusResponse } from '@/types/design-studio'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ taskId: string }> }
) {
  try {
    const { taskId } = await params

    if (!taskId) {
      return NextResponse.json(
        { error: 'taskId est requis' },
        { status: 400 }
      )
    }

    // Get current status from KIE.AI
    const kieStatus = await getTaskStatus(taskId)

    if (kieStatus.code !== 0) {
      return NextResponse.json(
        { error: `KIE.AI error: ${kieStatus.msg}` },
        { status: 500 }
      )
    }

    // Map KIE.AI status to our status
    let status: GenerationStatus = 'pending'
    if (kieStatus.data.status === 'processing') {
      status = 'generating'
    } else if (kieStatus.data.status === 'completed') {
      status = 'success'
    } else if (kieStatus.data.status === 'failed') {
      status = 'failed'
    }

    // Find and update the Sanity document
    const doc = await client.fetch<{ _id: string; status: string } | null>(
      `*[_type == "generatedImage" && kieTaskId == $taskId][0]{ _id, status }`,
      { taskId }
    )

    if (doc) {
      // Update status in Sanity if it changed
      const updates: Record<string, unknown> = { status }

      if (kieStatus.data.resultUrl) {
        updates.resultUrl = kieStatus.data.resultUrl
      }

      if (kieStatus.data.error) {
        updates.errorMessage = kieStatus.data.error
      }

      await writeClient.patch(doc._id).set(updates).commit()
    }

    const response: TaskStatusResponse = {
      status,
      resultUrl: kieStatus.data.resultUrl,
      error: kieStatus.data.error,
      progress: kieStatus.data.progress,
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Get status error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération du statut' },
      { status: 500 }
    )
  }
}
