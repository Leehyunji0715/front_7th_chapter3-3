import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../components"
import { Post } from "../../../entities/post/model/types"

interface EditPostDialogProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  post: Post | null
  onPostChange: (post: Post) => void
  onSubmit: () => void
}

export const EditPostDialog = ({ isOpen, onClose, post, onPostChange, onSubmit }: EditPostDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={post?.title || ""}
            onChange={(e) =>
              post &&
              onPostChange({
                ...post,
                title: e.target.value,
              })
            }
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={post?.body || ""}
            onChange={(e) =>
              post &&
              onPostChange({
                ...post,
                body: e.target.value,
              })
            }
          />
          <Button onClick={onSubmit}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
