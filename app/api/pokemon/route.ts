export const dynamic = "force-dynamic";
import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
    try {
      if (process.env.NODE_ENV === 'development') {
      await new Promise(resolve => setTimeout(resolve, 2000))
    }
    const { searchParams } = new URL(request.url)
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    
    // Filter parameters
    const search = searchParams.get('search')
    const type = searchParams.get('type')
    const sortBy = searchParams.get('sortBy') || 'id'
    const sortOrder = searchParams.get('sortOrder') || 'asc'
    
    // Build where clause
    const where: any = {}
    
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      }
    }
    
    if (type) {
      where.types = {
        some: {
          type: {
            name: {
              equals: type,
              mode: 'insensitive'
            }
          }
        }
      }
    }
    
    // Build orderBy clause
    const orderBy: any = {}
    if (sortBy === 'name' || sortBy === 'id' || sortBy === 'totalStats') {
      orderBy[sortBy] = sortOrder
    } else {
      orderBy.id = 'asc'
    }
    
    // Execute queries
    const [pokemon, totalCount] = await Promise.all([
      prisma.pokemon.findMany({
        where,
        include: {
          types: {
            include: {
              type: true
            },
            orderBy: {
              slot: 'asc'
            }
          },
          abilities: {
            orderBy: {
              slot: 'asc'
            }
          }
        },
        orderBy,
        skip,
        take: limit
      }),
      prisma.pokemon.count({ where })
    ])
    
    return NextResponse.json({
      data: pokemon,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages: Math.ceil(totalCount / limit)
      }
    })
    
  } catch (error) {
    console.error('Error fetching Pokemon:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon' },
      { status: 500 }
    )
  }
}
