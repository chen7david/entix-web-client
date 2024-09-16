import { QRCode } from 'antd'
import { ISession, IWord } from 'entix-shared'
import React from 'react'
import dayjs from 'dayjs'

export const WordListPrintOut = React.forwardRef<
  HTMLDivElement,
  { session: ISession; words: IWord[]; documentTitle: string }
>(({ session, words, documentTitle }, ref) => (
  <div ref={ref}>
    {/* Include session details at the top */}
    <div className="flex gap-2 items-center">
      <QRCode bordered={false} size={70} value={window.location.href} />
      <div className="">
        <h2 className="text-xl font-bold">{documentTitle}</h2>
        <p>{session?.xid}</p>
        <p>{dayjs(session?.startDate).format('YYYY-MM-DD')}</p>
      </div>
    </div>

    {/* Words list */}
    <div className="space-y-2 mt-4">
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
