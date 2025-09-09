"use client"

import { useState, useEffect } from "react"
import { FavoritesManager } from "@/lib/favorites"

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([])

  useEffect(() => {
    setFavorites(FavoritesManager.getFavorites())

    const handleFavoritesChange = (event: CustomEvent) => {
      setFavorites(event.detail.favorites)
    }

    window.addEventListener("favoritesChanged", handleFavoritesChange as EventListener)

    return () => {
      window.removeEventListener("favoritesChanged", handleFavoritesChange as EventListener)
    }
  }, [])

  const toggleFavorite = (itemId: string) => {
    // Optimistically update the UI immediately
    const currentFavorites = [...favorites]
    const isCurrentlyFavorite = currentFavorites.includes(itemId)

    if (isCurrentlyFavorite) {
      setFavorites(currentFavorites.filter((id) => id !== itemId))
    } else {
      setFavorites([...currentFavorites, itemId])
    }

    // Then perform the actual operation
    const newIsFavorite = FavoritesManager.toggleFavorite(itemId)
    return newIsFavorite
  }

  const isFavorite = (itemId: string) => favorites.includes(itemId)

  const addFavorite = (itemId: string) => {
    if (!favorites.includes(itemId)) {
      setFavorites([...favorites, itemId])
    }
    FavoritesManager.addFavorite(itemId)
  }

  const removeFavorite = (itemId: string) => {
    setFavorites(favorites.filter((id) => id !== itemId))
    FavoritesManager.removeFavorite(itemId)
  }

  const clearAllFavorites = () => {
    setFavorites([])
    FavoritesManager.clearAllFavorites()
  }

  return {
    favorites,
    toggleFavorite,
    isFavorite,
    addFavorite,
    removeFavorite,
    clearAllFavorites,
    favoritesCount: favorites.length,
  }
}
