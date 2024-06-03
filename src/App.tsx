import { Route, Routes, HashRouter } from 'react-router-dom'
import { Home } from './pages/home/Home'
import { Register } from './pages/register/Register'
import { AppContainer } from './components/AppContainer'

function App() {
  return (
    <HashRouter>
      <AppContainer className="bg-gradient-to-b from-blue-50 justify-center items-center">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </AppContainer>
    </HashRouter>
  )
}

export default App
