import { Edit2, MessageSquare, Trash2 } from "lucide-react"
import { Button } from "../../../components"
import { Post } from "../../../entities/post/model/types"

interface PostActionsProps {
  post: Post
  onPostDetail: (post: Post) => void
  onEditPost: (post: Post) => void
  onDeletePost: (postId: number) => void
}

export const PostActions = ({ post, onPostDetail, onEditPost, onDeletePost }: PostActionsProps) => {
  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => onPostDetail(post)} title="댓글 보기">
        <MessageSquare className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onEditPost(post)} title="수정">
        <Edit2 className="w-4 h-4" />
      </Button>
      <Button variant="ghost" size="sm" onClick={() => onDeletePost(post.id)} title="삭제">
        <Trash2 className="w-4 h-4" />
      </Button>
    </div>
  )
}
