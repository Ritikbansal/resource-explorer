import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function LoadingSkeleton() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="bg-card border-border">
            <CardContent className="p-0">
              <Skeleton className="aspect-video w-full rounded-t-lg" />
              <div className="p-4 space-y-3">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                </div>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3 w-20" />
                  <Skeleton className="h-3 w-24" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex justify-center">
        <Skeleton className="h-8 w-64" />
      </div>
    </div>
  )
}
