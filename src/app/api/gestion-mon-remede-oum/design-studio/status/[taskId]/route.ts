import { NextRequest, NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import { writeClient } from '@/sanity/lib/writeClient'
import { getTaskStatus } from '@/lib/kie-ai'
import type { TaskStatusResponse } from '@/types/design-studio'

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

    // Find and update the Sanity document
    const doc = await client.fetch<{ _id: string; status: string } | null>(
      `*[_type == "generatedImage" && kieTaskId == $taskId][0]{ _id, status }`,
      { taskId }
    )

    if (doc) {
      // Update status in Sanity if it changed
      const updates: Record<string, unknown> = { status: kieStatus.status }

      if (kieStatus.resultUrl) {
        updates.resultUrl = kieStatus.resultUrl
      }

      if (kieStatus.error) {
        updates.errorMessage = kieStatus.error
      }

      await writeClient.patch(doc._id).set(updates).commit()
    }

    const response: TaskStatusResponse = {
      status: kieStatus.status,
      resultUrl: kieStatus.resultUrl,
      error: kieStatus.error,
      progress: kieStatus.progress,
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
