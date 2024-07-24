import { Badge } from 'antd'

interface IndicatorProps {
  color: string
  text?: string
}

export const Indicator = ({ color, text }: IndicatorProps) => (
  <Badge
    color={color}
    text={text}
    style={{
      paddingRight: '8px',
      borderRadius: '50%',
      display: 'inline-block',
    }}
  />
)
