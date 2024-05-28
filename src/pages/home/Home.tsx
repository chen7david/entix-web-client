import viteLogo from '/vite.svg'
import { Button } from 'antd'
import { DollarOutlined } from '@ant-design/icons'
import { useState } from 'react'

export const Home = () => {
  const [count, setCount] = useState(0)

  return (
    <div className="flex h-screen bg-blue-200 justify-center items-center">
      <div className="flex flex-col gap-3 card text-blue-600 align-center">
        <h1 className="text-blue-400 text-3xl font-bold">
          Hello tailwind world!
        </h1>
        <img src={viteLogo} alt="Vite logo" />
        <Button
          icon={<DollarOutlined />}
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </Button>
        <Button loading onClick={() => setCount((count) => count + 1)}>
          Cashout
        </Button>
      </div>
    </div>
  )
}
