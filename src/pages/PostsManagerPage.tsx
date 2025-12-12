import { Plus } from "lucide-react"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "../components"

import { CommentList } from "../features/comment"
import { usePosts, AddPostDialog, PostPagination } from "../features/post"
import { PostTable } from "../widgets/ui/PostTable"
import { PostSearchControls } from "../widgets/ui/PostSearchControls"
import { Post } from "../entities/post"
import { usePostQueryParams } from "../features/post/hooks"
import { useAddPostMutation } from "../entities/post/api/queries"

const PostsManager = () => {
  // Post 관련 상태와 로직을 커스텀 훅으로 분리
  const { selectedPost, dialogs, actions } = usePosts()
  const { searchQuery } = usePostQueryParams()

  const { mutate: addPost } = useAddPostMutation()

  // 게시물 추가 핸들러
  const handleAddPost = (post: { title: string; body: string; userId: number }) => {
    addPost(post, {
      onSuccess: () => {
        actions.closeDialog("showAddDialog")
      },
    })
  }

  // 게시물 상세 다이얼로그 열기
  const handleOpenPostDetail = (post: Post) => {
    actions.openPostDetail(post)
  }

  // 하이라이트 함수 추가
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

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => actions.openDialog("showAddDialog")}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컴트롤 */}
          <PostSearchControls />

          {/* 게시물 테이블 */}
          <PostTable onPostDetail={handleOpenPostDetail} />

          {/* 페이지네이션 */}
          <PostPagination />
        </div>
      </CardContent>

      {/* 게시물 추가 다이얼로그 */}
      <AddPostDialog
        isOpen={dialogs.showAddDialog}
        onClose={(open: boolean) => (open ? actions.openDialog("showAddDialog") : actions.closeDialog("showAddDialog"))}
        onSubmit={handleAddPost}
      />

      {/* 게시물 상세 보기 대화상자 */}
      <Dialog
        open={dialogs.showPostDetailDialog}
        onOpenChange={(open) =>
          open ? actions.openDialog("showPostDetailDialog") : actions.closeDialog("showPostDetailDialog")
        }
      >
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{highlightText(selectedPost?.title, searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body, searchQuery)}</p>
            {selectedPost && (
              <CommentList postId={selectedPost.id} searchQuery={searchQuery} highlightText={highlightText} />
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PostsManager
