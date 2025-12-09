import { UserDTO } from "../model/types"

export const fetchUsers = async (): Promise<{ users: UserDTO[]; limit: number; skip: number; total: number }> => {
  return fetch("/api/users?limit=0&select=username,image").then((res) => res.json())
}
