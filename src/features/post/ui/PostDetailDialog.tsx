import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components"
import { Post } from "../../../entities/post"
import { CommentList } from "../../comment"
import { HighlightText } from "../../../shared/ui"

interface PostDetailDialogProps {
  post: Post | null
  isOpen: boolean
  onClose: () => void
  searchQuery: string
}

export const PostDetailDialog = ({ post, isOpen, onClose, searchQuery }: PostDetailDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            <HighlightText text={post?.title} highlight={searchQuery} />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <HighlightText text={post?.body} highlight={searchQuery} />
          </p>
          {post && <CommentList postId={post.id} searchQuery={searchQuery} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
