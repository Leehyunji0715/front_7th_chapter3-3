import React from "react"
import { Button } from "../../../components"
import { ThumbsUp } from "lucide-react"

interface LikeButtonProps {
  likes: number
  onLike: () => void
  isLoading?: boolean
  className?: string
  showCount?: boolean
}

export const LikeButton: React.FC<LikeButtonProps> = ({
  likes,
  onLike,
  isLoading = false,
  className = "",
  showCount = true,
}) => {
  const handleClick = () => {
    if (!isLoading) {
      onLike()
    }
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleClick} disabled={isLoading} className={className}>
      <ThumbsUp className={`w-3 h-3 ${isLoading ? "animate-pulse" : ""}`} />
      {showCount && <span className="ml-1 text-xs">{likes}</span>}
    </Button>
  )
}

export default LikeButton
