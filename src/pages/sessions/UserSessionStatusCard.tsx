import { Avatar, Button } from 'antd'
import { ISession, IUserWithAttendance } from 'entix-shared'
import cn from 'classnames'
import {
  markUserSessionAbsent,
  markUserSessionPresent,
} from '@/api/clients/user-session.cient'
import { useMutation, useQueryClient } from '@tanstack/react-query'

export const UserSessionStatusCard = ({
  session,
  user,
}: {
  session: ISession
  user: IUserWithAttendance
}) => {
  const queryClient = useQueryClient()

  const markUserSessionPresentMutation = useMutation({
    mutationFn: markUserSessionPresent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['session:users'],
      })
    },
  })

  const markUserSessionAbsentMutation = useMutation({
    mutationFn: markUserSessionAbsent,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['session:users'],
      })
    },
  })
  return (
    <div>
      <div
        key={user.id}
        className={cn(
          'bg-green-100 flex rounded p-3 items-center justify-between',
          { 'bg-orange-100': user.canceledAt },
        )}
      >
        <div>
          <Avatar
            style={{
              backgroundColor: user?.sex == 'm' ? '#3291a8' : '#cc233f',
            }}
            src={user.imageUrl}
          >
            {user.firstName[0]}
          </Avatar>
          <span className="pl-3">
            {user.firstName} {user.lastName}
          </span>
        </div>
        <div>
          <Button
            loading={
              markUserSessionPresentMutation.isPending ||
              markUserSessionPresentMutation.isPending
            }
            onClick={() => {
              if (!user.canceledAt) {
                console.log('canel attendance')
                markUserSessionAbsentMutation.mutate({
                  userId: user.id,
                  sessionId: session.id,
                })
              } else {
                console.log('restore attendance')
                markUserSessionPresentMutation.mutate({
                  userId: user.id,
                  sessionId: session.id,
                })
              }
            }}
          >
            {user.canceledAt ? 'Present' : 'Absent'}
          </Button>
        </div>
      </div>
    </div>
  )
}
