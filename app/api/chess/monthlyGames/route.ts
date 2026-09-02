import { NextRequest, NextResponse } from 'next/server'
import { fetchChessData } from '../../../../lib/chess/chessApi'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  const { username, year, month } = await request.json()

  if (!username || !year || !month) {
    return NextResponse.json({ error: 'Username, year, and month are required' }, { status: 400 })
  }

  const { data, error } = await fetchChessData(username, `games/${year}/${month}`)

  if (error) {
    return NextResponse.json({ error }, { status: 500 })
  }

  try {
    let monthInt = parseInt(month, 10)
    let yearInt = parseInt(year)
    const newOrUpdatedChessApiMonthlyGame = await prisma.chessApiMonthlyGames.upsert({
      where: {
        username_year_month: {
          username,
          year: yearInt,
          month: monthInt,
        },
      },
      update: {
        data,
        updatedAt: new Date(),
      },
      create: {
        username,
        year: yearInt,
        month : monthInt,
        data,
      },
    })

    return NextResponse.json(newOrUpdatedChessApiMonthlyGame)
  } catch (dbError:any) {
    // Menampilkan error yang lebih mendetail
    console.error("Database error:", dbError)
    return NextResponse.json({ error: dbError.message || 'Failed to save data to databasesss' }, { status: 500 })
  }
}
