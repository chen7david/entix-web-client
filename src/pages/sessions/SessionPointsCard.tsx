import { makePayment } from '@/api/clients/payment.client'
import { currUserAtom } from '@/store/auth.atom'
import { useMutation } from '@tanstack/react-query'
import { Avatar, Button, message } from 'antd'
import { CurrencyType, IUserWithAttendance } from 'entix-shared'
import { useAtom } from 'jotai'
import { forwardRef, useState, useImperativeHandle } from 'react'

type ISessionPointsCard = {
  user: IUserWithAttendance
}

export type SessionPointsCardRef = {
  save: () => void
}

export const SessionPointsCard = forwardRef<
  SessionPointsCardRef,
  ISessionPointsCard
>(({ user }, ref) => {
  const [score, setScore] = useState(0)
  const [currUser] = useAtom(currUserAtom)

  const sessionPointsMutation = useMutation({
    mutationFn: makePayment,
    onSuccess: () => {
      message.success(`Added ${score} points to ${user.firstName}'s account`)
      setScore(0)
    },
  })

  const savePoints = async () => {
    sessionPointsMutation.mutate({
      senderId: currUser!.id,
      recipientId: user.id,
      currencyType: CurrencyType.EntixPoints,
      amount: score,
    })
  }

  useImperativeHandle(ref, () => ({
    save: savePoints,
  }))

  return (
    <div className="bg-gray-100 rounded text-xs p-3 flex flex-col w-28 h-58 items-center gap-5">
      <div className="flex flex-col items-center gap-2">
        <Avatar
          size={45}
          style={{
            backgroundColor: user?.sex === 'm' ? '#3291a8' : '#cc233f',
          }}
          src={user.imageUrl}
        >
          {user.firstName[0]}
        </Avatar>
        {user.firstName} {user.lastName}
      </div>
      <div className="bg-gray-200 w-20 h-10 rounded-lg flex items-center justify-center font-bold text-lg">
        {score}
      </div>

      <div>
        <Button.Group>
          <Button onClick={() => setScore(score + 1)}>+</Button>
          <Button onClick={() => setScore(score - 1)}>-</Button>
        </Button.Group>
      </div>

      <div>
        <Button.Group>
          <Button
            loading={sessionPointsMutation.isPending}
            size="small"
            type="primary"
            onClick={savePoints}
          >
            save
          </Button>
        </Button.Group>
      </div>
    </div>
  )
})
