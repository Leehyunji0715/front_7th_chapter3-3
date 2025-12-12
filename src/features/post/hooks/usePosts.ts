import { useState, useCallback } from "react"
import { Post } from "../../../entities/post/model/types"
interface UsePostsReturn {
  total: number
  loading: boolean
  tags: { slug: string; name: string; url: string }[]

  // 선택된 게시물
  selectedPost: Post | null

  // 다이얼로그 상태
  dialogs: {
    showAddDialog: boolean
    showEditDialog: boolean
    showPostDetailDialog: boolean
  }

  // 액션 함수들
  actions: {
    selectPost: (post: Post | null) => void
    openDialog: (dialog: keyof UsePostsReturn["dialogs"]) => void
    closeDialog: (dialog: keyof UsePostsReturn["dialogs"]) => void
    openPostDetail: (post: Post) => void
  }
}

export const usePosts = (): UsePostsReturn => {
  // 기본 상태
  const [total] = useState(0)
  const [loading] = useState(false)
  const [tags] = useState<{ slug: string; name: string; url: string }[]>([])

  // 선택된 게시물
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  // 다이얼로그 상태
  const [dialogs, setDialogs] = useState({
    showAddDialog: false,
    showEditDialog: false,
    showPostDetailDialog: false,
  })

  const selectPost = useCallback((post: Post | null) => {
    setSelectedPost(post)
  }, [])

  const openDialog = useCallback((dialog: keyof typeof dialogs) => {
    setDialogs((prev) => ({ ...prev, [dialog]: true }))
  }, [])

  const closeDialog = useCallback((dialog: keyof typeof dialogs) => {
    setDialogs((prev) => ({ ...prev, [dialog]: false }))
  }, [])

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    selectPost(post)
    openDialog("showPostDetailDialog")
  }

  return {
    // 상태
    total,
    selectedPost,
    loading,
    tags,

    // 그룹화된 상태
    dialogs,

    // 액션 함수들
    actions: {
      selectPost,
      openDialog,
      closeDialog,
      openPostDetail,
    },
  }
}
