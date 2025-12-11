import { CommentFormDialog } from "./CommentFormDialog"
import { NewCommentData } from "../../../entities/comment/model/types"

interface AddCommentDialogProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  comment: NewCommentData
  onCommentChange: (comment: NewCommentData) => void
  onSubmit: () => void
}

export const AddCommentDialog = ({ isOpen, onClose, comment, onCommentChange, onSubmit }: AddCommentDialogProps) => {
  return (
    <CommentFormDialog
      isOpen={isOpen}
      onClose={onClose}
      title="새 댓글 추가"
      comment={{ body: comment.body || "" }}
      onCommentChange={(updatedComment) => onCommentChange({ ...comment, body: updatedComment.body || "" })}
      onSubmit={onSubmit}
      submitLabel="댓글 추가"
    />
  )
}
