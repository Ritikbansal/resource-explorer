export const dynamic = "force-dynamic";

import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const types = await prisma.type.findMany({
      include: {
        _count: {
          select: {
            pokemon: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    })
    
    return NextResponse.json(types)
    
  } catch (error) {
    console.error('Error fetching types:', error)
    return NextResponse.json(
      { error: 'Failed to fetch types' },
      { status: 500 }
    )
  }
}
