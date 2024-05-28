import { Route, Routes, HashRouter } from 'react-router-dom'
import { Home } from './pages/home/Home'
import { Register } from './pages/register/Register'
import { Navbar } from './components/Navbar'

function App() {
  return (
    // replace with browser router when not hosted at a /path like on github-pages
    <HashRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </HashRouter>
  )
}

export default App
