import { ItemsPerPageSelector } from "./ItemsPerPageSelector"
import { PaginationNavigation } from "./PaginationNavigation"

interface PostPaginationProps {
  currentPage: number
  itemsPerPage: number
  totalItems: number
  onPageChange: (skip: number) => void
  onItemsPerPageChange: (limit: number) => void
}

export const PostPagination = ({
  currentPage,
  itemsPerPage,
  totalItems,
  onPageChange,
  onItemsPerPageChange,
}: PostPaginationProps) => {
  const skip = currentPage * itemsPerPage
  const isFirstPage = currentPage === 0
  const isLastPage = skip + itemsPerPage >= totalItems

  const handlePrevious = () => {
    if (!isFirstPage) {
      onPageChange(Math.max(0, skip - itemsPerPage))
    }
  }

  const handleNext = () => {
    if (!isLastPage) {
      onPageChange(skip + itemsPerPage)
    }
  }

  return (
    <div className="flex justify-between items-center">
      <ItemsPerPageSelector value={itemsPerPage} onChange={onItemsPerPageChange} />
      <PaginationNavigation
        isFirstPage={isFirstPage}
        isLastPage={isLastPage}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />
    </div>
  )
}
