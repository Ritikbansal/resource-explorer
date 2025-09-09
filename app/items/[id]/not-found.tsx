import Link from "next/link"
import { ArrowLeft, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-card border-border">
        <CardContent className="p-8 text-center space-y-6">
          <div className="space-y-2">
            <div className="w-16 h-16 mx-auto bg-muted rounded-full flex items-center justify-center">
              <Search className="h-8 w-8 text-muted-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-card-foreground">Item Not Found</h1>
            <p className="text-muted-foreground">The item you're looking for doesn't exist or may have been removed.</p>
          </div>

          <div className="space-y-3">
            <Button asChild className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
              <Link href="/">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Items
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
