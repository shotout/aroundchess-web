import { NextRequest, NextResponse } from 'next/server'
import { fetchChessData } from '../../../../lib/chess/chessApi'

export async function POST(request: NextRequest) {
  const { username } = await request.json()

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  const { data, error } = await fetchChessData(username, 'games/archives')

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  return NextResponse.json(data)
}
