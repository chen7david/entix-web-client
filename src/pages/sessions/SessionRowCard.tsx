import { ISession } from 'entix-shared'
import { useAtom } from 'jotai'
import { Avatar, Button } from 'antd'
import cn from 'classnames'
import { EditOutlined, FundProjectionScreenOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
import { editSessionAtom, editSessionStatusAtom } from '@/store/session.atom'

export interface ISessionRowCard extends React.HTMLAttributes<HTMLDivElement> {
  session: ISession
}

export const SessionRowCard = ({
  session,
  className,
  ...props
}: ISessionRowCard) => {
  const [, setEditSession] = useAtom(editSessionAtom)
  const [, setIsEditingSession] = useAtom(editSessionStatusAtom)
  return (
    <div
      {...props}
      className={cn(
        'bg-white rounded-lg items-center text-sm text-slate-700 p-2 md:p-4 grid grid-flow-row grid-rows-5  grid-cols-[0.5fr,1fr,0.2fr] md:grid-flow-cols md:grid-rows-1 md:grid-cols-[0.5fr,1fr,1fr,1fr,1fr]',
        className,
      )}
    >
      <div className="flex h-full row-span-3 justify-center items-center md:justify-start">
        <Avatar
          style={{
            backgroundColor: 'gray',
          }}
          size={38}
        >
          <FundProjectionScreenOutlined />
        </Avatar>
      </div>
      <span className="">{session.name}</span>
      <span className="">{dayjs(session.startDate).format('dddd')}</span>
      <span className="md:text-center">{session.duration}</span>
      <div
        id="actions"
        className="flextext-center flex-col md:flex-row md:gap-1 col-start-3 col-end-4 row-start-1 row-end-4 md:col-start-auto md:col-end-auto md:row-start-auto md:row-end-auto"
      >
        <Button
          type="text"
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => {
            setEditSession(session)
            setIsEditingSession(true)
          }}
        />
      </div>
    </div>
  )
}
