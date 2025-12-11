import { UserDTO } from "../../user/model/types"

export interface CommentDTO {
  id: number
  body: string
  postId: number
  likes: number
  user: UserDTO
}

export interface Comment extends CommentDTO {
  userId: number
}

export interface NewCommentData {
  body: string
  postId: number | null
  userId: number
}
