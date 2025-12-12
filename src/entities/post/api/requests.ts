import { PostDTO } from "../model/types"

export const fetchPosts = async ({
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  limit: number
  skip: number
  sortBy?: string
  sortOrder?: string
}): Promise<{ posts: PostDTO[]; total: number }> => {
  let url = `/api/posts?limit=${limit}&skip=${skip}`
  if (sortBy) {
    url += `&sortBy=${sortBy}`
  }
  if (sortOrder) {
    url += `&order=${sortOrder}`
  }
  return fetch(url)
    .then((response) => response.json())
    .catch((error) => {
      console.error("게시물 가져오기 오류:", error)
    })
}

export const fetchPostsByTag = async ({
  tag,
  limit,
  skip,
}: {
  tag: string
  limit?: number
  skip?: number
}): Promise<{ posts: PostDTO[]; total: number }> => {
  let url = `/api/posts/tag/${tag}`
  const params = new URLSearchParams()
  if (limit !== undefined) params.set("limit", limit.toString())
  if (skip !== undefined) params.set("skip", skip.toString())
  const queryString = params.toString()
  if (queryString) url += `?${queryString}`
  return fetch(url).then((res) => res.json())
}

// 순차 ID 생성을 위한 카운터
let nextPostId = 252

export const addPost = async (newPost: { title: string; body: string; userId: number }): Promise<PostDTO> => {
  const response = await fetch("/api/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  })
  const result = await response.json()
  return {
    ...result,
    id: nextPostId++, // 1씩 증가하는 ID 생성
  }
}

export const updatePost = async (post: PostDTO): Promise<PostDTO> => {
  const response = await fetch(`/api/posts/${post.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(post),
  })
  return response.json()
}

export const deletePost = async (id: number): Promise<void> => {
  await fetch(`/api/posts/${id}`, {
    method: "DELETE",
  })
}

export const searchPosts = async (searchQuery: string): Promise<{ posts: PostDTO[]; total: number }> => {
  const response = await fetch(`/api/posts/search?q=${searchQuery}`)
  return response.json()
}

export const fetchTags = async (): Promise<{ slug: string; name: string; url: string }[]> => {
  const response = await fetch("/api/posts/tags")
  return response.json()
}
