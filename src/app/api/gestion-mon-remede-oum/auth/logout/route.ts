import { NextResponse } from 'next/server'
import { deleteSessionCookie } from '@/lib/admin/auth'

export async function POST() {
  try {
    await deleteSessionCookie()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { error: 'Erreur de déconnexion' },
      { status: 500 }
    )
  }
}
