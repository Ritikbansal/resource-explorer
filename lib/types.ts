export interface Item {
  id: string
  name: string
  description: string
  category: string
  status: "active" | "inactive" | "pending"
  createdAt: string
  imageUrl?: string
  height?: number
  weight?: number
  types?: string[]
  abilities?: string[]
  stats?: {
    hp: number
    attack: number
    defense: number
    speed: number
  }
}

export interface SearchParams {
  q?: string
  category?: string
  status?: string
  sort?: "name" | "date" | "category"
  order?: "asc" | "desc"
  page?: number
  favorites?: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  totalPages: number
}

export interface PokemonApiResponse {
  id: number
  name: string
  height: number
  weight: number
  sprites: {
    front_default: string | null
    other: {
      "official-artwork": {
        front_default: string | null
      }
    }
  }
  types: Array<{
    type: {
      name: string
    }
  }>
  abilities: Array<{
    ability: {
      name: string
    }
  }>
  stats: Array<{
    base_stat: number
    stat: {
      name: string
    }
  }>
  species: {
    url: string
  }
}

export interface PokemonSpeciesResponse {
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
    }
  }>
}

export interface PokemonListResponse {
  count: number
  results: Array<{
    name: string
    url: string
  }>
}
