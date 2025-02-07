import { NextRequest, NextResponse } from 'next/server'
import { fetchChessData } from '../../../../lib/chess/chessApi'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  const { username } = await request.json()

  if (!username) {
    return NextResponse.json({ error: 'Username is required' }, { status: 400 })
  }

  const { data, error } = await fetchChessData(username, 'clubs')

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  try {
    const newOrUpdatedChessApiData = await prisma.chessApiData.upsert({
      where: { username },  
      update: {    
        data_clubs: data,  
        updatedAt: new Date(),  
      },
      create: {
        username,  
        data_clubs: data,  
      },
    })

    return NextResponse.json(newOrUpdatedChessApiData)
  } catch (dbError) {
    console.error(dbError)
    return NextResponse.json({ error: 'Failed to save data to database' }, { status: 500 })
  }
}
