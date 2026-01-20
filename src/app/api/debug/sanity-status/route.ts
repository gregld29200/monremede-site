import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

export async function GET() {
  const token = process.env.SANITY_API_WRITE_TOKEN
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET

  const diagnostics = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV || 'not-vercel',
    config: {
      projectId: projectId || 'MISSING',
      dataset: dataset || 'MISSING',
      tokenExists: !!token,
      tokenLength: token?.length || 0,
      tokenPrefix: token?.substring(0, 4) || 'NONE',
      tokenSuffix: token?.substring(token.length - 4) || 'NONE',
    },
    testResult: 'not-tested',
    error: null as string | null,
  }

  // Only run actual test if token exists
  if (token && projectId && dataset) {
    try {
      const client = createClient({
        projectId,
        dataset,
        apiVersion: '2026-01-13',
        useCdn: false,
        token,
      })

      // Try a simple read operation to verify token works
      const result = await client.fetch('*[_type == "questionnaireSubmission"][0]{_id}')
      diagnostics.testResult = result ? 'success-with-data' : 'success-no-data'
    } catch (err) {
      diagnostics.testResult = 'failed'
      diagnostics.error = err instanceof Error ? err.message : 'Unknown error'
    }
  } else {
    diagnostics.testResult = 'skipped-missing-config'
  }

  return NextResponse.json(diagnostics)
}
