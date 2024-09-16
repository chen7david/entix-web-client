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

  // Function to play the audio for the word list
  const playAudio = async () => {
    for (const word of words) {
      const englishAudio = new Audio(
        `https://api.entix.me/audio/${word.voiceEnUrl}`,
      )
      const chineseAudio = new Audio(
        `https://api.entix.me/audio/${word.voiceZhUrl}`,
      )

      // Play English audio
      await englishAudio.play()
      await new Promise((resolve) => {
        englishAudio.onended = resolve
      })

      // 2-second pause
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Play Chinese audio
      await chineseAudio.play()
      await new Promise((resolve) => {
        chineseAudio.onended = resolve
      })

      // 2-second pause before the next word
      await new Promise((resolve) => setTimeout(resolve, 2000))
    }
  }

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

      {/* Play button */}
      <button
        className="mb-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-4"
        onClick={playAudio}
      >
        Play Words
      </button>

      {/* Session details (shown on screen, not printed) */}

      {/* Words list (for print) */}
      <div>
        <WordListPrint ref={printRef} session={session} words={words} />
      </div>
    </div>
  )
}
