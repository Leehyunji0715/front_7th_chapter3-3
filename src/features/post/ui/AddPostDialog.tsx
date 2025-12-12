import { useState } from "react"
import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../components"

interface AddPostDialogProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  onSubmit: (post: { title: string; body: string; userId: number }) => void
}

export const AddPostDialog = ({ isOpen, onClose, onSubmit }: AddPostDialogProps) => {
  const [post, setPost] = useState({ title: "", body: "", userId: 1 })

  const handleSubmit = () => {
    onSubmit(post)
    setPost({ title: "", body: "", userId: 1 })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={post.title}
            onChange={(e) => setPost((prev) => ({ ...prev, title: e.target.value }))}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={post.body}
            onChange={(e) => setPost((prev) => ({ ...prev, body: e.target.value }))}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={post.userId}
            onChange={(e) => setPost((prev) => ({ ...prev, userId: Number(e.target.value) }))}
          />
          <Button onClick={handleSubmit}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
