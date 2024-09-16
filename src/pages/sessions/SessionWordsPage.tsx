import { findOneSession } from '@/api/clients/session.client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import ReactToPrint from 'react-to-print'
import { ISession, IWord } from 'entix-shared'
import { getSessionWords } from '@/api/clients/session-words.cient'
import { WordListPrintOut } from './WordListPrintOut'

export const WordListPrint = ({
  session,
  words,
  documentTitle,
}: {
  session: ISession
  words: IWord[]
  documentTitle: string
}) => {
  const staticBaseUrl = (path: string) => `https://static.entix.me${path}`
  const audioRefs = useRef<HTMLAudioElement[]>([])
  const [playingIndex, setPlayingIndex] = useState<number | null>(null)
  const [isEnglish, setIsEnglish] = useState(true)
  const [isPlayingAll, setIsPlayingAll] = useState(false)

  const playAudio = (index: number, isEnglishAudio: boolean) => {
    const audio = isEnglishAudio
      ? audioRefs.current[index * 2]
      : audioRefs.current[index * 2 + 1]
    if (audio) {
      audio.play()
      setPlayingIndex(index)
      setIsEnglish(isEnglishAudio)
    }
  }

  const playAllAudio = () => {
    setIsPlayingAll(true)
    playAudio(0, true) // Start with the first word's English audio
  }

  const handleAudioEnd = (index: number) => {
    if (isPlayingAll) {
      const nextIndex = isEnglish ? index : index + 1
      if (nextIndex < words.length) {
        playAudio(nextIndex, !isEnglish) // Toggle between English and Chinese
      } else {
        setIsPlayingAll(false) // End of playlist
        setPlayingIndex(null)
      }
    } else {
      setPlayingIndex(null) // If not playing all, just reset the state
    }
  }

  useEffect(() => {
    // Attach audio end event listeners
    audioRefs.current.forEach((audio, i) => {
      if (audio) {
        audio.onended = () => handleAudioEnd(Math.floor(i / 2))
      }
    })
  }, [audioRefs.current, isEnglish, isPlayingAll])

  return (
    <>
      <div className="flex gap-2 items-center">
        <div>
          <h2 className="text-xl font-bold">{documentTitle}</h2>
          <p>{session?.xid}</p>
          <p>{dayjs(session?.startDate).format('YYYY-MM-DD')}</p>
        </div>
        <button
          onClick={playAllAudio}
          className="ml-auto p-1 bg-blue-500 text-white rounded-full hover:bg-blue-600"
        >
          Play
        </button>
      </div>

      <div className="space-y-2 mt-4">
        {words?.map((word, index) => (
          <div
            key={index}
            className={`flex items-center space-x-2 rounded ${
              index === playingIndex ? 'bg-yellow-200' : 'hover:bg-gray-100'
            }`}
          >
            <div className="flex-shrink-0 w-8 text-xs font-semibold">{`${index + 1}`}</div>
            <div
              className="flex-1 text-base font-medium cursor-pointer"
              onClick={() => playAudio(index, true)}
              style={{
                textDecoration:
                  index === playingIndex && isEnglish ? 'underline' : 'none',
              }}
            >
              {word.wordEn}
            </div>
            <audio
              ref={(el) => (audioRefs.current[index * 2] = el!)}
              src={staticBaseUrl('/audio/' + word.voiceEnUrl)}
            ></audio>
            <div
              className="flex-1 text-base cursor-pointer"
              onClick={() => playAudio(index, false)}
              style={{
                textDecoration:
                  index === playingIndex && !isEnglish ? 'underline' : 'none',
              }}
            >
              {word.wordZh}
            </div>
            <audio
              ref={(el) => (audioRefs.current[index * 2 + 1] = el!)}
              src={staticBaseUrl('/audio/' + word.voiceZhUrl)}
            ></audio>
          </div>
        ))}
      </div>
    </>
  )
}

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

  const documentTitle = () => {
    return `${dayjs(session?.startDate).format('YYMMDD')} - ${session?.name} -
    ${session?.description || 'None'}`
  }

  return (
    <div className="p-6">
      {/* Print button */}
      <ReactToPrint
        documentTitle={documentTitle()}
        trigger={() => (
          <button className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
            Print Word List
          </button>
        )}
        content={() => printRef.current}
      />
      {/* Words list (for print) */}
      <div hidden={true}>
        <WordListPrintOut
          ref={printRef}
          session={session}
          words={words}
          documentTitle={documentTitle()}
        />
      </div>
      <WordListPrint
        session={session}
        words={words}
        documentTitle={documentTitle()}
      />
    </div>
  )
}
