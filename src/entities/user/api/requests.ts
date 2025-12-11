import { UserDTO, User } from "../model/types"

export const fetchUsers = async (): Promise<{ users: UserDTO[]; limit: number; skip: number; total: number }> => {
  return fetch("/api/users?limit=0&select=username,image").then((res) => res.json())
}

export const fetchUserById = async (userId: string): Promise<User> => {
  const response = await fetch(`/api/users/${userId}`)
  if (!response.ok) {
    throw new Error("사용자 정보 가져오기 실패")
  }
  return response.json()
}
