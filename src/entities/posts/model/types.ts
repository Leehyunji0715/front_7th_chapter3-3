export interface PostDTO extends Post {
  userId: string
}

export interface Post {
  id: string
  tags: string[]
  author: Author | undefined
  reactions: {
    likes: number
    dislikes: number
  }
}

interface Author {
  username: string
  image: string
}
