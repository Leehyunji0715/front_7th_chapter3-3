import { UserDTO } from "../../user/model/types"

export interface PostDTO {
  body: string
  id: number
  reactions: { likes: number; dislikes: number }
  tags: string[]
  title: string
  userId: number
  views: number
}

export interface Post extends PostDTO {
  author: UserDTO | undefined
}
