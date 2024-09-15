import { findOneSession } from '@/api/clients/session.client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import React, { useRef } from 'react'
import ReactToPrint from 'react-to-print'
import { ISession, IWord } from 'entix-shared'
import { getSessionWords } from '@/api/clients/session-words.cient'

// Component to be printed
const WordListPrint = React.forwardRef<
  HTMLDivElement,
  { session: ISession; words: IWord[] }
>(({ session, words }, ref) => (
  <div ref={ref}>
    {/* Include session details at the top */}
    <div className="mb-4">
      <h2 className="text-xl font-bold">
        {dayjs(session?.startDate).format('YYMMDD')} - {session?.name} -{' '}
        {session?.description || 'None'}
      </h2>
      <p>ID: {session?.xid}</p>
      <p>Date: {dayjs(session?.startDate).format('YYYY-MM-DD')}</p>
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
))

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

  const session = findSessionQuery.data as ISession
  const words = findSessionWordsQuery.data || []
  const printRef = useRef<HTMLDivElement>(null)

  return (
    <div className="p-6">
      {/* Print button */}
      <ReactToPrint
        trigger={() => (
          <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Print Word List
          </button>
        )}
        content={() => printRef.current}
      />

      {/* Session details (shown on screen, not printed) */}

      {/* Words list (for print) */}
      <div>
        <WordListPrint ref={printRef} session={session} words={words} />
      </div>
    </div>
  )
}
