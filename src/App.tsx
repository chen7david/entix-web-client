import { Route, Routes, BrowserRouter } from 'react-router-dom'
import { Home } from './pages/home/Home'
import { Register } from './pages/register/Register'
import { Navbar } from './components/Navbar'

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
