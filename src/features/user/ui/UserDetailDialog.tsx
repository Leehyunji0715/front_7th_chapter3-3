import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../../components"
import { UserProfile } from "../../../entities/user"
import { useUserQuery } from "../../../entities/user/api/queries"

interface UserDetailDialogProps {
  userId: string | null
  onClose: () => void
}

export const UserDetailDialog = ({ userId, onClose }: UserDetailDialogProps) => {
  const { data: userData, isLoading } = useUserQuery(userId || "")

  return (
    <Dialog open={!!userId} onOpenChange={(open) => !open && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>사용자 정보</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center p-4">로딩 중...</div>
        ) : (
          userData && <UserProfile user={userData} />
        )}
      </DialogContent>
    </Dialog>
  )
}
