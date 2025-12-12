import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle } from "../components"

import { usePosts, AddPostDialog, PostPagination, PostDetailDialog } from "../features/post"
import { PostTable } from "../widgets/ui/PostTable"
import { PostSearchControls } from "../widgets/ui/PostSearchControls"
import { Post } from "../entities/post"
import { usePostQueryParams } from "../features/post/hooks"
import { useAddPostMutation } from "../entities/post/api/queries"

const PostsManager = () => {
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
      <PostDetailDialog
        post={selectedPost}
        isOpen={dialogs.showPostDetailDialog}
        onClose={() => actions.closeDialog("showPostDetailDialog")}
        searchQuery={searchQuery}
      />
    </Card>
  )
}

export default PostsManager
