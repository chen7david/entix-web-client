import { useState } from 'react'
import { AppContainer, Main, MainContainer } from './components/Layout'
import { HashRouter } from 'react-router-dom'
import { Pages } from './pages/Pages'
import { ILoginFormState, Login } from './pages/login/Login'
import { HamburgerButton } from './components/HamburgerButton'
import Logo from '/entix-bw.svg'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Navbar } from './components/Navbar'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(true)
  const [isAdmin, setIsAdmin] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const logout = () => {
    setIsAuthenticated(false)
    setIsAdmin(false)
  }

  const handleLogin = (props: ILoginFormState) => {
    console.log('Form data submitted:', props)
    if (props.username === 'david' && props.password === 'david') {
      setIsAuthenticated(true)
      setIsAdmin(true)
    } else if (props.username === 'max' && props.password === 'max') {
      setIsAuthenticated(true)
    }
  }

  return (
    <HashRouter>
      {isAuthenticated ? (
        <AppContainer>
          <Sidebar
            className="bg-white"
            isOpen={isSidebarOpen}
            isAdmin={isAdmin}
            onToggleOpen={toggleSidebar}
            onLogout={logout}
          />
          <Main>
            <Navbar>
              <img className="w-8" src={Logo} alt="" />
              <HamburgerButton className="md:hidden" onClick={toggleSidebar} />
            </Navbar>
            <MainContainer>
              <Pages />
            </MainContainer>
          </Main>
        </AppContainer>
      ) : (
        <AppContainer>
          <Login onSubmit={handleLogin} />
        </AppContainer>
      )}
    </HashRouter>
  )
}

export default App
