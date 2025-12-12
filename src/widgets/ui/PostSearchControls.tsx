import { useNavigate } from "react-router-dom"
import { SearchInput, TagSelector, SortControls } from "../../features/post"
import { useTagsQuery } from "../../entities/post/api/queries"
import { usePostQueryParams } from "../../features/post/hooks"

export const PostSearchControls = () => {
  const { data: tags = [] } = useTagsQuery()
  const { selectedTag, sortBy, sortOrder } = usePostQueryParams()
  const navigate = useNavigate()

  const updateUrl = (updates: Record<string, string>) => {
    const params = new URLSearchParams(window.location.search)
    Object.entries(updates).forEach(([key, value]) => {
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
    })
    navigate(`?${params.toString()}`)
  }

  const handleSearchEnter = (value: string) => {
    updateUrl({ search: value })
  }

  const handleTagChange = (value: string) => {
    updateUrl({ tag: value })
  }

  const handleSortByChange = (value: string) => {
    updateUrl({ sortBy: value })
  }

  const handleSortOrderChange = (value: string) => {
    updateUrl({ sortOrder: value })
  }

  return (
    <div className="flex gap-4">
      <SearchInput onSearchEnter={handleSearchEnter} />
      <TagSelector selectedTag={selectedTag} tags={tags} onTagChange={handleTagChange} />
      <SortControls
        sortBy={sortBy}
        sortOrder={sortOrder}
        onSortByChange={handleSortByChange}
        onSortOrderChange={handleSortOrderChange}
      />
    </div>
  )
}
