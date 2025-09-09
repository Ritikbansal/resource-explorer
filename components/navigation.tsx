"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Heart, Grid3X3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useFavorites } from "@/hooks/use-favorites"
import { ThemeToggle } from "@/components/theme-toggle"
import { cn } from "@/lib/utils"

export function Navigation() {
  const pathname = usePathname()
  const { favorites } = useFavorites()

  const navItems = [
    {
      href: "/",
      label: "All Items",
      icon: Grid3X3,
      isActive: pathname === "/",
    },
    {
      href: "/favorites",
      label: "Favorites",
      icon: Heart,
      isActive: pathname === "/favorites",
      badge: favorites.length > 0 ? favorites.length : undefined,
    },
  ]

  return (
    <nav className="flex items-center gap-2">
      {navItems.map((item) => {
        const Icon = item.icon
        return (
          <Button
            key={item.href}
            variant={item.isActive ? "default" : "ghost"}
            size="sm"
            asChild
            className={cn(
              "relative",
              item.isActive
                ? "bg-accent text-accent-foreground hover:bg-accent/90"
                : "text-muted-foreground hover:text-foreground hover:bg-accent/10",
            )}
          >
            <Link href={item.href}>
              <Icon className="h-4 w-4 mr-2" />
              {item.label}
              {item.badge && (
                <Badge
                  variant="secondary"
                  className="ml-2 h-5 min-w-5 px-1 text-xs bg-accent-foreground/10 text-accent-foreground"
                >
                  {item.badge}
                </Badge>
              )}
            </Link>
          </Button>
        )
      })}
      <ThemeToggle />
    </nav>
  )
}
