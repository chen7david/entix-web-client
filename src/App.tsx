import { useState } from 'react'
import viteLogo from '/vite.svg'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="flex h-screen bg-blue-200 justify-center items-center">
      <div className="flex flex-col gap-3 card text-blue-600 align-center">
        <h1 className="text-blue-400 text-3xl font-bold">
          Hello tailwind world!
        </h1>
        <img src={viteLogo} alt="Vite logo" />
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded"
          onClick={() => setCount((count) => count + 1)}
        >
          count is {count}
        </button>
      </div>
    </div>
  )
}

export default App
