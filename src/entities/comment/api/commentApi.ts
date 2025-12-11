import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { CommentDTO } from "../model/types"
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

  return useMutation({
    mutationFn: addCommentAPI,
    onSuccess: (newComment) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.byPost(newComment.postId),
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

  return useMutation({
    mutationFn: ({ commentId }: { commentId: number; postId: number }) => deleteCommentAPI(commentId),
    onSuccess: (_, { postId }) => {
      queryClient.invalidateQueries({
        queryKey: commentKeys.byPost(postId),
      })
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
