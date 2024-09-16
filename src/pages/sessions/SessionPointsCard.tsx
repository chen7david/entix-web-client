import { getUserEtpBalance, makePayment } from '@/api/clients/payment.client'
import { currUserAtom } from '@/store/auth.atom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Avatar, Button, message } from 'antd'
import { CurrencyType, IUserWithAttendance } from 'entix-shared'
import { useAtom } from 'jotai'
import { forwardRef, useState, useImperativeHandle } from 'react'
import cn from 'classnames'
type ISessionPointsCard = {
  user: IUserWithAttendance
}

export type SessionPointsCardRef = {
  savePoints: () => void
  plusOne: () => void
  plusFive: () => void
  plusTen: () => void
}

export const SessionPointsCard = forwardRef<
  SessionPointsCardRef,
  ISessionPointsCard
>(({ user }, ref) => {
  const [score, setScore] = useState(0)
  const [currUser] = useAtom(currUserAtom)
  const [isHovered, setIsHovered] = useState(false)
  const queryClient = useQueryClient()

  const handleMouseEnter = () => {
    setIsHovered(true)
    console.log({ isHovered })
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    console.log({ isHovered })
  }

  const getBalanceQuery = useQuery({
    queryKey: ['user:etp-balance', { userId: user.id }],
    queryFn: async () => getUserEtpBalance({ userId: user.id }),
  })

  const sessionPointsMutation = useMutation({

    mutationFn: makePayment,
    onSuccess: () => {
      // invalidate the user:etp-balance
      queryClient.invalidateQueries({ queryKey: ['user:etp-balance'] })
      message.success(`Added ${score} points to ${user.firstName}'s account`)
      setScore(0)
    },
  })

  const savePoints = async () => {
    if (user.canceledAt) return
    if (score < 1) return message.warning('You need 1 point or more')
    sessionPointsMutation.mutate({
      senderId: currUser!.id,
      recipientId: user.id,
      currencyType: CurrencyType.EntixPoints,
      amount: score,
      description: 'sessions reward points',
    })
  }

  const plusOne = () => {
    if (user.canceledAt) return
    setScore(score + 1)
  }

  const plusFive = () => {
    if (user.canceledAt) return
    setScore(score + 5)
  }

  const plusTen = () => {
    if (user.canceledAt) return
    setScore(score + 10)
  }

  useImperativeHandle(ref, () => ({
    savePoints: savePoints,
    plusFive: plusFive,
    plusTen: plusTen,
    plusOne: plusOne,
  }))

  return (
    <div
      className={cn(
        'bg-gray-100 border-solid border-2 border-gray-200 rounded text-xs p-8 flex flex-col w-36 h-58 items-center gap-5',
        { 'bg-orange-100': user.canceledAt },
        { 'bg-green-100': user.paidAt },
      )}
    >
      <div className="flex flex-col items-center gap-1">
        <Avatar
          size={60}
          style={{
            backgroundColor: user?.sex === 'm' ? '#3291a8' : '#cc233f',
          }}
          src={user.imageUrl}
        >
          {user.firstName[0]}
        </Avatar>
        {user.firstName} {user.lastName}
      </div>

      <div
        onClick={savePoints}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={cn(
          'bg-gray-200 w-20 h-10 rounded-lg flex items-center justify-center font-bold text-lg cursor-pointer',
          {
            ' border-solid border-2 border-gray-300': isHovered,
          },
        )}
      >
        {!isHovered ? score : (getBalanceQuery?.data?.balance ?? 0) / 100}
      </div>
      <div>
        <Button.Group>
          <Button
            disabled={user.canceledAt !== null}
            onClick={() => setScore(score + 1)}
          >
            +
          </Button>
          <Button
            disabled={user.canceledAt !== null}
            onClick={() => score > 0 && setScore(score - 1)}
          >
            -
          </Button>
        </Button.Group>
      </div>
    </div>
  )
})
