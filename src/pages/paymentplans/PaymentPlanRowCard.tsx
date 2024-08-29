import { Avatar } from 'antd'
import { IPaymentPlan } from 'entix-shared'
import { TagOutlined } from '@ant-design/icons'
import dayjs from 'dayjs'
type IPaymentPlanRowCardProps = {
  paymentPlan: IPaymentPlan
}
export const PaymentPlanRowCard = ({
  paymentPlan,
}: IPaymentPlanRowCardProps) => {
  return (
    <div className="bg-white rounded-lg items-center text-sm text-slate-700 p-2 md:p-4 grid grid-flow-row grid-rows-3  grid-cols-[0.5fr,1fr,0.2fr] md:grid-flow-cols md:grid-rows-1 md:grid-cols-[0.5fr,1fr,1fr,1fr,1fr]">
      <div className="flex h-full row-span-3 justify-center items-center md:justify-start">
        <Avatar
          style={{
            backgroundColor: 'gray',
          }}
          size={38}
        >
          <TagOutlined />
        </Avatar>
      </div>
      <div>{paymentPlan.name}</div>
      <div>{dayjs(paymentPlan.updatedAt).format('YYYY-MM-DD HH:mm')}</div>
    </div>
  )
}
