import { Suspense } from "react"
import Link from "next/link"
import { Heart, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FavoritesList } from "@/components/favorites-list"
import { LoadingSkeleton } from "@/components/loading-skeleton"

export const metadata = {
  title: "Favorites | Items Directory",
  description: "Your favorite items collection",
}

export default function FavoritesPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | string[] | undefined }
}) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Button variant="ghost" asChild className="mb-4 text-muted-foreground hover:text-foreground">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Items
            </Link>
          </Button>

          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-lg bg-accent/10">
              <Heart className="h-6 w-6 text-accent fill-current" />
            </div>
            <h1 className="text-3xl font-bold text-foreground">Your Favorites</h1>
          </div>
          <p className="text-muted-foreground">Items you've saved for later</p>
        </div>

        <Suspense fallback={<LoadingSkeleton />}>
          <FavoritesList searchParams={searchParams} />
        </Suspense>
      </div>
    </div>
  )
}
