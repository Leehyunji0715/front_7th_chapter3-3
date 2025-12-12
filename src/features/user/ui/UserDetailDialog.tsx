import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components"
import { User, UserProfile } from "../../../entities/user"

interface UserDetailDialogProps {
  userId: string | null
  onClose: () => void
}

export const UserDetailDialog = ({ userId, onClose }: UserDetailDialogProps) => {
  const [userData, setUserData] = useState<User | null>(null)
  const [loading, setLoading] = useState(false)

  // userId가 변경될 때마다 사용자 정보 fetch
  useState(() => {
    if (userId) {
      setLoading(true)
      fetch(`/api/users/${userId}`)
        .then((response) => response.json())
        .then((data) => {
          setUserData(data)
          setLoading(false)
        })
        .catch((error) => {
          console.error("사용자 정보 가져오기 오류:", error)
          setLoading(false)
        })
    }
  })

  return (
    <Dialog open={!!userId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center p-4">로딩 중...</div>
        ) : (
          userData && <UserProfile user={userData} />
        )}
      </DialogContent>
    </Dialog>
  )
}
