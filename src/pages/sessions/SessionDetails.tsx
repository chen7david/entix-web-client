import { findSessionUsers } from '@/api/clients/user.client'
import { PageContainer } from '@/components/Layout/PageContainer'
import { Toolbar } from '@/components/Layout/Toolbar'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { SessionPointsCard, SessionPointsCardRef } from './SessionPointsCard'
import { useRef } from 'react'
import { Button } from 'antd'

export const SessionDetails = () => {
  const { id } = useParams()
  // Correctly type the ref array
  const cardRefs = useRef<(SessionPointsCardRef | null)[]>([])

  const handleSaveAll = () => {
    cardRefs.current.forEach((ref) => ref?.savePoints())
  }

  const plusOne = () => {
    cardRefs.current.forEach((ref) => ref?.plusOne())
  }

  const plusFive = () => {
    cardRefs.current.forEach((ref) => ref?.plusFive())
  }

  const plusTen = () => {
    cardRefs.current.forEach((ref) => ref?.plusTen())
  }

  const sessionUsersQuery = useQuery({
    queryKey: ['session:users'],
    queryFn: () => findSessionUsers(id || 0),
  })

  return (
    <>
      <Toolbar className="bg-white shadow-sm flex gap-2">
        <Button type="text" onClick={handleSaveAll}>
          Save
        </Button>
        <Button type="text" onClick={plusOne}>
          +1
        </Button>
        <Button type="text" onClick={plusFive}>
          +5
        </Button>
        <Button type="text" onClick={plusTen}>
          +10
        </Button>
      </Toolbar>
      <PageContainer className="flex flex-col gap-2">
        <div className="flex gap-4">
          {sessionUsersQuery.data?.map((user) => (
            <SessionPointsCard
              key={user.id}
              user={user}
              ref={(el) => {
                cardRefs.current[user.id] = el
              }}
            />
          ))}
        </div>
      </PageContainer>
    </>
  )
}
