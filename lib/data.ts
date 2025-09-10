import type {
  Item,
  PaginatedResponse,
  SearchParams,
} from "./types"
import { FavoritesManager } from "./favorites"

export class DataFetchError extends Error {
  constructor(
    message: string,
    public code?: string,
  ) {
    super(message)
    this.name = "DataFetchError"
  }
}

export class NetworkError extends Error {
  constructor(message = "Network connection failed") {
    super(message)
    this.name = "NetworkError"
  }
}

const API_BASE = "/api"
const ITEMS_PER_PAGE = 20

// Convert Pokemon from your database to Item format
function pokemonToItem(pokemon: any): Item {
  const primaryType = pokemon.types[0]?.type.name || "normal"
  const typeCategories: Record<string, string> = {
    fire: "Fire",
    water: "Water",
    grass: "Grass",
    electric: "Electric",
    psychic: "Psychic",
    ice: "Ice",
    dragon: "Dragon",
    dark: "Dark",
    fairy: "Fairy",
    fighting: "Fighting",
    poison: "Poison",
    ground: "Ground",
    flying: "Flying",
    bug: "Bug",
    rock: "Rock",
    ghost: "Ghost",
    steel: "Steel",
    normal: "Normal",
  }

  let status: "active" | "inactive" | "pending" = "active"
  if (pokemon.totalStats > 600) {
    status = "pending" // Legendary-tier
  } else if (pokemon.totalStats < 300) {
    status = "inactive" // Weak Pokemon
  }

  // Get description from species or default
  let description = `A ${pokemon.types.map((t: any) => t.type.name).join("/")} type Pokemon.`
  if (pokemon.species?.flavorTextEn) {
    description = pokemon.species.flavorTextEn
  }

  return {
    id: pokemon.id.toString(),
    name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
    description,
    category: typeCategories[primaryType] || "Normal",
    status,
    createdAt: pokemon.createdAt || new Date().toISOString(),
    imageUrl: pokemon.officialArtworkUrl || pokemon.spriteUrl || "#", // Fixed: Added closing quote
    height: pokemon.height || 0,
    weight: pokemon.weight || 0,
    types: pokemon.types.map((t: any) => t.type.name),
    abilities: pokemon.abilities.map((a: any) => a.abilityName),
    stats: {
      hp: pokemon.hp || 0,
      attack: pokemon.attack || 0,
      defense: pokemon.defense || 0,
      speed: pokemon.speed || 0,
    },
  }
}

export async function fetchItems(params: SearchParams = {}, signal?: AbortSignal): Promise<PaginatedResponse<Item>> {
  try {
    // Build query parameters
    const searchParams = new URLSearchParams()
    
    if (params.page) {
      searchParams.set('page', params.page.toString())
    }
    
    searchParams.set('limit', ITEMS_PER_PAGE.toString())
    
    if (params.q && params.q.trim()) {
      searchParams.set('search', params.q.trim())
    }
    
    if (params.category && params.category !== "all") {
      const typeMap: Record<string, string> = {
        "Fire": "fire", "Water": "water", "Grass": "grass",
        "Electric": "electric", "Psychic": "psychic", "Ice": "ice",
        "Dragon": "dragon", "Dark": "dark", "Fairy": "fairy",
        "Fighting": "fighting", "Poison": "poison", "Ground": "ground",
        "Flying": "flying", "Bug": "bug", "Rock": "rock",
        "Ghost": "ghost", "Steel": "steel", "Normal": "normal",
      }
      const typeName = typeMap[params.category] || params.category.toLowerCase()
      searchParams.set('type', typeName)
    }
    
    if (params.sort) {
      const sortMap: Record<string, string> = {
        "name": "name",
        "date": "createdAt", 
        "category": "name",
      }
      searchParams.set('sortBy', sortMap[params.sort] || 'name')
    }
    
    if (params.order) {
      searchParams.set('sortOrder', params.order)
    }

    const url = `http://localhost:3000/api/pokemon?${searchParams.toString()}`
    console.log('🌐 Fetching from URL:', url)
    
    // Pass AbortSignal to fetch
    const response = await fetch(url, {
      cache: 'no-store',
      signal // Add AbortSignal here
    })
    
    if (!response.ok) {
      console.error('❌ API Response:', response.status, response.statusText)
      throw new NetworkError(`API returned ${response.status}: ${response.statusText}`)
    }
    
    const data = await response.json()
    console.log('✅ API Response received:', { 
      page: data.pagination?.page, 
      total: data.pagination?.total,
      itemCount: data.data?.length 
    })
    
    // Convert Pokemon to Items
    let items = data.data.map(pokemonToItem)
    
    // Apply client-side filters
    if (params.favorites) {
      try {
        const favoriteIds = FavoritesManager.getFavorites()
        items = items.filter((item) => favoriteIds.includes(item.id))
      } catch (error) {
        console.warn("Failed to load favorites:", error)
      }
    }
    
    if (params.status && params.status !== "all") {
      items = items.filter((item) => item.status === params.status)
    }
    
    return {
      data: items,
      total: params.favorites || params.status ? items.length : data.pagination.total,
      page: data.pagination.page,
      totalPages: params.favorites || params.status ? 
        Math.ceil(items.length / ITEMS_PER_PAGE) : 
        data.pagination.totalPages,
    }
    
  } catch (error) {
    console.error('❌ fetchItems error:', error)
    if (error instanceof Error && error.name === 'AbortError') {
      console.log('Request was aborted')
      throw error
    }
    if (error instanceof NetworkError) {
      throw error
    }
    throw new DataFetchError("Failed to fetch Pokemon data. Please try again.")
  }
}



export async function fetchItemById(id: string): Promise<Item | null> {
  try {
    const response = await fetch(`${API_BASE}/pokemon/${id}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new DataFetchError(`Pokemon with ID "${id}" not found`, "NOT_FOUND")
      }
      throw new NetworkError("Failed to fetch Pokemon data")
    }

    const pokemonData = await response.json()
    return pokemonToItem(pokemonData)
    
  } catch (error) {
    if (error instanceof NetworkError || error instanceof DataFetchError) {
      throw error
    }
    throw new DataFetchError("Failed to fetch Pokemon details. Please try again.")
  }
}

export const categories = [
  "Fire",
  "Water", 
  "Grass",
  "Electric",
  "Psychic",
  "Ice",
  "Dragon",
  "Dark",
  "Fairy",
  "Fighting",
  "Poison",
  "Ground",
  "Flying",
  "Bug",
  "Rock",
  "Ghost",
  "Steel",
  "Normal",
]

export const statuses = ["active", "inactive", "pending"]
