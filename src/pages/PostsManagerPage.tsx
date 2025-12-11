import { useEffect, useState } from "react"
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
import { User, UserProfile } from "../entities/user"

import { CommentList } from "../features/comment"
import {
  usePosts,
  AddPostDialog,
  EditPostDialog,
  PostTable,
  PostPagination,
  SearchInput,
  TagSelector,
  SortControls,
} from "../features/post"

const PostsManager = () => {
  // Post 관련 상태와 로직을 커스텀 훅으로 분리
  const { posts, total, selectedPost, newPost, loading, tags, filters, dialogs, actions } = usePosts()

  // 게시물 상세 다이얼로그 열기
  const handleOpenPostDetail = (post: (typeof posts)[0]) => {
    actions.openPostDetail(post)
  }
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)

  // 사용자 모달 열기
  const openUserModal = async (user: User) => {
    try {
      const response = await fetch(`/api/users/${user.id}`)
      const userData = await response.json()
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  useEffect(() => {
    actions.fetchTags()
  }, [])

  // URL에서 초기 파라미터 로드 (한번만)
  useEffect(() => {
    const params = new URLSearchParams(location.search)
    actions.updateFilters({
      skip: parseInt(params.get("skip") || "0"),
      limit: parseInt(params.get("limit") || "10"),
      searchQuery: params.get("search") || "",
      sortBy: params.get("sortBy") || "",
      sortOrder: params.get("sortOrder") || "asc",
      selectedTag: params.get("tag") || "",
    })
  }, [])

  // 필터 변경시 데이터 fetch
  useEffect(() => {
    if (filters.selectedTag) {
      actions.fetchPostsByTag(filters.selectedTag)
    } else {
      actions.fetchPosts()
    }
  }, [filters.skip, filters.limit, filters.sortBy, filters.sortOrder, filters.selectedTag])

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

  // 검색 컨트롤 핸들러들
  const handleSearchChange = (value: string) => {
    actions.updateFilters({ searchQuery: value })
  }

  const handleTagChange = (value: string) => {
    actions.updateFilters({ selectedTag: value }, true)
    actions.fetchPostsByTag(value)
  }

  const handleSortByChange = (value: string) => {
    actions.updateFilters({ sortBy: value }, true)
  }

  const handleSortOrderChange = (value: string) => {
    actions.updateFilters({ sortOrder: value }, true)
  }

  // 게시물 핸들러들
  const handleTagClick = (tag: string) => {
    actions.updateFilters({ selectedTag: tag }, true)
  }

  const handleEditPost = (post: (typeof posts)[0]) => {
    actions.selectPost(post)
    actions.openDialog("showEditDialog")
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
          <div className="flex gap-4">
            <SearchInput
              searchQuery={filters.searchQuery}
              onSearchChange={handleSearchChange}
              onSearchEnter={actions.searchPosts}
            />
            <TagSelector selectedTag={filters.selectedTag} tags={tags} onTagChange={handleTagChange} />
            <SortControls
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onSortByChange={handleSortByChange}
              onSortOrderChange={handleSortOrderChange}
            />
          </div>

          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostTable
              posts={posts}
              searchQuery={filters.searchQuery}
              selectedTag={filters.selectedTag}
              onTagClick={handleTagClick}
              onUserClick={openUserModal}
              onPostDetail={handleOpenPostDetail}
              onEditPost={handleEditPost}
              onDeletePost={actions.deletePost}
              highlightText={highlightText}
            />
          )}

          {/* 페이지네이션 */}
          <PostPagination
            currentPage={Math.floor(filters.skip / filters.limit)}
            itemsPerPage={filters.limit}
            totalItems={total}
            onPageChange={(skip: number) => actions.updateFilters({ skip }, true)}
            onItemsPerPageChange={(limit: number) => actions.updateFilters({ limit }, true)}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 다이얼로그 */}
      <AddPostDialog
        isOpen={dialogs.showAddDialog}
        onClose={(open: boolean) => (open ? actions.openDialog("showAddDialog") : actions.closeDialog("showAddDialog"))}
        post={newPost}
        onPostChange={actions.updateNewPost}
        onSubmit={actions.addPost}
      />

      {/* 게시물 수정 다이얼로그 */}
      <EditPostDialog
        isOpen={dialogs.showEditDialog}
        onClose={(open: boolean) =>
          open ? actions.openDialog("showEditDialog") : actions.closeDialog("showEditDialog")
        }
        post={selectedPost}
        onPostChange={actions.selectPost}
        onSubmit={actions.updatePost}
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
            <DialogTitle>{highlightText(selectedPost?.title, filters.searchQuery)}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>{highlightText(selectedPost?.body, filters.searchQuery)}</p>
            {selectedPost && (
              <CommentList postId={selectedPost.id} searchQuery={filters.searchQuery} highlightText={highlightText} />
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          {selectedUser && <UserProfile user={selectedUser} />}
        </DialogContent>
      </Dialog>
    </Card>
  )
}

export default PostsManager
