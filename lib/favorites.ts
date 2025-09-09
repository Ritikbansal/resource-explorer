export class FavoritesManager {
  private static readonly STORAGE_KEY = "app-favorites"

  static getFavorites(): string[] {
    if (typeof window === "undefined") return []

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  static addFavorite(itemId: string): void {
    if (typeof window === "undefined") return

    const favorites = this.getFavorites()
    if (!favorites.includes(itemId)) {
      favorites.push(itemId)
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites))
      window.dispatchEvent(new CustomEvent("favoritesChanged", { detail: { favorites } }))
    }
  }

  static removeFavorite(itemId: string): void {
    if (typeof window === "undefined") return

    const favorites = this.getFavorites()
    const updated = favorites.filter((id) => id !== itemId)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent("favoritesChanged", { detail: { favorites: updated } }))
  }

  static isFavorite(itemId: string): boolean {
    return this.getFavorites().includes(itemId)
  }

  static toggleFavorite(itemId: string): boolean {
    const isFav = this.isFavorite(itemId)
    if (isFav) {
      this.removeFavorite(itemId)
    } else {
      this.addFavorite(itemId)
    }
    return !isFav
  }

  static clearAllFavorites(): void {
    if (typeof window === "undefined") return

    localStorage.removeItem(this.STORAGE_KEY)
    window.dispatchEvent(new CustomEvent("favoritesChanged", { detail: { favorites: [] } }))
  }

  static getFavoritesCount(): number {
    return this.getFavorites().length
  }
}
