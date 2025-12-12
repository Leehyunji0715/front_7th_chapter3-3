import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components"
import { Post } from "../../../entities/post"
import { CommentList } from "../../comment"

interface PostDetailDialogProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
  searchQuery: string
}

export const PostDetailDialog = ({ post, isOpen, onClose, searchQuery }: PostDetailDialogProps) => {
  // 하이라이트 함수
  const highlightText = (text: string | undefined, highlight: string) => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{highlightText(post?.title, searchQuery)}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>{highlightText(post?.body, searchQuery)}</p>
          {post && <CommentList postId={post.id} searchQuery={searchQuery} highlightText={highlightText} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
