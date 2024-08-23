import { Badge } from 'antd'

export type IMoneyBadge = {
  balance: number | null | undefined
  currency: 'CNY' | 'ETP' | 'JPY' | 'USD'
  decimals: number
}

export const MoneyBadge = ({ balance, currency, decimals }: IMoneyBadge) => {
  return (
    <div>
      <Badge
        color="#374151"
        count={new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: currency,
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        }).format((balance || 0) / 100)}
      />
    </div>
  )
}
