import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "../../../components"

interface NewPostData {
  title: string
  body: string
  userId: number
}

interface AddPostDialogProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  post: NewPostData
  onPostChange: (post: Partial<NewPostData>) => void
  onSubmit: () => void
}

export const AddPostDialog = ({ isOpen, onClose, post, onPostChange, onSubmit }: AddPostDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input placeholder="제목" value={post.title} onChange={(e) => onPostChange({ title: e.target.value })} />
          <Textarea
            rows={30}
            placeholder="내용"
            value={post.body}
            onChange={(e) => onPostChange({ body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={post.userId}
            onChange={(e) => onPostChange({ userId: Number(e.target.value) })}
          />
          <Button onClick={onSubmit}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
