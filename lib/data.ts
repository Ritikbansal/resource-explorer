import type {
  Item,
  PaginatedResponse,
  SearchParams,
  PokemonApiResponse,
  PokemonSpeciesResponse,
  PokemonListResponse,
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

const POKEMON_API_BASE = "https://pokeapi.co/api/v2"
const ITEMS_PER_PAGE = 20

async function pokemonToItem(pokemon: PokemonApiResponse): Promise<Item> {
  let description = `A ${pokemon.types.map((t) => t.type.name).join("/")} type Pokemon.`

  try {
    const speciesResponse = await fetch(pokemon.species.url)
    if (speciesResponse.ok) {
      const speciesData: PokemonSpeciesResponse = await speciesResponse.json()
      const englishEntry = speciesData.flavor_text_entries.find((entry) => entry.language.name === "en")
      if (englishEntry) {
        description = englishEntry.flavor_text.replace(/\f/g, " ").replace(/\n/g, " ")
      }
    }
  } catch (error) {
    console.warn("Failed to fetch species data for", pokemon.name)
  }

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

  const totalStats = pokemon.stats.reduce((sum, stat) => sum + stat.base_stat, 0)
  let status: "active" | "inactive" | "pending" = "active"
  if (totalStats > 600)
    status = "pending" // Legendary-tier
  else if (totalStats < 300) status = "inactive" // Weak Pokemon

  return {
    id: pokemon.id.toString(),
    name: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
    description,
    category: typeCategories[primaryType] || "Normal",
    status,
    createdAt: new Date(Date.now() - pokemon.id * 86400000).toISOString(),
    imageUrl: pokemon.sprites.other["official-artwork"].front_default || pokemon.sprites.front_default || '#',
    height: pokemon.height,
    weight: pokemon.weight,
    types: pokemon.types.map((t) => t.type.name),
    abilities: pokemon.abilities.map((a) => a.ability.name),
    stats: {
      hp: pokemon.stats.find((s) => s.stat.name === "hp")?.base_stat || 0,
      attack: pokemon.stats.find((s) => s.stat.name === "attack")?.base_stat || 0,
      defense: pokemon.stats.find((s) => s.stat.name === "defense")?.base_stat || 0,
      speed: pokemon.stats.find((s) => s.stat.name === "speed")?.base_stat || 0,
    },
  }
}

export async function fetchItems(params: SearchParams = {}): Promise<PaginatedResponse<Item>> {
  try {
    const page = params.page || 1
    const offset = (page - 1) * ITEMS_PER_PAGE

    const listResponse = await fetch(`${POKEMON_API_BASE}/pokemon?limit=${ITEMS_PER_PAGE}&offset=${offset}`)
    if (!listResponse.ok) {
      throw new NetworkError("Failed to connect to Pokemon API")
    }

    const listData: PokemonListResponse = await listResponse.json()

    const pokemonPromises = listData.results.map(async (pokemon) => {
      const response = await fetch(pokemon.url)
      if (!response.ok) throw new Error(`Failed to fetch ${pokemon.name}`)
      const pokemonData: PokemonApiResponse = await response.json()
      return pokemonToItem(pokemonData)
    })

    let items = await Promise.all(pokemonPromises)

    if (params.favorites) {
      try {
        const favoriteIds = FavoritesManager.getFavorites()
        items = items.filter((item) => favoriteIds.includes(item.id))
      } catch (error) {
        console.warn("Failed to load favorites from localStorage:", error)
      }
    }

    if (params.q) {
      const query = params.q.toLowerCase()
      items = items.filter(
        (item) =>
          item.name.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query) ||
          item.types?.some((type) => type.toLowerCase().includes(query)),
      )
    }

    if (params.category && params.category !== "all") {
      items = items.filter((item) => item.category === params.category)
    }

    if (params.status && params.status !== "all") {
      items = items.filter((item) => item.status === params.status)
    }

    if (params.sort) {
      items.sort((a, b) => {
        let aValue: string | Date | number
        let bValue: string | Date | number

        switch (params.sort) {
          case "name":
            aValue = a.name
            bValue = b.name
            break
          case "date":
            aValue = new Date(a.createdAt)
            bValue = new Date(b.createdAt)
            break
          case "category":
            aValue = a.category
            bValue = b.category
            break
          default:
            return 0
        }

        if (aValue < bValue) return params.order === "desc" ? 1 : -1
        if (aValue > bValue) return params.order === "desc" ? -1 : 1
        return 0
      })
    }

    return {
      data: items,
      total: Math.min(listData.count, 1000),
      page,
      totalPages: Math.ceil(Math.min(listData.count, 1000) / ITEMS_PER_PAGE),
    }
  } catch (error) {
    if (error instanceof NetworkError) {
      throw error
    }
    throw new DataFetchError("Failed to fetch Pokemon data. Please try again.")
  }
}

export async function fetchItemById(id: string): Promise<Item | null> {
  try {
    const response = await fetch(`${POKEMON_API_BASE}/pokemon/${id}`)

    if (!response.ok) {
      if (response.status === 404) {
        throw new DataFetchError(`Pokemon with ID "${id}" not found`, "NOT_FOUND")
      }
      throw new NetworkError("Failed to connect to Pokemon API")
    }

    const pokemonData: PokemonApiResponse = await response.json()
    return await pokemonToItem(pokemonData)
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
