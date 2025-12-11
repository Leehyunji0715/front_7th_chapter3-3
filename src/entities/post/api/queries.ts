import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Post, PostDTO } from "../model/types"
import * as postApi from "./requests"

// API Response Types
type PostsWithAuthorsResponse = {
  posts: Post[]
  total: number
  skip: number
  limit: number
}

// Query Keys
export const postKeys = {
  all: ["posts"] as const,
  lists: () => [...postKeys.all, "list"] as const,
  list: (filters: { limit?: number; skip?: number; sortBy?: string; sortOrder?: string }) =>
    [...postKeys.lists(), filters] as const,
  search: (query: string) => [...postKeys.all, "search", query] as const,
  byTag: (tag: string) => [...postKeys.all, "tag", tag] as const,
  tags: () => ["tags"] as const,
} as const

// Posts Query Hook
export const usePostsQuery = (
  filters: {
    limit?: number
    skip?: number
    sortBy?: string
    sortOrder?: string
    enabled?: boolean
  } = {},
) => {
  return useQuery({
    queryKey: postKeys.list({
      limit: filters.limit || 10,
      skip: filters.skip || 0,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder,
    }),
    queryFn: () =>
      postApi.fetchPosts({
        limit: filters.limit || 10,
        skip: filters.skip || 0,
      }),
    enabled: filters.enabled !== false, // 명시적으로 false가 아니면 실행
    staleTime: 5 * 60 * 1000, // 5분
  })
}

// Search Posts Query Hook
export const useSearchPostsQuery = (searchQuery: string) => {
  return useQuery({
    queryKey: postKeys.search(searchQuery),
    queryFn: () => postApi.searchPosts(searchQuery),
    enabled: !!searchQuery,
    staleTime: 5 * 60 * 1000,
  })
}

// Posts by Tag Query Hook
export const usePostsByTagQuery = (tag: string) => {
  return useQuery({
    queryKey: postKeys.byTag(tag),
    queryFn: () => postApi.fetchPostsByTag(tag),
    enabled: !!tag && tag !== "all",
    staleTime: 5 * 60 * 1000,
  })
}

// Tags Query Hook
export const useTagsQuery = () => {
  return useQuery({
    queryKey: postKeys.tags(),
    queryFn: () => postApi.fetchTags(),
    staleTime: 30 * 60 * 1000, // 30분 (태그는 자주 변경되지 않음)
  })
}

// Add Post Mutation
export const useAddPostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostDTO, Error, { title: string; body: string; userId: number }>({
    mutationFn: postApi.addPost,
    onSuccess: (newPost) => {
      // 새로운 포스트를 캐시의 맨 앞에 추가 (invalidateQueries 제거로 fetch 방지)
      queryClient.setQueriesData({ queryKey: postKeys.lists() }, (old: PostsWithAuthorsResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          posts: [newPost, ...old.posts],
          total: old.total + 1,
        }
      })
      console.log("Post added successfully")
    },
    onError: (error) => {
      console.error("Add post failed:", error)
    },
  })
}

// Update Post Mutation
export const useUpdatePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<PostDTO, Error, PostDTO>({
    mutationFn: postApi.updatePost,
    onSuccess: (updatedPost) => {
      // 개별 쿼리들의 데이터를 직접 업데이트 (invalidateQueries 제거로 fetch 방지)
      queryClient.setQueriesData({ queryKey: postKeys.lists() }, (old: PostsWithAuthorsResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          posts: old.posts.map((post: Post) => (post.id === updatedPost.id ? { ...post, ...updatedPost } : post)),
        }
      })
    },
  })
}

// Delete Post Mutation
export const useDeletePostMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, number>({
    mutationFn: postApi.deletePost,
    onSuccess: (_, deletedId) => {
      // 개별 쿼리들에서 삭제된 포스트 제거 (invalidateQueries 제거로 fetch 방지)
      queryClient.setQueriesData({ queryKey: postKeys.lists() }, (old: PostsWithAuthorsResponse | undefined) => {
        if (!old) return old
        return {
          ...old,
          posts: old.posts.filter((post: Post) => post.id !== deletedId),
          total: old.total - 1,
        }
      })
    },
  })
}
