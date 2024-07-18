import { useState } from 'react'
import { AppContainer, Main, MainContainer } from './components/Layout'
import { HashRouter } from 'react-router-dom'
import { Pages } from './pages/Pages'
import { Login } from './pages/login/Login'
import { HamburgerButton } from './components/HamburgerButton'
import Logo from '/entix-bw.svg'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Navbar } from './components/Navbar'
import { useAtom } from 'jotai'
import { isLoginAtom } from './store/auth.atom'
import { BrowserStore } from './store/browserstore.store'

function App() {
  const [isLogin, setIsLogin] = useAtom(isLoginAtom)
  const [isAdmin, setIsAdmin] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const logout = () => {
    setIsLogin(false)
    setIsAdmin(false)
    BrowserStore.clear()
  }

  return (
    <HashRouter>
      {isLogin ? (
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
          <Login />
        </AppContainer>
      )}
    </HashRouter>
  )
}

export default App
