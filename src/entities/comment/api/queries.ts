import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CommentDTO, NewCommentData } from "../model/types"
import {
  CommentsResponse,
  fetchCommentsAPI,
  addCommentAPI,
  updateCommentAPI,
  deleteCommentAPI,
  likeCommentAPI,
} from "./requests"

// Types
type OptimisticUpdateContext = {
  previousComments: unknown
  postId: number
}
type UpdateCommentVariables = { commentId: number; body: string; postId: number }
type LikeCommentVariables = { commentId: number; currentLikes: number; postId: number }

// Query Keys
export const commentKeys = {
  all: ["comments"] as const,
  byPost: (postId: number) => ["comments", "post", postId] as const,
} as const

// React Query Hooks
export const useCommentsQuery = (postId: number) => {
  return useQuery({
    queryKey: commentKeys.byPost(postId),
    queryFn: () => fetchCommentsAPI(postId),
    enabled: !!postId,
    staleTime: 5 * 60 * 1000, // 5분
  })
}

export const useAddCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<CommentDTO, Error, NewCommentData, OptimisticUpdateContext>({
    mutationFn: addCommentAPI,
    onMutate: async (newComment) => {
      const postId = newComment.postId
      if (!postId) return { previousComments: null, postId: 0 }

      await queryClient.cancelQueries({ queryKey: commentKeys.byPost(postId) })
      const previousComments = queryClient.getQueryData(commentKeys.byPost(postId))

      // 임시 ID로 새 댓글 생성 (실제 서버 응답에서는 실제 ID가 올 것)
      const optimisticComment: CommentDTO = {
        id: Date.now(), // 임시 ID
        body: newComment.body,
        postId: postId,
        likes: 0,
        user: {
          id: newComment.userId,
          username: "You", // 임시 사용자명
          fullName: "Current User",
          image: "", // 임시 이미지
        },
      }

      queryClient.setQueryData(commentKeys.byPost(postId), (old: unknown) => {
        const commentsData = old as CommentsResponse | undefined
        if (!commentsData) return { comments: [optimisticComment] }

        return {
          ...commentsData,
          comments: [...commentsData.comments, optimisticComment],
        }
      })

      return { previousComments, postId }
    },
    onError: (_error, variables, context) => {
      const postId = variables.postId
      if (context?.previousComments && postId) {
        queryClient.setQueryData(commentKeys.byPost(postId), context.previousComments)
      }
    },
    onSuccess: (serverComment, variables) => {
      // 서버 응답으로 임시 댓글을 실제 댓글로 교체
      const postId = variables.postId
      if (!postId) return

      queryClient.setQueryData(commentKeys.byPost(postId), (old: unknown) => {
        const commentsData = old as CommentsResponse | undefined
        if (!commentsData) return { comments: [serverComment] }

        return {
          ...commentsData,
          comments: commentsData.comments.map((comment) =>
            comment.user.username === "You" && comment.body === serverComment.body ? serverComment : comment,
          ),
        }
      })
    },
  })
}

export const useUpdateCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<CommentDTO, Error, UpdateCommentVariables, OptimisticUpdateContext>({
    mutationFn: ({ commentId, body }) => updateCommentAPI(commentId, body),
    onMutate: async ({ commentId, body, postId }) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.byPost(postId) })
      const previousComments = queryClient.getQueryData(commentKeys.byPost(postId))

      queryClient.setQueryData(commentKeys.byPost(postId), (old: unknown) => {
        const commentsData = old as CommentsResponse | undefined
        if (!commentsData) return old

        return {
          ...commentsData,
          comments: commentsData.comments.map((comment) => (comment.id === commentId ? { ...comment, body } : comment)),
        }
      })

      return { previousComments, postId }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(commentKeys.byPost(context.postId), context.previousComments)
      }
    },
  })
}

export const useDeleteCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<void, Error, { commentId: number; postId: number }, OptimisticUpdateContext>({
    mutationFn: ({ commentId }) => deleteCommentAPI(commentId),
    onMutate: async ({ commentId, postId }) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.byPost(postId) })
      const previousComments = queryClient.getQueryData(commentKeys.byPost(postId))

      queryClient.setQueryData(commentKeys.byPost(postId), (old: unknown) => {
        const commentsData = old as CommentsResponse | undefined
        if (!commentsData) return old

        return {
          ...commentsData,
          comments: commentsData.comments.filter((comment) => comment.id !== commentId),
        }
      })

      return { previousComments, postId }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(commentKeys.byPost(context.postId), context.previousComments)
      }
    },
  })
}

export const useLikeCommentMutation = () => {
  const queryClient = useQueryClient()

  return useMutation<CommentDTO, Error, LikeCommentVariables, OptimisticUpdateContext>({
    mutationFn: ({ commentId, currentLikes }) => likeCommentAPI(commentId, currentLikes),
    onMutate: async ({ commentId, currentLikes, postId }) => {
      await queryClient.cancelQueries({ queryKey: commentKeys.byPost(postId) })
      const previousComments = queryClient.getQueryData(commentKeys.byPost(postId))

      queryClient.setQueryData(commentKeys.byPost(postId), (old: unknown) => {
        const commentsData = old as CommentsResponse | undefined
        if (!commentsData) return old

        return {
          ...commentsData,
          comments: commentsData.comments.map((comment) =>
            comment.id === commentId ? { ...comment, likes: currentLikes + 1 } : comment,
          ),
        }
      })

      return { previousComments, postId }
    },
    onError: (_error, _variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData(commentKeys.byPost(context.postId), context.previousComments)
      }
    },
  })
}
