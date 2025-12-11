import { useQuery } from "@tanstack/react-query"
import * as userApi from "./requests"

// Query Keys
export const userKeys = {
  all: ["users"] as const,
  lists: () => [...userKeys.all, "list"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
} as const

// Users Query Hook
export const useUsersQuery = () => {
  return useQuery({
    queryKey: userKeys.lists(),
    queryFn: userApi.fetchUsers,
    staleTime: 10 * 60 * 1000, // 10분 - 사용자 데이터는 자주 변하지 않음
  })
}

// User by ID Query Hook
export const useUserQuery = (userId: string) => {
  return useQuery({
    queryKey: userKeys.detail(userId),
    queryFn: () => userApi.fetchUserById(userId),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000, // 10분
  })
}
