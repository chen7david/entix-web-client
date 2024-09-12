import { findOneSession } from '@/api/clients/session.client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { getSessionWords } from '@/api/clients/session-words.cient'

export const SessionWordsPage = () => {
  const { id } = useParams()
  const findSessionQuery = useQuery({
    queryKey: ['session:current'],
    queryFn: () => findOneSession(id || ''),
  })

  const findSessionWordsQuery = useQuery({
    queryKey: ['session:words'],
    queryFn: () => getSessionWords(id || ''),
  })

  const session = findSessionQuery.data
  const words = findSessionWordsQuery.data

  const handlePrint = () => {
    window.print()
  }

  return (
    <div className="p-6">
      {/* Print button */}
      <button
        onClick={handlePrint}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 print:hidden"
      >
        Print Page
      </button>

      {/* Session details */}
      <div className="mb-6">
        <p className="text-base font-bold">{session?.name}</p>
        <p className="text-sm">ID: {session?.xid}</p>
        <p className="text-sm">
          Date: {dayjs(session?.startDate).format('YYYY-MM-DD')}
        </p>
        <p className="text-sm">Details: {session?.description || 'None'}</p>
      </div>

      {/* Words list */}
      <div className="space-y-2">
        {words?.map((word, index) => (
          <div key={index} className="flex items-center space-x-2 rounded">
            <div className="flex-shrink-0 w-8 text-xs font-semibold">{`${index + 1}`}</div>
            <div className="flex-1 text-base font-medium">{word.wordEn}</div>
            <div className="flex-1 text-base">{word.wordZh}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
