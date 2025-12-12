import { useState, useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Post } from "../../../entities/post/model/types"
interface UsePostsReturn {
  total: number
  loading: boolean
  tags: { slug: string; name: string; url: string }[]

  // 필터/검색 상태
  filters: {
    skip: number
    limit: number
    searchQuery: string
    sortBy: string
    sortOrder: string
    selectedTag: string
  }

  // 선택된 게시물
  selectedPost: Post | null

  // 다이얼로그 상태
  dialogs: {
    showAddDialog: boolean
    showEditDialog: boolean
    showPostDetailDialog: boolean
  }

  // 새 게시물 데이터
  newPost: { title: string; body: string; userId: number }

  // 액션 함수들
  actions: {
    updateFilters: (filters: Partial<UsePostsReturn["filters"]>, updateUrl?: boolean) => void
    selectPost: (post: Post | null) => void
    openDialog: (dialog: keyof UsePostsReturn["dialogs"]) => void
    closeDialog: (dialog: keyof UsePostsReturn["dialogs"]) => void
    updateNewPost: (data: Partial<UsePostsReturn["newPost"]>) => void
    openPostDetail: (post: Post) => void
  }
}

export const usePosts = (): UsePostsReturn => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 기본 상태
  const [total] = useState(0)
  const [loading] = useState(false)
  const [tags] = useState<{ slug: string; name: string; url: string }[]>([])

  // 필터 상태
  const [filters, setFilters] = useState({
    skip: parseInt(queryParams.get("skip") || "0"),
    limit: parseInt(queryParams.get("limit") || "10"),
    searchQuery: queryParams.get("search") || "",
    sortBy: queryParams.get("sortBy") || "",
    sortOrder: queryParams.get("sortOrder") || "asc",
    selectedTag: queryParams.get("tag") || "",
  })

  // 선택된 게시물
  const [selectedPost, setSelectedPost] = useState<Post | null>(null)

  // 다이얼로그 상태
  const [dialogs, setDialogs] = useState({
    showAddDialog: false,
    showEditDialog: false,
    showPostDetailDialog: false,
  })

  // 새 게시물 데이터
  const [newPost, setNewPost] = useState({ title: "", body: "", userId: 1 })

  // 액션 함수들 (useCallback으로 메모이제이션)
  const updateFilters = useCallback(
    (newFilters: Partial<typeof filters>, updateUrl = false) => {
      setFilters((prev) => {
        const updated = { ...prev, ...newFilters }
        if (updateUrl) {
          // URL 업데이트를 위해 setTimeout 사용 (다음 렌더 사이클에서 실행)
          setTimeout(() => {
            const params = new URLSearchParams()
            if (updated.skip) params.set("skip", updated.skip.toString())
            if (updated.limit) params.set("limit", updated.limit.toString())
            if (updated.searchQuery) params.set("search", updated.searchQuery)
            if (updated.sortBy) params.set("sortBy", updated.sortBy)
            if (updated.sortOrder) params.set("sortOrder", updated.sortOrder)
            if (updated.selectedTag) params.set("tag", updated.selectedTag)
            navigate(`?${params.toString()}`)
          }, 0)
        }
        return updated
      })
    },
    [navigate],
  )

  const selectPost = useCallback((post: Post | null) => {
    setSelectedPost(post)
  }, [])

  const openDialog = useCallback((dialog: keyof typeof dialogs) => {
    setDialogs((prev) => ({ ...prev, [dialog]: true }))
  }, [])

  const closeDialog = useCallback((dialog: keyof typeof dialogs) => {
    setDialogs((prev) => ({ ...prev, [dialog]: false }))
  }, [])

  const updateNewPost = useCallback((data: Partial<typeof newPost>) => {
    setNewPost((prev) => ({ ...prev, ...data }))
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
    newPost,
    loading,
    tags,

    // 그룹화된 상태
    filters,
    dialogs,

    // 액션 함수들
    actions: {
      updateFilters,
      selectPost,
      openDialog,
      closeDialog,
      updateNewPost,
      openPostDetail,
    },
  }
}
