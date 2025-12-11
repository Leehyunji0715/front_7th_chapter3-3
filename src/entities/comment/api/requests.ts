import { CommentDTO, NewCommentData } from "../model/types"

// Types
export type CommentsResponse = { comments: CommentDTO[] }

// API Functions
export const fetchCommentsAPI = async (postId: number): Promise<CommentsResponse> => {
  const response = await fetch(`/api/comments/post/${postId}`)
  if (!response.ok) throw new Error("댓글 조회에 실패했습니다")
  return response.json()
}

export const addCommentAPI = async (newComment: NewCommentData): Promise<CommentDTO> => {
  const response = await fetch("/api/comments/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newComment),
  })
  if (!response.ok) throw new Error("댓글 추가에 실패했습니다")
  return response.json()
}

export const updateCommentAPI = async (commentId: number, body: string): Promise<CommentDTO> => {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ body }),
  })
  if (!response.ok) throw new Error("댓글 수정에 실패했습니다")
  return response.json()
}

export const deleteCommentAPI = async (commentId: number): Promise<void> => {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "DELETE",
  })
  if (!response.ok) throw new Error("댓글 삭제에 실패했습니다")
}

export const likeCommentAPI = async (commentId: number, currentLikes: number): Promise<CommentDTO> => {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ likes: currentLikes + 1 }),
  })
  if (!response.ok) throw new Error("댓글 좋아요에 실패했습니다")
  return response.json()
}