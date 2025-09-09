"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useFavorites } from "@/hooks/use-favorites"
import type { Item } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ItemCardProps {
  item: Item
}

export function ItemCard({ item }: ItemCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isItemFavorite = isFavorite(item.id)

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    toggleFavorite(item.id)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "inactive":
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
      case "pending":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200"
    }
  }

  return (
    <Link href={`/items/${item.id}`}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 bg-card border-border">
        <CardContent className="p-0">
          <div className="relative">
            <div className="aspect-video relative overflow-hidden rounded-t-lg bg-muted">
              {item.imageUrl ? (
                <Image
                  src={item.imageUrl || "/placeholder.svg"}
                  alt={item.name}
                  fill
                  className="object-cover transition-transform duration-200 group-hover:scale-105"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <div className="text-center">
                    <div className="w-12 h-12 mx-auto mb-2 bg-muted-foreground/10 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">📦</span>
                    </div>
                    <p className="text-sm">No image</p>
                  </div>
                </div>
              )}
            </div>

            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2 h-8 w-8 p-0 bg-white/80 hover:bg-white/90 backdrop-blur-sm"
              onClick={handleFavoriteClick}
            >
              <Heart
                className={cn(
                  "h-4 w-4 transition-colors",
                  isItemFavorite ? "fill-red-500 text-red-500" : "text-gray-600",
                )}
              />
            </Button>
          </div>

          <div className="p-4 space-y-3">
            <div className="space-y-2">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-card-foreground line-clamp-1 group-hover:text-white transition-colors">
                  {item.name}
                </h3>
                <Badge variant="secondary" className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{item.description}</p>
            </div>

            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="font-medium text-blue-300">{item.category}</span>
              <span>{new Date(item.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
