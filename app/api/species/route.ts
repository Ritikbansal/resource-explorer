import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    
    const legendary = searchParams.get('legendary')
    const mythical = searchParams.get('mythical')
    const color = searchParams.get('color')
    
    const where: any = {}
    
    if (legendary !== null) {
      where.isLegendary = legendary === 'true'
    }
    
    if (mythical !== null) {
      where.isMythical = mythical === 'true'
    }
    
    if (color) {
      where.color = {
        equals: color,
        mode: 'insensitive'
      }
    }
    
    const [species, totalCount] = await Promise.all([
      prisma.pokemonSpecies.findMany({
        where,
        orderBy: {
          id: 'asc'
        },
        skip,
        take: limit
      }),
      prisma.pokemonSpecies.count({ where })
    ])
    
    return NextResponse.json({
      data: species,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching species:', error)
    return NextResponse.json(
      { error: 'Failed to fetch species' },
      { status: 500 }
    )
  }
}
