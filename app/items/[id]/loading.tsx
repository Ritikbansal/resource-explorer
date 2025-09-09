import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="mb-6">
          <Button variant="ghost" className="mb-4 text-muted-foreground">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Items
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-0">
                <Skeleton className="aspect-square w-full" />
              </CardContent>
            </Card>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Title and Favorite */}
              <div className="flex items-start justify-between gap-4">
                <Skeleton className="h-9 w-3/4" />
                <Skeleton className="h-10 w-10 shrink-0" />
              </div>

              {/* Status Badge */}
              <Skeleton className="h-6 w-20" />

              {/* Description */}
              <div className="space-y-2">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-20" />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-16" />
                      <Skeleton className="h-3 w-20" />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <Skeleton className="h-10 flex-1" />
              <Skeleton className="h-10 flex-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
