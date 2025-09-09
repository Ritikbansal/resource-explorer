"use client"

import { useState, useEffect } from "react"
import { fetchItems } from "@/lib/data"
import { ItemCard } from "./item-card"
import { Pagination } from "./pagination"
import { ErrorState } from "./error-state"
import { LoadingSkeleton } from "./loading-skeleton"
import type { SearchParams, PaginatedResponse, Item } from "@/lib/types"

interface ItemsListProps {
  searchParams: { [key: string]: string | string[] | undefined }
}

export function ItemsList({ searchParams }: ItemsListProps) {
  const [data, setData] = useState<PaginatedResponse<Item> | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const params: SearchParams = {
    q: typeof searchParams.q === "string" ? searchParams.q : undefined,
    category: typeof searchParams.category === "string" ? searchParams.category : undefined,
    status: typeof searchParams.status === "string" ? searchParams.status : undefined,
    sort: typeof searchParams.sort === "string" ? (searchParams.sort as SearchParams["sort"]) : undefined,
    order: typeof searchParams.order === "string" ? (searchParams.order as SearchParams["order"]) : undefined,
    page: typeof searchParams.page === "string" ? Number.parseInt(searchParams.page) : 1,
    favorites: searchParams.favorites === "true",
  }

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const result = await fetchItems(params)
      setData(result)
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Failed to load items"))
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
  }, [JSON.stringify(params)])

  if (loading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorState error={error} onRetry={loadData} />
  }

  if (!data || data.data.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-2">No items found</div>
        <p className="text-sm text-muted-foreground">
          {params.favorites
            ? "You haven't favorited any items yet. Click the heart icon on items to add them to your favorites."
            : "Try adjusting your search or filter criteria"}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.data.map((item) => (
          <ItemCard key={item.id} item={item} />
        ))}
      </div>

      {data.totalPages > 1 && <Pagination currentPage={data.page} totalPages={data.totalPages} total={data.total} />}
    </div>
  )
}
