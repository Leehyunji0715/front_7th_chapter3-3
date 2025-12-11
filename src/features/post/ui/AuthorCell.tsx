import { User } from "../../../entities/user"
import { Post } from "../../../entities/post/model/types"

interface AuthorCellProps {
  post: Post
  onUserClick: (user: User) => void
}

export const AuthorCell = ({ post, onUserClick }: AuthorCellProps) => {
  return (
    <div
      className="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-1 rounded"
      onClick={() => post.author && onUserClick(post.author as unknown as User)}
    >
      <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
      <span>{post.author?.username}</span>
    </div>
  )
}
