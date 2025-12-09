import { User } from "../model/types"

export const fetchUsers = async (): Promise<User[]> => {
  return fetch("/api/users?limit=0&select=username,image").then((res) => res.json())
}
