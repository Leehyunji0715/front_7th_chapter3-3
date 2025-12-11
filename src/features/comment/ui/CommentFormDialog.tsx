import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "../../../components"

interface CommentFormDialogProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  title: string
  comment: { body?: string }
  onCommentChange: (comment: { body?: string }) => void
  onSubmit: () => void
  submitLabel: string
}

export const CommentFormDialog = ({
  isOpen,
  onClose,
  title,
  comment,
  onCommentChange,
  onSubmit,
  submitLabel,
}: CommentFormDialogProps) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={comment.body || ""}
            onChange={(e) => onCommentChange({ ...comment, body: e.target.value })}
          />
          <Button onClick={onSubmit}>{submitLabel}</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
