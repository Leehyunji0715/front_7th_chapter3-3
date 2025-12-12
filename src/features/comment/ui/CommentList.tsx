import { useState } from "react"
import { Edit2, Plus, Trash2 } from "lucide-react"
import { Button } from "../../../components"
import { CommentDTO, NewCommentData } from "../../../entities/comment/model/types"
import { LikeButton } from "./LikeButton"
import {
  useCommentsQuery,
  useAddCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
} from "../../../entities/comment/api"
import { AddCommentDialog } from "./AddCommentDialog"
import { EditCommentDialog } from "./EditCommentDialog"

interface CommentListProps {
  postId: number
  searchQuery: string
  highlightText: (text: string | undefined, highlight: string) => React.ReactNode
}

export const CommentList = ({ postId, searchQuery, highlightText }: CommentListProps) => {
  // 다이얼로그 상태 관리
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedComment, setSelectedComment] = useState<CommentDTO | null>(null)
  const [newComment, setNewComment] = useState<NewCommentData>({
    body: "",
    postId: postId,
    userId: 1,
  })

  // TanStack Query 훅들
  const { data: commentsData, isLoading, error } = useCommentsQuery(postId)
  const addCommentMutation = useAddCommentMutation()
  const updateCommentMutation = useUpdateCommentMutation()
  const deleteCommentMutation = useDeleteCommentMutation()
  const likeCommentMutation = useLikeCommentMutation()

  // 댓글 추가 다이얼로그 열기
  const handleAddComment = () => {
    setNewComment({ body: "", postId: postId, userId: 1 })
    setShowAddDialog(true)
  }

  // 댓글 추가 실행
  const handleSubmitAddComment = () => {
    addCommentMutation.mutate(newComment, {
      onSuccess: () => {
        setShowAddDialog(false)
        setNewComment({ body: "", postId: postId, userId: 1 })
      },
    })
  }

  // 댓글 수정 다이얼로그 열기
  const handleEditComment = (comment: CommentDTO) => {
    setSelectedComment(comment)
    setShowEditDialog(true)
  }

  // 댓글 수정 실행
  const handleSubmitEditComment = () => {
    if (!selectedComment) return

    updateCommentMutation.mutate(
      { commentId: selectedComment.id, body: selectedComment.body, postId },
      {
        onSuccess: () => {
          setShowEditDialog(false)
          setSelectedComment(null)
        },
      },
    )
  }

  // 댓글 삭제 핸들러
  const handleDeleteComment = (commentId: number) => {
    deleteCommentMutation.mutate({ commentId, postId })
  }

  // 댓글 좋아요 핸들러
  const handleLikeComment = (commentId: number, currentLikes: number) => {
    likeCommentMutation.mutate({ commentId, currentLikes, postId })
  }

  if (isLoading) return <div className="text-sm text-gray-500">댓글 로딩 중...</div>
  if (error) return <div className="text-sm text-red-500">댓글을 불러오는데 실패했습니다.</div>

  const comments = commentsData?.comments || []
  return (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button size="sm" onClick={handleAddComment}>
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <div className="space-y-1">
        {comments.map((comment) => (
          <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
            <div className="flex items-center space-x-2 overflow-hidden">
              <span className="font-medium truncate">{comment.user.username}:</span>
              <span className="truncate">{highlightText(comment.body, searchQuery)}</span>
            </div>
            <div className="flex items-center space-x-1">
              <LikeButton likes={comment.likes} onLike={() => handleLikeComment(comment.id, comment.likes)} />
              <Button variant="ghost" size="sm" onClick={() => handleEditComment(comment)}>
                <Edit2 className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* 댓글 추가 다이얼로그 */}
      <AddCommentDialog
        isOpen={showAddDialog}
        onClose={setShowAddDialog}
        comment={newComment}
        onCommentChange={setNewComment}
        onSubmit={handleSubmitAddComment}
      />

      {/* 댓글 수정 다이얼로그 */}
      <EditCommentDialog
        isOpen={showEditDialog}
        onClose={setShowEditDialog}
        comment={selectedComment}
        onCommentChange={setSelectedComment}
        onSubmit={handleSubmitEditComment}
      />
    </div>
  )
}
