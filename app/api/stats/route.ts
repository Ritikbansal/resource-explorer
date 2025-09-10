import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const [
      totalPokemon,
      totalTypes,
      totalSpecies,
      legendaryCount,
      mythicalCount,
      averageStats
    ] = await Promise.all([
      prisma.pokemon.count(),
      prisma.type.count(),
      prisma.pokemonSpecies.count(),
      prisma.pokemonSpecies.count({ where: { isLegendary: true } }),
      prisma.pokemonSpecies.count({ where: { isMythical: true } }),
      prisma.pokemon.aggregate({
        _avg: {
          hp: true,
          attack: true,
          defense: true,
          speed: true,
          specialAttack: true,
          specialDefense: true,
          totalStats: true
        }
      })
    ])
    
    return NextResponse.json({
      counts: {
        pokemon: totalPokemon,
        types: totalTypes,
        species: totalSpecies,
        legendary: legendaryCount,
        mythical: mythicalCount
      },
      averageStats: {
        hp: Math.round(averageStats._avg.hp || 0),
        attack: Math.round(averageStats._avg.attack || 0),
        defense: Math.round(averageStats._avg.defense || 0),
        speed: Math.round(averageStats._avg.speed || 0),
        specialAttack: Math.round(averageStats._avg.specialAttack || 0),
        specialDefense: Math.round(averageStats._avg.specialDefense || 0),
        total: Math.round(averageStats._avg.totalStats || 0)
      }
    })
    
  } catch (error) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      { error: 'Failed to fetch statistics' },
      { status: 500 }
    )
  }
}
