import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const query = searchParams.get('q')
    const minStats = parseInt(searchParams.get('minStats') || '0')
    const maxStats = parseInt(searchParams.get('maxStats') || '1000')
    const isLegendary = searchParams.get('legendary')
    const color = searchParams.get('color')
    
    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }
    
    // Search in Pokemon
    const pokemonResults = await prisma.pokemon.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            types: {
              some: {
                type: {
                  name: {
                    contains: query,
                    mode: 'insensitive'
                  }
                }
              }
            }
          },
          {
            abilities: {
              some: {
                abilityName: {
                  contains: query,
                  mode: 'insensitive'
                }
              }
            }
          }
        ],
        AND: [
          {
            totalStats: {
              gte: minStats,
              lte: maxStats
            }
          }
        ]
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
      take: 50
    })
    
    // Search in Species if additional filters are provided - with proper typing
    let speciesResults: Awaited<ReturnType<typeof prisma.pokemonSpecies.findMany>> = []
    
    if (isLegendary || color) {
      const speciesWhere: any = {}
      
      if (isLegendary !== null) {
        speciesWhere.isLegendary = isLegendary === 'true'
      }
      
      if (color) {
        speciesWhere.color = {
          equals: color,
          mode: 'insensitive'
        }
      }
      
      speciesResults = await prisma.pokemonSpecies.findMany({
        where: {
          ...speciesWhere,
          OR: [
            {
              name: {
                contains: query,
                mode: 'insensitive'
              }
            },
            {
              flavorTextEn: {
                contains: query,
                mode: 'insensitive'
              }
            }
          ]
        },
        take: 20
      })
    }
    
    return NextResponse.json({
      pokemon: pokemonResults,
      species: speciesResults,
      total: pokemonResults.length + speciesResults.length
    })
    
  } catch (error) {
    console.error('Error searching Pokemon:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
