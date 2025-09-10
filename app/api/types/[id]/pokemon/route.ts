export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const typeId = parseInt(params.id)
    
    if (isNaN(typeId)) {
      return NextResponse.json(
        { error: 'Invalid type ID' },
        { status: 400 }
      )
    }
    
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const skip = (page - 1) * limit
    
    const [pokemon, totalCount] = await Promise.all([
      prisma.pokemon.findMany({
        where: {
          types: {
            some: {
              typeId: typeId
            }
          }
        },
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
        orderBy: {
          id: 'asc'
        },
        skip,
        take: limit
      }),
      prisma.pokemon.count({
        where: {
          types: {
            some: {
              typeId: typeId
            }
          }
        }
      })
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
    console.error('Error fetching Pokemon by type:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon by type' },
      { status: 500 }
    )
  }
}
