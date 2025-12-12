import { SearchInput, TagSelector, SortControls } from "../../features/post"
import { useTagsQuery } from "../../entities/post/api/queries"
import { usePostQueryParams } from "../../features/post/hooks"
import { useNavigate } from "react-router-dom"

export const PostSearchControls = () => {
  const { data: tags = [] } = useTagsQuery()
  const { searchQuery, selectedTag, sortBy, sortOrder } = usePostQueryParams()
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

  const handleSearchChange = (value: string) => {
    updateUrl({ search: value })
  }

  const handleSearchEnter = () => {
    // 검색은 자동으로 처리됨
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
      <SearchInput searchQuery={searchQuery} onSearchChange={handleSearchChange} onSearchEnter={handleSearchEnter} />
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
