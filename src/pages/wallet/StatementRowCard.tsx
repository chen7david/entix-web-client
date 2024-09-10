import { IPaymentWithUser } from 'entix-shared'
import cn from 'classnames'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'
import { EditOutlined } from '@ant-design/icons'
import { useAtom } from 'jotai'
import { editPaymentAtom, editPaymentStatusAtom } from '@/store/payment.atom'
import { Button } from 'antd'
dayjs.extend(utc)

export interface IStatementRowCard
  extends React.HTMLAttributes<HTMLDivElement> {
  item: IPaymentWithUser
}

export const StatementRowCard = ({
  item,
  className,
  ...props
}: IStatementRowCard) => {
  const [, setEditPayment] = useAtom(editPaymentAtom)
  const [, setIsEditPayment] = useAtom(editPaymentStatusAtom)
  return (
    <div
      {...props}
      className={cn(
        'bg-white rounded-lg items-center text-sm text-slate-700 p-2 md:p-4 grid grid-flow-row grid-rows-3  grid-cols-[1fr,1fr,0.2fr] md:grid-flow-cols md:grid-rows-1 md:grid-cols-[1fr,1fr,1fr,1fr,1fr,1fr]',
        className,
      )}
    >
      <span className="">{`${item.firstName} ${item.lastName}`}</span>
      <div className="">{item.currencyType}</div>

      <div
        className={cn({
          'text-red-600': item.amount < 0,
          'text-green-600': item.amount > 0,
          'ml-1': item.amount > 0,
        })}
      >
        {item.amount / 100}
      </div>

      <div
        className={cn({
          'text-red-600': item.balance < 0,
          'text-green-600': item.balance > 0,
          'ml-1': item.balance > 0,
        })}
      >
        <span>{item.balance / 100}</span>
      </div>
      <div id="date">{dayjs(item.createdAt).format('YYYY-MM-DD')}</div>
      <Button
        type="text"
        shape="circle"
        icon={<EditOutlined />}
        onClick={() => {
          setEditPayment(item)
          setIsEditPayment(true)
        }}
      />
    </div>
  )
}
