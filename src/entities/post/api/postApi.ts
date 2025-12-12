import { PostDTO } from "../model/types"

export const fetchPosts = async ({
  limit,
  skip,
}: {
  limit: number
  skip: number
}): Promise<{ posts: PostDTO[]; total: number }> => {
  return fetch(`/api/posts?limit=${limit}&skip=${skip}`)
    .then((response) => response.json())
    .catch((error) => {
      console.error("게시물 가져오기 오류:", error)
    })
}

export const fetchPostsByTag = async (tag: string): Promise<{ posts: PostDTO[]; total: number }> => {
  return fetch(`/api/posts/tag/${tag}`).then((res) => res.json())
}

export const addPost = async (newPost: { title: string; body: string; userId: number }): Promise<PostDTO> => {
  const response = await fetch("/api/posts/add", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(newPost),
  })
  return response.json()
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
