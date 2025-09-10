import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id)
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid Pokemon ID' },
        { status: 400 }
      )
    }
    
    const pokemon = await prisma.pokemon.findUnique({
      where: { id },
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
      }
    })
    
    if (!pokemon) {
      return NextResponse.json(
        { error: 'Pokemon not found' },
        { status: 404 }
      )
    }
    
    // Get species data separately (since there's no direct relation)
    const species = await prisma.pokemonSpecies.findUnique({
      where: { id: pokemon.id }
    })
    
    return NextResponse.json({
      ...pokemon,
      species
    })
    
  } catch (error) {
    console.error('Error fetching Pokemon:', error)
    return NextResponse.json(
      { error: 'Failed to fetch Pokemon' },
      { status: 500 }
    )
  }
}
