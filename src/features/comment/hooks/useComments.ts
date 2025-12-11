import { useState } from "react"
import { CommentDTO, NewCommentData } from "../../../entities/comment/model/types"

interface UseCommentsReturn {
  // UI 상태
  selectedComment: CommentDTO | null
  newComment: NewCommentData
  showAddCommentDialog: boolean
  showEditCommentDialog: boolean
  // Setters
  setSelectedComment: React.Dispatch<React.SetStateAction<CommentDTO | null>>
  setNewComment: React.Dispatch<React.SetStateAction<NewCommentData>>
  setShowAddCommentDialog: React.Dispatch<React.SetStateAction<boolean>>
  setShowEditCommentDialog: React.Dispatch<React.SetStateAction<boolean>>
}

export const useComments = (): UseCommentsReturn => {
  // UI 상태만 로컬에서 관리
  const [selectedComment, setSelectedComment] = useState<CommentDTO | null>(null)
  const [newComment, setNewComment] = useState<NewCommentData>({ body: "", postId: null, userId: 1 })
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)

  return {
    selectedComment,
    newComment,
    showAddCommentDialog,
    showEditCommentDialog,
    setSelectedComment,
    setNewComment,
    setShowAddCommentDialog,
    setShowEditCommentDialog,
  }
}
