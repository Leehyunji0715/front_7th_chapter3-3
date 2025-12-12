import { useMemo } from "react"

export const usePostQueryParams = () => {
  const params = useMemo(() => new URLSearchParams(window.location.search), [])

  return {
    searchQuery: params.get("search") || "",
    selectedTag: params.get("tag") || "",
    limit: parseInt(params.get("limit") || "10"),
    skip: parseInt(params.get("skip") || "0"),
    sortBy: params.get("sortBy") || "",
    sortOrder: params.get("sortOrder") || "asc",
  }
}
