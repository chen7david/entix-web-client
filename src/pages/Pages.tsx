import { Route, Routes, HashRouter } from 'react-router-dom'
import { Home } from './home/Home'
import { Register } from './register/Register'

export const Pages = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </HashRouter>
  )
}
