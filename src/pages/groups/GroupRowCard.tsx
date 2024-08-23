import { IGroup } from 'entix-shared'
import { useAtom } from 'jotai'
import { Button } from 'antd'
import cn from 'classnames'
import { EditOutlined, CalendarOutlined } from '@ant-design/icons'
import { editGroupAtom, editGroupStatusAtom } from '@/store/group.atom'
import dayjs from 'dayjs'

export interface IGroupRowCard extends React.HTMLAttributes<HTMLDivElement> {
  group: IGroup
}

export const GroupRowCard = ({ group, className, ...props }: IGroupRowCard) => {
  const [, setEditGroup] = useAtom(editGroupAtom)
  const [, setIsEditingGroup] = useAtom(editGroupStatusAtom)
  return (
    <div
      {...props}
      className={cn(
        'bg-white rounded-lg items-center text-sm text-slate-700 p-2 md:p-4 grid grid-flow-row grid-rows-3  grid-cols-[0.5fr,1fr,0.2fr] md:grid-flow-cols md:grid-rows-1 md:grid-cols-[0.5fr,1fr,1fr,1fr,1fr]',
        className,
      )}
    >
      <div className="flex h-full row-span-3 justify-center items-center md:justify-start">
        icon
      </div>
      <span className="">{group.name}</span>
      <span className="">{dayjs(group.startDate).format('YYYY-MM-DD')}</span>
      <span className="">{group.duration}</span>
      <div
        id="actions"
        className="flex flex-col md:flex-row md:gap-1 col-start-3 col-end-4 row-start-1 row-end-4 md:col-start-auto md:col-end-auto md:row-start-auto md:row-end-auto"
      >
        <Button
          type="text"
          shape="circle"
          icon={<EditOutlined />}
          onClick={() => {
            setEditGroup(group)
            setIsEditingGroup(true)
          }}
        />
        <Button type="text" shape="circle" icon={<CalendarOutlined />} />
      </div>
    </div>
  )
}
