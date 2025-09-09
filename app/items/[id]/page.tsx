import { notFound } from "next/navigation"
import { fetchItemById, DataFetchError } from "@/lib/data"
import { ItemDetail } from "@/components/item-detail"
import { ErrorBoundary } from "@/components/error-boundary"

interface ItemPageProps {
  params: {
    id: string
  }
}

export default async function ItemPage({ params }: ItemPageProps) {
  try {
    const item = await fetchItemById(params.id)

    if (!item) {
      notFound()
    }

    return (
      <ErrorBoundary>
        <ItemDetail item={item} />
      </ErrorBoundary>
    )
  } catch (error) {
    if (error instanceof DataFetchError && error.code === "NOT_FOUND") {
      notFound()
    }

    // For network errors or other issues, we'll let the error boundary handle it
    throw error
  }
}

export async function generateMetadata({ params }: ItemPageProps) {
  try {
    const item = await fetchItemById(params.id)

    if (!item) {
      return {
        title: "Item Not Found",
      }
    }

    return {
      title: `${item.name} | Items Directory`,
      description: item.description,
    }
  } catch (error) {
    return {
      title: "Item Not Found",
    }
  }
}
