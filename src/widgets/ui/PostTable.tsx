import { useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react"
import { Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components"
import { Tag } from "../../entities/ui"
import { Post } from "../../entities/post/model/types"
import {
  useDeletePostMutation,
  usePostsQuery,
  useSearchPostsQuery,
  usePostsByTagQuery,
  useUpdatePostMutation,
} from "../../entities/post/api/queries"
import { useUsersQuery } from "../../entities/user/api/queries"
import { usePostQueryParams } from "../../features/post/hooks"
import { EditPostDialog } from "../../features/post/ui/EditPostDialog"
import { UserDetailDialog } from "../../features/user"

interface PostTableProps {
  onPostDetail: (post: Post) => void
}

export const PostTable = ({ onPostDetail }: PostTableProps) => {
  const navigate = useNavigate()
  const { mutate: deletePost } = useDeletePostMutation()
  const { mutate: updatePost } = useUpdatePostMutation()

  // 수정 다이얼로그 상태
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  // 사용자 모달 상태
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null)

  // URL에서 query params 읽기
  const { searchQuery, selectedTag, limit, skip, sortBy, sortOrder } = usePostQueryParams()

  // Users 가져오기
  const { data: usersData } = useUsersQuery()

  // 검색어가 있으면 검색 쿼리, 태그가 선택되어 있으면 태그 쿼리, 아니면 일반 쿼리
  const { data: postsData } = usePostsQuery({
    limit,
    skip,
    sortBy,
    sortOrder,
    enabled: !searchQuery && (!selectedTag || selectedTag === "all"),
  })

  const { data: searchData } = useSearchPostsQuery(searchQuery)

  const { data: tagData } = usePostsByTagQuery(selectedTag, { limit, skip })

  // 게시물 수정 핸들러
  const handleUpdatePost = (post: Post) => {
    updatePost(post, {
      onSuccess: () => {
        setShowEditDialog(false)
      },
    })
  }

  // Posts에 author 정보 추가
  const posts: Post[] = useMemo(() => {
    const rawPosts = searchQuery
      ? searchData?.posts || []
      : selectedTag && selectedTag !== "all"
        ? tagData?.posts || []
        : postsData?.posts || []

    return rawPosts.map((post) => ({
      ...post,
      author: usersData?.users.find((user) => user.id === post.userId),
    }))
  }, [searchQuery, searchData, selectedTag, tagData, postsData, usersData])

  // 하이라이트 함수
  const highlightText = (text: string | undefined, highlight: string) => {
    if (!text) return null
    if (!highlight.trim()) {
      return <span>{text}</span>
    }
    const regex = new RegExp(`(${highlight})`, "gi")
    const parts = text.split(regex)
    return (
      <span>
        {parts.map((part, i) => (regex.test(part) ? <mark key={i}>{part}</mark> : <span key={i}>{part}</span>))}
      </span>
    )
  }

  // 태그 클릭 핸들러
  const handleTagClick = (tag: string) => {
    const params = new URLSearchParams(window.location.search)
    params.set("tag", tag)
    params.set("skip", "0") // 태그 변경 시 첫 페이지로
    navigate(`?${params.toString()}`)
  }

  // 수정 버튼 클릭 핸들러
  const handleEditClick = (post: Post) => {
    setSelectedPost(post)
    setShowEditDialog(true)
  }

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]">ID</TableHead>
            <TableHead>제목</TableHead>
            <TableHead className="w-[150px]">작성자</TableHead>
            <TableHead className="w-[150px]">반응</TableHead>
            <TableHead className="w-[150px]">작업</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => (
            <TableRow key={post.id}>
              <TableCell>{post.id}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <div>{highlightText(post.title, searchQuery)}</div>

                  <div className="flex flex-wrap gap-1">
                    {post.tags?.map((tag) => (
                      <Tag
                        key={tag}
                        isSelected={selectedTag === tag}
                        onClick={() => handleTagClick(tag)}
                        className="px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer"
                      >
                        {tag}
                      </Tag>
                    ))}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => post.author && setSelectedUserId(post.author.id.toString())}
                >
                  <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
                  <span>{post.author?.username}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <ThumbsUp className="w-4 h-4" />
                  <span>{post.reactions?.likes || 0}</span>
                  <ThumbsDown className="w-4 h-4" />
                  <span>{post.reactions?.dislikes || 0}</span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => onPostDetail(post)}>
                    <MessageSquare className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleEditClick(post)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => deletePost(post.id)}>
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* 게시물 수정 다이얼로그 */}
      <EditPostDialog
        isOpen={showEditDialog}
        onClose={setShowEditDialog}
        post={selectedPost}
        onSubmit={handleUpdatePost}
      />

      {/* 사용자 모달 */}
      <UserDetailDialog userId={selectedUserId} onClose={() => setSelectedUserId(null)} />
    </>
  )
}
