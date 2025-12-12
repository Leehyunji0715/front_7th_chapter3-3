import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../components"
import { Post } from "../../../entities/post/model/types"
import { useState, useEffect } from "react"

interface EditPostDialogProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  post: Post | null
  onSubmit: (post: Post) => void
}

export const EditPostDialog = ({ isOpen, onClose, post, onSubmit }: EditPostDialogProps) => {
  const [editedPost, setEditedPost] = useState<Post | null>(post)

  useEffect(() => {
    setEditedPost(post)
  }, [post])

  const handleSubmit = () => {
    if (editedPost) {
      console.error("editedPost", editedPost)
      onSubmit(editedPost)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={editedPost?.title || ""}
            onChange={(e) =>
              editedPost &&
              setEditedPost({
                ...editedPost,
                title: e.target.value,
              })
            }
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={editedPost?.body || ""}
            onChange={(e) =>
              editedPost &&
              setEditedPost({
                ...editedPost,
                body: e.target.value,
              })
            }
          />
          <Button onClick={handleSubmit}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
