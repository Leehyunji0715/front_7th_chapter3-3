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

export const addPost = async () => {}
