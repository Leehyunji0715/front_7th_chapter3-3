import { CommentFormDialog } from "./CommentFormDialog"
import { CommentDTO } from "../../../entities/comment/model/types"

interface EditCommentDialogProps {
  isOpen: boolean
  onClose: (open: boolean) => void
  comment: CommentDTO | null
  onCommentChange: (comment: CommentDTO | null) => void
  onSubmit: () => void
}

export const EditCommentDialog = ({ isOpen, onClose, comment, onCommentChange, onSubmit }: EditCommentDialogProps) => {
  return (
    <CommentFormDialog
      isOpen={isOpen}
      onClose={onClose}
      title="댓글 수정"
      comment={{ body: comment?.body || "" }}
      onCommentChange={(updatedComment) =>
        onCommentChange(comment ? { ...comment, body: updatedComment.body || "" } : null)
      }
      onSubmit={onSubmit}
      submitLabel="댓글 업데이트"
    />
  )
}
