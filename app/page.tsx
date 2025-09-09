import { Suspense } from "react"
import { ItemsList } from "@/components/items-list"
import { SearchAndFilters } from "@/components/search-and-filters"
import { Navigation } from "@/components/navigation"
import { LoadingSkeleton } from "@/components/loading-skeleton"
import { ErrorBoundary } from "@/components/error-boundary"

export default function HomePage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Items Directory</h1>
              <p className="text-muted-foreground">Browse and discover items with advanced search and filtering</p>
            </div>
            <Navigation />
          </div>
        </header>

        <ErrorBoundary>
          <SearchAndFilters />
          <Suspense fallback={<LoadingSkeleton />}>
            <ItemsList searchParams={searchParams} />
          </Suspense>
        </ErrorBoundary>
      </div>
    </div>
  )
}
