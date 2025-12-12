import { useNavigate } from "react-router-dom"
import { ItemsPerPageSelector } from "./ItemsPerPageSelector"
import { PaginationNavigation } from "./PaginationNavigation"
import { usePostQueryParams } from "../hooks"
import { usePostsQuery, useSearchPostsQuery, usePostsByTagQuery } from "../../../entities/post/api/queries"

export const PostPagination = () => {
  const navigate = useNavigate()
  const { searchQuery, selectedTag, limit, skip } = usePostQueryParams()

  // 현재 활성화된 쿼리에서 total 가져오기
  const { data: postsData } = usePostsQuery({
    limit,
    skip,
    enabled: !searchQuery && (!selectedTag || selectedTag === "all"),
  })

  const { data: searchData } = useSearchPostsQuery(searchQuery)
  const { data: tagData } = usePostsByTagQuery(selectedTag)

  const total = searchQuery
    ? searchData?.total || 0
    : selectedTag && selectedTag !== "all"
      ? tagData?.total || 0
      : postsData?.total || 0

  const currentPage = Math.floor(skip / limit)
  const isFirstPage = currentPage === 0
  const isLastPage = skip + limit >= total

  const handlePrevious = () => {
    if (!isFirstPage) {
      const params = new URLSearchParams(window.location.search)
      params.set("skip", Math.max(0, skip - limit).toString())
      navigate(`?${params.toString()}`)
    }
  }

  const handleNext = () => {
    if (!isLastPage) {
      const params = new URLSearchParams(window.location.search)
      params.set("skip", (skip + limit).toString())
      navigate(`?${params.toString()}`)
    }
  }

  const handleItemsPerPageChange = (newLimit: number) => {
    const params = new URLSearchParams(window.location.search)
    params.set("limit", newLimit.toString())
    params.set("skip", "0") // 페이지 크기 변경 시 첫 페이지로
    navigate(`?${params.toString()}`)
  }

  return (
    <div className="flex justify-between items-center">
      <ItemsPerPageSelector value={limit} onChange={handleItemsPerPageChange} />
      <PaginationNavigation
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  )
}
