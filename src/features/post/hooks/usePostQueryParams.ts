import { useMemo } from "react"
import { useLocation } from "react-router-dom"

export const usePostQueryParams = () => {
  const location = useLocation()
  const params = useMemo(() => new URLSearchParams(location.search), [location.search])

  return {
    searchQuery: params.get("search") || "",
    selectedTag: params.get("tag") || "",
    limit: parseInt(params.get("limit") || "10"),
    skip: parseInt(params.get("skip") || "0"),
    sortBy: params.get("sortBy") || "",
    sortOrder: params.get("sortOrder") || "asc",
  }
}
