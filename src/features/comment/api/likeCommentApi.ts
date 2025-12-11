import { CommentDTO } from "../../../entities/comment/model/types"

export const likeComment = async (commentId: number, currentLikes: number): Promise<CommentDTO> => {
  const response = await fetch(`/api/comments/${commentId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      likes: currentLikes + 1,
    }),
  })

  if (!response.ok) {
    throw new Error("댓글 좋아요 실패")
  }

  return response.json()
}
