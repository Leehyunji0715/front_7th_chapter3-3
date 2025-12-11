import { useState, useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { Post } from "../../../entities/post/model/types"
import * as postApi from "../../../entities/post/api/postApi"
import * as userApi from "../../../entities/user/api/userApi"

interface UsePostsReturn {
  // 상태
  posts: Post[]
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
    fetchPosts: (currentFilters?: UsePostsReturn["filters"]) => Promise<void>
    fetchTags: () => Promise<void>
    searchPosts: (currentFilters?: UsePostsReturn["filters"]) => Promise<void>
    fetchPostsByTag: (tag: string, currentFilters?: UsePostsReturn["filters"]) => Promise<void>
    addPost: () => Promise<void>
    updatePost: () => Promise<void>
    deletePost: (id: number) => Promise<void>
    openPostDetail: (post: Post) => void
  }
}

export const usePosts = (): UsePostsReturn => {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)

  // 기본 상태
  const [posts, setPosts] = useState<Post[]>([])
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)
  const [tags, setTags] = useState<{ slug: string; name: string; url: string }[]>([])

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



  // 게시물 가져오기
  const fetchPosts = useCallback(async (currentFilters = filters) => {
    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([
        postApi.fetchPosts({ limit: currentFilters.limit, skip: currentFilters.skip }),
        userApi.fetchUsers(),
      ])

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 태그 가져오기
  const fetchTags = useCallback(async () => {
    try {
      const data = await postApi.fetchTags()
      setTags(data)
    } catch (error) {
      console.error("태그 가져오기 오류:", error)
    }
  }, [])

  // 게시물 검색
  const searchPosts = useCallback(async (currentFilters = filters) => {
    if (!currentFilters.searchQuery) {
      fetchPosts(currentFilters)
      return
    }

    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([postApi.searchPosts(currentFilters.searchQuery), userApi.fetchUsers()])

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    } finally {
      setLoading(false)
    }
  }, [fetchPosts])

  // 태그별 게시물 가져오기
  const fetchPostsByTag = useCallback(
    async (tag: string, currentFilters = filters) => {
      if (!tag || tag === "all") {
        fetchPosts(currentFilters)
        return
      }

      setLoading(true)
      try {
        const [postsData, usersData] = await Promise.all([postApi.fetchPostsByTag(tag), userApi.fetchUsers()])

        const postsWithUsers = postsData.posts.map((post) => ({
          ...post,
          author: usersData.users.find((user) => user.id === post.userId),
        }))

        setPosts(postsWithUsers)
        setTotal(postsData.total)
      } catch (error) {
        console.error("태그별 게시물 가져오기 오류:", error)
      } finally {
        setLoading(false)
      }
    },
    [fetchPosts],
  )

  // 게시물 추가
  const addPost = async () => {
    try {
      const [data, usersData] = await Promise.all([postApi.addPost(newPost), userApi.fetchUsers()])

      const postWithAuthor = {
        ...data,
        author: usersData.users.find((user) => user.id === data.userId),
      }

      setPosts([postWithAuthor, ...posts])
      closeDialog("showAddDialog")
      updateNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  // 게시물 업데이트
  const updatePostAction = async () => {
    if (!selectedPost) return
    try {
      const [data, usersData] = await Promise.all([postApi.updatePost(selectedPost), userApi.fetchUsers()])

      const postWithAuthor = {
        ...data,
        author: usersData.users.find((user) => user.id === data.userId),
      }

      setPosts(posts.map((post) => (post.id === data.id ? postWithAuthor : post)))
      closeDialog("showEditDialog")
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }

  // 게시물 삭제
  const deletePost = async (id: number) => {
    try {
      await postApi.deletePost(id)
      setPosts(posts.filter((post) => post.id !== id))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
    }
  }

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    selectPost(post)
    openDialog("showPostDetailDialog")
  }

  return {
    // 상태
    posts,
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
      fetchPosts,
      fetchTags,
      searchPosts,
      fetchPostsByTag,
      addPost,
      updatePost: updatePostAction,
      deletePost,
      openPostDetail,
    },
  }
}
