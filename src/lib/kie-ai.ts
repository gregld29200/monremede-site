/**
 * KIE.AI API Client
 * Documentation: https://api.kie.ai/docs
 */

import type {
  AspectRatio,
  Resolution,
  KieCreateTaskResponse,
  KieTaskStatusResponse,
} from '@/types/design-studio'

const KIE_API_BASE = 'https://api.kie.ai/api/v1'
const MODEL = 'nano-banana-pro'

interface CreateTaskParams {
  prompt: string
  aspectRatio: AspectRatio
  resolution: Resolution
}

// Convert our aspect ratio format to KIE.AI format
function formatAspectRatio(ratio: AspectRatio): string {
  return ratio // KIE.AI uses same format: "16:9", "1:1", etc.
}

// Convert our resolution format to KIE.AI format
function formatResolution(resolution: Resolution): string {
  switch (resolution) {
    case '1K':
      return '1024x1024'
    case '2K':
      return '2048x2048'
    case '4K':
      return '4096x4096'
    default:
      return '2048x2048'
  }
}

/**
 * Create a new image generation task
 */
export async function createTask(params: CreateTaskParams): Promise<KieCreateTaskResponse> {
  const apiKey = process.env.KIE_AI_API_KEY

  if (!apiKey) {
    throw new Error('KIE_AI_API_KEY is not configured')
  }

  const response = await fetch(`${KIE_API_BASE}/jobs/createTask`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      prompt: params.prompt,
      aspect_ratio: formatAspectRatio(params.aspectRatio),
      resolution: formatResolution(params.resolution),
      output_format: 'png',
    }),
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`KIE.AI API error: ${response.status} - ${error}`)
  }

  return response.json()
}

/**
 * Get the status of a generation task
 */
export async function getTaskStatus(taskId: string): Promise<KieTaskStatusResponse> {
  const apiKey = process.env.KIE_AI_API_KEY

  if (!apiKey) {
    throw new Error('KIE_AI_API_KEY is not configured')
  }

  const response = await fetch(`${KIE_API_BASE}/jobs/recordInfo?taskId=${taskId}`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
    },
  })

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`KIE.AI API error: ${response.status} - ${error}`)
  }

  return response.json()
}

/**
 * Download an image from a URL and return as Buffer
 */
export async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url)

  if (!response.ok) {
    throw new Error(`Failed to download image: ${response.status}`)
  }

  const arrayBuffer = await response.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

/**
 * Get estimated cost for an image generation
 */
export function getEstimatedCost(resolution: Resolution): number {
  switch (resolution) {
    case '1K':
    case '2K':
      return 0.09
    case '4K':
      return 0.12
    default:
      return 0.09
  }
}
