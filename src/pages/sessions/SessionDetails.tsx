import { findSessionUsers } from '@/api/clients/user.client'
import { PageContainer } from '@/components/Layout/PageContainer'
import { Toolbar } from '@/components/Layout/Toolbar'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { SessionPointsCard } from './SessionPointsCard'
import { useRef } from 'react'
import { Button } from 'antd'

// Define the type of the ref
type SessionPointsCardRef = {
  save: () => void
}

export const SessionDetails = () => {
  const { id } = useParams()
  // Correctly type the ref array
  const cardRefs = useRef<(SessionPointsCardRef | null)[]>([])

  const handleSaveAll = () => {
    cardRefs.current.forEach((ref) => ref?.save())
  }

  const sessionUsersQuery = useQuery({
    queryKey: ['session:users'],
    queryFn: () => findSessionUsers(id || 0),
  })

  return (
    <>
      <Toolbar className="bg-white shadow-sm">
        <Button onClick={handleSaveAll}>Save Points</Button>
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
