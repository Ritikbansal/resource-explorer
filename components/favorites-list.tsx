"use client"

import { useEffect, useState } from "react"
import { Heart, Search } from "lucide-react"
import { ItemCard } from "./item-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/hooks/use-favorites"
import { fetchItemById } from "@/lib/data"
import type { Item } from "@/lib/types"
import Link from "next/link"

interface FavoritesListProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export function FavoritesList({ searchParams }: FavoritesListProps) {
  const { favorites } = useFavorites()
  const [favoriteItems, setFavoriteItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFavoriteItems = async () => {
      setLoading(true)
      try {
        const items = await Promise.all(
          favorites.map(async (id) => {
            const item = await fetchItemById(id)
            return item
          }),
        )
        setFavoriteItems(items.filter((item): item is Item => item !== null))
      } catch (error) {
        console.error("Failed to load favorite items:", error)
      } finally {
        setLoading(false)
      }
    }

    loadFavoriteItems()
  }, [favorites])

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="animate-pulse">
            <Card className="bg-card border-border">
              <CardContent className="p-0">
                <div className="aspect-video bg-muted rounded-t-lg" />
                <div className="p-4 space-y-3">
                  <div className="h-5 bg-muted rounded w-3/4" />
                  <div className="h-4 bg-muted rounded w-full" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    )
  }

  if (favoriteItems.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardContent className="p-12 text-center space-y-6">
          <div className="space-y-3">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Heart className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold text-foreground">No favorites yet</h2>
            <p className="text-muted-foreground max-w-md mx-auto">
              Start exploring items and click the heart icon to save your favorites here.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button asChild className="bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/">
                <Search className="h-4 w-4 mr-2" />
                Browse Items
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {favoriteItems.length} {favoriteItems.length === 1 ? "item" : "items"} in your favorites
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favoriteItems.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  )
}
