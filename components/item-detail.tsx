"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Heart, Tag, Activity, Zap, Shield, Swords, Gauge } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { useFavorites } from "@/hooks/use-favorites"
import type { Item } from "@/lib/types"
import { cn } from "@/lib/utils"

interface ItemDetailProps {
  item: Item
}

export function ItemDetail({ item }: ItemDetailProps) {
  const { isFavorite, toggleFavorite } = useFavorites()
  const isItemFavorite = isFavorite(item.id)

  const handleFavoriteClick = () => {
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return "🟢"
      case "inactive":
        return "🔴"
      case "pending":
        return "🟡"
      default:
        return "⚪"
    }
  }

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      fire: "bg-red-100 text-red-800",
      water: "bg-blue-100 text-blue-800",
      grass: "bg-green-100 text-green-800",
      electric: "bg-yellow-100 text-yellow-800",
      psychic: "bg-pink-100 text-pink-800",
      ice: "bg-cyan-100 text-cyan-800",
      dragon: "bg-purple-100 text-purple-800",
      dark: "bg-gray-800 text-gray-100",
      fairy: "bg-pink-200 text-pink-900",
      fighting: "bg-orange-100 text-orange-800",
      poison: "bg-purple-200 text-purple-900",
      ground: "bg-amber-100 text-amber-800",
      flying: "bg-indigo-100 text-indigo-800",
      bug: "bg-lime-100 text-lime-800",
      rock: "bg-stone-100 text-stone-800",
      ghost: "bg-violet-100 text-violet-800",
      steel: "bg-slate-100 text-slate-800",
      normal: "bg-gray-100 text-gray-800",
    }
    return colors[type.toLowerCase()] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="mb-6">
          <Button variant="ghost" asChild className="mb-4 text-muted-foreground hover:text-foreground">
            <Link href="/">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pokemon
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Image Section */}
          <div className="space-y-4">
            <Card className="bg-card border-border overflow-hidden">
              <CardContent className="p-0">
                <div className="aspect-square relative bg-muted">
                  {item.imageUrl ? (
                    <Image
                      src={item.imageUrl || "/placeholder.svg"}
                      alt={item.name}
                      fill
                      className="object-contain p-8"
                      priority
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-muted-foreground">
                      <div className="text-center">
                        <div className="w-24 h-24 mx-auto mb-4 bg-muted-foreground/10 rounded-lg flex items-center justify-center">
                          <span className="text-4xl">🔮</span>
                        </div>
                        <p className="text-lg">No image available</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Details Section */}
          <div className="space-y-6">
            <div className="space-y-4">
              {/* Title and Favorite */}
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-foreground text-balance leading-tight">{item.name}</h1>
                  <p className="text-lg text-muted-foreground">#{item.id.padStart(3, "0")}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleFavoriteClick}
                  className="shrink-0 bg-card border-border hover:bg-accent/10"
                >
                  <Heart
                    className={cn(
                      "h-5 w-5 transition-colors",
                      isItemFavorite ? "fill-red-500 text-red-500" : "text-muted-foreground",
                    )}
                  />
                </Button>
              </div>

              {item.types && (
                <div className="flex flex-wrap gap-2">
                  {item.types.map((type) => (
                    <Badge key={type} variant="secondary" className={cn("text-sm capitalize", getTypeColor(type))}>
                      {type}
                    </Badge>
                  ))}
                </div>
              )}

              {/* Status Badge */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className={cn("text-sm", getStatusColor(item.status))}>
                  <span className="mr-1">{getStatusIcon(item.status)}</span>
                  {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                </Badge>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <h2 className="text-lg font-semibold text-foreground">Description</h2>
                <p className="text-muted-foreground leading-relaxed text-pretty">{item.description}</p>
              </div>
            </div>

            <Separator className="bg-border" />

            {item.stats && (
              <>
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Base Stats</h2>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-20">
                        <Heart className="h-4 w-4 text-red-500" />
                        <span className="text-sm font-medium">HP</span>
                      </div>
                      <div className="flex-1">
                        <Progress value={(item.stats.hp / 255) * 100} className="h-2" />
                      </div>
                      <span className="text-sm font-mono w-8 text-right">{item.stats.hp}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-20">
                        <Swords className="h-4 w-4 text-orange-500" />
                        <span className="text-sm font-medium">ATK</span>
                      </div>
                      <div className="flex-1">
                        <Progress value={(item.stats.attack / 255) * 100} className="h-2" />
                      </div>
                      <span className="text-sm font-mono w-8 text-right">{item.stats.attack}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-20">
                        <Shield className="h-4 w-4 text-blue-500" />
                        <span className="text-sm font-medium">DEF</span>
                      </div>
                      <div className="flex-1">
                        <Progress value={(item.stats.defense / 255) * 100} className="h-2" />
                      </div>
                      <span className="text-sm font-mono w-8 text-right">{item.stats.defense}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-2 w-20">
                        <Gauge className="h-4 w-4 text-green-500" />
                        <span className="text-sm font-medium">SPD</span>
                      </div>
                      <div className="flex-1">
                        <Progress value={(item.stats.speed / 255) * 100} className="h-2" />
                      </div>
                      <span className="text-sm font-mono w-8 text-right">{item.stats.speed}</span>
                    </div>
                  </div>
                </div>
                <Separator className="bg-border" />
              </>
            )}

            {/* Metadata */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Details</h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-md bg-white/10">
                    <Tag className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Type</p>
                    <p className="text-sm text-muted-foreground">{item.category}</p>
                  </div>
                </div>

                {item.height && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 w-8 text-center rounded-md bg-white/10">
                      <span className="text-sm text-center font-mono text-white">H</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Height</p>
                      <p className="text-sm text-muted-foreground">{(item.height / 10).toFixed(1)} m</p>
                    </div>
                  </div>
                )}

                {item.weight && (
                  <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                    <div className="p-2 w-8 text-center rounded-md bg-white/10">
                      <span className="text-sm font-mono text-white">W</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">Weight</p>
                      <p className="text-sm text-muted-foreground">{(item.weight / 10).toFixed(1)} kg</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-md bg-white/10">
                    <Activity className="h-4 w-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Status</p>
                    <p className="text-sm text-muted-foreground capitalize">{item.status}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-md w-8 text-center bg-white/10">
                    <span className="text-sm text-center font-mono text-white">#</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Pokedex ID</p>
                    <p className="text-sm text-muted-foreground font-mono">#{item.id.padStart(3, "0")}</p>
                  </div>
                </div>
              </div>
            </div>

            {item.abilities && item.abilities.length > 0 && (
              <>
                <Separator className="bg-border" />
                <div className="space-y-4">
                  <h2 className="text-lg font-semibold text-foreground">Abilities</h2>
                  <div className="flex flex-wrap gap-2">
                    {item.abilities.map((ability) => (
                      <Badge key={ability} variant="outline" className="capitalize">
                        <Zap className="h-3 w-3 mr-1" />
                        {ability.replace("-", " ")}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* <Separator className="bg-border" /> */}

            {/* Actions */}
            {/* <div className="flex flex-col sm:flex-row gap-3">
              <Button className="flex-1 bg-accent text-accent-foreground hover:bg-accent/90">Add to Team</Button>
              <Button variant="outline" className="flex-1 bg-card border-border hover:bg-accent/10">
                Compare Stats
              </Button>
            </div> */}
          </div>
        </div>

        {/* Related Pokemon Section Placeholder */}
        {/* <div className="mt-12">
          <Card className="bg-card border-border">
            <CardContent className="p-8 text-center">
              <h3 className="text-lg font-semibold text-foreground mb-2">Related Pokemon</h3>
              <p className="text-muted-foreground">
                Other <span className="font-medium text-accent">{item.category}</span> type Pokemon will appear here.
              </p>
            </CardContent>
          </Card>
        </div> */}
      </div>
    </div>
  )
}
