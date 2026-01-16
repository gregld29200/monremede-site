import { NextResponse } from 'next/server'
import { client } from '@/sanity/lib/client'
import type { DashboardStats, RecentActivity } from '@/types/admin'

export async function GET() {
  try {
    // Fetch all stats in parallel
    const [
      totalClients,
      activeClients,
      newProspects,
      pendingProspects,
      recentClients,
      recentProspects,
      recentNotes,
    ] = await Promise.all([
      // Total clients
      client.fetch<number>(`count(*[_type == "client"])`),

      // Active clients
      client.fetch<number>(`count(*[_type == "client" && status == "actif"])`),

      // New prospects (last 7 days)
      client.fetch<number>(`count(*[_type == "questionnaireSubmission" && status == "nouveau" && submittedAt > $weekAgo])`, {
        weekAgo: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      }),

      // Pending prospects (nouveau + contacte + discussion)
      client.fetch<number>(`count(*[_type == "questionnaireSubmission" && status in ["nouveau", "contacte", "discussion"]])`),

      // Recent clients (last 5)
      client.fetch<Array<{ _id: string; firstName: string; lastName: string; createdAt: string }>>(
        `*[_type == "client"] | order(createdAt desc)[0...5]{ _id, firstName, lastName, createdAt }`
      ),

      // Recent prospects (last 5)
      client.fetch<Array<{ _id: string; firstName: string; lastName: string; submittedAt: string; profile: string }>>(
        `*[_type == "questionnaireSubmission"] | order(submittedAt desc)[0...5]{ _id, firstName, lastName, submittedAt, profile }`
      ),

      // Recent notes (last 5)
      client.fetch<Array<{ _id: string; content: string; type: string; createdAt: string; client: { firstName: string; lastName: string } }>>(
        `*[_type == "clientNote"] | order(createdAt desc)[0...5]{ _id, content, type, createdAt, "client": client->{ firstName, lastName } }`
      ),
    ])

    // Build recent activity
    const recentActivity: RecentActivity[] = []

    // Add recent clients
    recentClients.forEach((c) => {
      recentActivity.push({
        id: c._id,
        type: 'new_client',
        title: 'Nouvelle cliente',
        description: `${c.firstName} ${c.lastName}`,
        timestamp: c.createdAt || new Date().toISOString(),
      })
    })

    // Add recent prospects
    recentProspects.forEach((p) => {
      recentActivity.push({
        id: p._id,
        type: 'new_prospect',
        title: 'Nouveau prospect',
        description: `${p.firstName} ${p.lastName} - ${p.profile || 'Non evalue'}`,
        timestamp: p.submittedAt || new Date().toISOString(),
      })
    })

    // Add recent notes
    recentNotes.forEach((n) => {
      recentActivity.push({
        id: n._id,
        type: 'note_added',
        title: 'Note ajoutee',
        description: `${n.client?.firstName || ''} ${n.client?.lastName || ''} - ${n.content?.substring(0, 30)}...`,
        timestamp: n.createdAt || new Date().toISOString(),
      })
    })

    // Sort by timestamp and take top 10
    recentActivity.sort((a, b) =>
      new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
    )

    const stats: DashboardStats = {
      totalClients,
      activeClients,
      newProspects,
      pendingProspects,
      recentActivity: recentActivity.slice(0, 10),
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error('Stats error:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la recuperation des statistiques' },
      { status: 500 }
    )
  }
}
