/**
 * KIE.AI API Client
 * Documentation: https://docs.kie.ai
 * Using Nano Banana Pro model (Gemini 3.0 Pro) for image generation
 */

import type { AspectRatio, Resolution } from '@/types/design-studio'

const KIE_API_BASE = 'https://api.kie.ai/api/v1'
const MODEL = 'nano-banana-pro'

interface CreateTaskParams {
  prompt: string
  aspectRatio: AspectRatio
  resolution: Resolution
  referenceImages?: string[]
}

interface KieCreateTaskResponse {
  code: number
  msg: string
  data: {
    taskId: string
    recordId: string
  } | null
}

interface KieTaskStatusResponse {
  code: number
  msg: string
  data: {
    taskId: string
    model: string
    state: 'waiting' | 'processing' | 'success' | 'failed'
    param: string
    resultJson: string
    failCode: string | null
    failMsg: string | null
    costTime: number | null
    completeTime: number | null
    createTime: number
  } | null
}

export interface TaskStatusResult {
  status: 'pending' | 'generating' | 'success' | 'failed'
  resultUrl?: string
  error?: string
  progress?: number
}

/**
 * Create a new image generation task using Nano Banana Pro
 */
export async function createTask(params: CreateTaskParams): Promise<KieCreateTaskResponse> {
  const apiKey = process.env.KIE_AI_API_KEY

  if (!apiKey) {
    throw new Error('KIE_AI_API_KEY is not configured')
  }

  const input: Record<string, unknown> = {
    prompt: params.prompt,
    aspect_ratio: params.aspectRatio,
    resolution: params.resolution,
    output_format: 'png',
  }

  // Add reference images if provided
  if (params.referenceImages && params.referenceImages.length > 0) {
    input.image_input = params.referenceImages
  }

  const response = await fetch(`${KIE_API_BASE}/jobs/createTask`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      model: MODEL,
      input,
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
export async function getTaskStatus(taskId: string): Promise<TaskStatusResult> {
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

  const data: KieTaskStatusResponse = await response.json()

  if (data.code !== 200 || !data.data) {
    return {
      status: 'failed',
      error: data.msg || 'Unknown error',
    }
  }

  const taskData = data.data

  // Map KIE.AI states to our status
  switch (taskData.state) {
    case 'waiting':
      return {
        status: 'pending',
        progress: 10,
      }

    case 'processing':
      return {
        status: 'generating',
        progress: 50,
      }

    case 'success':
      // Parse resultJson to get the image URL
      if (taskData.resultJson) {
        try {
          const result = JSON.parse(taskData.resultJson)
          // The result format: { "resultUrls": ["url1", "url2", ...] }
          const resultUrl = Array.isArray(result.resultUrls)
            ? result.resultUrls[0]
            : result.output?.[0] || result.url || result.image_url

          if (resultUrl) {
            return {
              status: 'success',
              resultUrl,
              progress: 100,
            }
          }
        } catch {
          // If resultJson is a direct URL
          if (taskData.resultJson.startsWith('http')) {
            return {
              status: 'success',
              resultUrl: taskData.resultJson,
              progress: 100,
            }
          }
        }
      }
      return {
        status: 'failed',
        error: 'No image URL in response',
      }

    case 'failed':
      return {
        status: 'failed',
        error: taskData.failMsg || 'Generation failed',
      }

    default:
      return {
        status: 'pending',
        progress: 0,
      }
  }
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
 * Nano Banana Pro pricing:
 * - 1K: $0.04/image
 * - 2K: $0.06/image
 * - 4K: $0.09/image
 */
export function getEstimatedCost(resolution: Resolution): number {
  switch (resolution) {
    case '1K':
      return 0.04
    case '2K':
      return 0.06
    case '4K':
      return 0.09
    default:
      return 0.06
  }
}

/**
 * Supported aspect ratios for Nano Banana Pro
 */
export const SUPPORTED_ASPECT_RATIOS: AspectRatio[] = [
  '1:1',
  '16:9',
  '9:16',
  '4:5',
  '2:3',
  '3:2',
]
