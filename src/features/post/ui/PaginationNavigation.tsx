import { Button } from "../../../components"

interface PaginationNavigationProps {
  isFirstPage: boolean
  isLastPage: boolean
  onPrevious: () => void
  onNext: () => void
}

export const PaginationNavigation = ({ isFirstPage, isLastPage, onPrevious, onNext }: PaginationNavigationProps) => {
  return (
    <div className="flex gap-2">
      <Button disabled={isFirstPage} onClick={onPrevious} variant="default" size="default">
        이전
      </Button>
      <Button disabled={isLastPage} onClick={onNext} variant="default" size="default">
        다음
      </Button>
    </div>
  )
}
