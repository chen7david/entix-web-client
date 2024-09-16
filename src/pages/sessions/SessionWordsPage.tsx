import { findOneSession } from '@/api/clients/session.client'
import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import dayjs from 'dayjs'
import { useEffect, useRef, useState } from 'react'
import ReactToPrint from 'react-to-print'
import { ISession, IWord } from 'entix-shared'
import { getSessionWords } from '@/api/clients/session-words.cient'
import { WordListPrintOut } from './WordListPrintOut'
import { Button, Select } from 'antd'
import { useAtom } from 'jotai'
import { isAdminAtom } from '@/store/auth.atom'

const { Option } = Select

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
  const [isPaused, setIsPaused] = useState(false)
  const [pauseDuration, setPauseDuration] = useState<number>(1000) // Default pause duration in milliseconds
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1) // Default playback speed

  const playAudio = (index: number, isEnglishAudio: boolean) => {
    const audio = isEnglishAudio
      ? audioRefs.current[index * 2]
      : audioRefs.current[index * 2 + 1]

    if (audio) {
      if (!isPaused || playingIndex !== index || isEnglish !== isEnglishAudio) {
        // Start from the beginning of the current word
        audio.currentTime = 0
      }
      audio.play()
      audio.playbackRate = playbackSpeed
      setPlayingIndex(index)
      setIsEnglish(isEnglishAudio)
      setIsPaused(false)
    }
  }

  const pauseAudio = () => {
    const audio = isEnglish
      ? audioRefs.current[playingIndex! * 2]
      : audioRefs.current[playingIndex! * 2 + 1]
    if (audio) {
      audio.pause()
      setIsPaused(true)
    }
  }

  const togglePlayPause = () => {
    if (isPaused) {
      // Resume playing the current word
      playAudio(playingIndex!, isEnglish)
    } else if (playingIndex !== null) {
      // Pause the current audio
      pauseAudio()
    } else {
      // Start playing all from the first word
      playAllAudio()
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
        setTimeout(() => {
          playAudio(nextIndex, !isEnglish) // Toggle between English and Chinese
        }, pauseDuration)
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
  }, [audioRefs.current, isEnglish, isPlayingAll, pauseDuration, playbackSpeed])

  return (
    <>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold">{documentTitle}</h2>
            <p className="text-lg">{session?.xid}</p>
            <p className="text-lg">
              {dayjs(session?.startDate).format('YYYY-MM-DD')}
            </p>
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <div>
            <p className="font-medium">Pause Duration</p>
            <Select
              defaultValue="1000"
              style={{ width: 120 }}
              onChange={(value) => setPauseDuration(Number(value))}
            >
              <Option value={500}>500ms</Option>
              <Option value={1000}>1s</Option>
              <Option value={1500}>1.5s</Option>
              <Option value={2000}>2s</Option>
              <Option value={3000}>3s</Option>
              <Option value={5000}>5s</Option>
            </Select>
          </div>
          <div>
            <p className="font-medium">Playback Speed</p>
            <Select
              defaultValue="1"
              style={{ width: 120 }}
              onChange={(value) => setPlaybackSpeed(Number(value))}
            >
              <Option value={0.5}>0.5x</Option>
              <Option value={1}>1x</Option>
              <Option value={1.5}>1.5x</Option>
              <Option value={2}>2x</Option>
            </Select>
          </div>
          <Button className="mt-6" type="primary" onClick={togglePlayPause}>
            {isPaused || playingIndex === null ? 'Play' : 'Pause'}
          </Button>
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
      </div>
    </>
  )
}

export const SessionWordsPage = () => {
  const [isAdmin] = useAtom(isAdminAtom)
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
          <button
            hidden={!isAdmin}
            className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
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
