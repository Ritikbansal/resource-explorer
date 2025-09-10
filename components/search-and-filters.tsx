"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { useState, useEffect, useRef, useCallback } from "react"
import { Search, Filter, SortAsc, SortDesc, X, Heart } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { categories, statuses } from "@/lib/data"

// Custom debounce hook with AbortController
function useDebounceWithAbort<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): [T, () => void] {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const debouncedCallback = useCallback(((...args: Parameters<T>) => {
    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    // Abort previous operation
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new AbortController
    const controller = new AbortController()
    abortControllerRef.current = controller

    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      if (!controller.signal.aborted) {
        callback(...args)
      }
    }, delay)
  }) as T, [callback, delay])

  const cancel = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cancel()
    }
  }, [cancel])

  return [debouncedCallback, cancel]
}

export function SearchAndFilters() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const isInitialMount = useRef(true)

  const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "")

  const currentCategory = searchParams.get("category") || "all"
  const currentStatus = searchParams.get("status") || "all"
  const currentSort = searchParams.get("sort") || "name"
  const currentOrder = searchParams.get("order") || "asc"
  const showFavorites = searchParams.get("favorites") === "true"

  // Debounced search handler with AbortController
  const handleDebouncedSearch = useCallback((query: string) => {
    const currentQuery = searchParams.get("q") || ""
    if (query !== currentQuery) {
      const params = new URLSearchParams(searchParams)

      if (query) {
        params.set("q", query)
      } else {
        params.delete("q")
      }

      params.delete("page")
      router.push(`?${params.toString()}`)
    }
  }, [searchParams, router])

  const [debouncedSearchHandler, cancelSearch] = useDebounceWithAbort(
    handleDebouncedSearch,
    500
  )

  useEffect(() => {
    // Skip the effect on initial mount
    if (isInitialMount.current) {
      isInitialMount.current = false
      return
    }

    debouncedSearchHandler(searchQuery)
  }, [searchQuery, debouncedSearchHandler])

  const updateFilter = (key: string, value: string) => {
    // Cancel any pending search operations
    cancelSearch()
    
    const params = new URLSearchParams(searchParams)

    if (value === "all") {
      params.delete(key)
    } else {
      params.set(key, value)
    }

    params.delete("page") 
    router.push(`?${params.toString()}`)
  }

  const toggleSortOrder = () => {
    cancelSearch()
    
    const params = new URLSearchParams(searchParams)
    const newOrder = currentOrder === "asc" ? "desc" : "asc"
    params.set("order", newOrder)
    params.delete("page")
    router.push(`?${params.toString()}`)
  }

  const toggleFavorites = () => {
    cancelSearch()
    
    const params = new URLSearchParams(searchParams)
    if (showFavorites) {
      params.delete("favorites")
    } else {
      params.set("favorites", "true")
    }
    params.delete("page")
    router.push(`?${params.toString()}`)
  }

  const clearAllFilters = () => {
    cancelSearch()
    
    const params = new URLSearchParams()
    router.push(`?${params.toString()}`)
    setSearchQuery("")
  }

  const hasActiveFilters = searchQuery || currentCategory !== "all" || currentStatus !== "all" || showFavorites

  return (
    <div className="mb-8 space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search items by name or description..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-input border-border"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                cancelSearch()
                setSearchQuery("")
              }}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0 hover:bg-muted"
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        <div className="flex gap-2 flex-wrap cursor-pointer">
          <Select value={currentCategory} onValueChange={(value) => updateFilter("category", value)}>
            <SelectTrigger className="w-[140px] bg-input border-border">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentStatus} onValueChange={(value) => updateFilter("status", value)}>
            <SelectTrigger className="w-[120px] bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              {statuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={currentSort} onValueChange={(value) => updateFilter("sort", value)}>
            <SelectTrigger className="w-[120px] bg-input border-border">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="category">Category</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={toggleSortOrder} className="bg-input border-border">
            {currentOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>

          <Button
            variant={showFavorites ? "default" : "outline"}
            size="icon"
            onClick={toggleFavorites}
            className={showFavorites ? "bg-accent text-accent-foreground" : "bg-input border-border"}
            title="Show only favorites"
          >
            <Heart className={`h-4 w-4 ${showFavorites ? "fill-current" : ""}`} />
          </Button>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4 mr-1" />
              Clear All
            </Button>
          )}
        </div>
      </div>

      {hasActiveFilters && (
        <div className="flex flex-wrap gap-2">
          {searchQuery && (
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              Search: "{searchQuery}"
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  cancelSearch()
                  setSearchQuery("")
                }}
                className="ml-1 h-4 w-4 p-0 hover:bg-accent/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {currentCategory !== "all" && (
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              Category: {currentCategory}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilter("category", "all")}
                className="ml-1 h-4 w-4 p-0 hover:bg-accent/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {currentStatus !== "all" && (
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              Status: {currentStatus}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => updateFilter("status", "all")}
                className="ml-1 h-4 w-4 p-0 hover:bg-accent/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
          {showFavorites && (
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              <Heart className="h-3 w-3 mr-1 fill-current" />
              Favorites Only
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleFavorites}
                className="ml-1 h-4 w-4 p-0 hover:bg-accent/20"
              >
                <X className="h-3 w-3" />
              </Button>
            </Badge>
          )}
        </div>
      )}
    </div>
  )
}
