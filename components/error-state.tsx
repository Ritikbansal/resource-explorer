"use client"

import { AlertTriangle, RefreshCw, Wifi, WifiOff } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { NetworkError, DataFetchError } from "@/lib/data"

interface ErrorStateProps {
  error: Error
  onRetry: () => void
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  const getErrorIcon = () => {
    if (error instanceof NetworkError) {
      return <WifiOff className="h-8 w-8 text-destructive" />
    }
    return <AlertTriangle className="h-8 w-8 text-destructive" />
  }

  const getErrorTitle = () => {
    if (error instanceof NetworkError) {
      return "Connection Problem"
    }
    if (error instanceof DataFetchError) {
      return "Data Error"
    }
    return "Something Went Wrong"
  }

  const getErrorMessage = () => {
    if (error instanceof NetworkError) {
      return "Unable to connect to the server. Please check your internet connection and try again."
    }
    return error.message || "An unexpected error occurred. Please try again."
  }

  const getRetryText = () => {
    if (error instanceof NetworkError) {
      return "Retry Connection"
    }
    return "Try Again"
  }

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-12 text-center space-y-6">
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto bg-destructive/10 rounded-full flex items-center justify-center">
            {getErrorIcon()}
          </div>
          <h2 className="text-xl font-semibold text-foreground">{getErrorTitle()}</h2>
          <p className="text-muted-foreground max-w-md mx-auto leading-relaxed">{getErrorMessage()}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Button onClick={onRetry} className="bg-accent text-accent-foreground hover:bg-accent/90">
            <RefreshCw className="h-4 w-4 mr-2" />
            {getRetryText()}
          </Button>

          {error instanceof NetworkError && (
            <Button variant="outline" onClick={() => window.location.reload()} className="bg-card border-border">
              <Wifi className="h-4 w-4 mr-2" />
              Reload Page
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
