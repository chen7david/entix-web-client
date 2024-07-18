import { useState } from 'react'
import { AppContainer, Main, MainContainer } from './components/Layout'
import { HashRouter } from 'react-router-dom'
import { Pages } from './pages/Pages'
import { ILoginFormState, Login } from './pages/login/Login'
import { HamburgerButton } from './components/HamburgerButton'
import Logo from '/entix-bw.svg'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Navbar } from './components/Navbar'
import { useAtom } from 'jotai'
import { currUserAtom, isLoginAtom } from './store/auth.atom'
import { IViewUserLoginDto } from 'entix-shared/dist/models/auth/auth.model'
import { http } from './http'
import { BrowserStore } from './store/browserstore.store'

function App() {
  const [isLogin, setIsLogin] = useAtom(isLoginAtom)
  const [isAdmin, setIsAdmin] = useState(true)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [_, setCurrUser] = useAtom(currUserAtom)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const logout = () => {
    setIsLogin(false)
    setIsAdmin(false)
    BrowserStore.clear()
  }

  const onLogin = async (formData: ILoginFormState) => {
    const { data } = await http.post<IViewUserLoginDto>(
      '/api/v1/auth/login',
      formData,
    )
    setCurrUser(data.user)
    setIsLogin(true)
    BrowserStore.setAccessToken(data.accessToken)
    BrowserStore.setRefreshToken(data.refreshToken)
    BrowserStore.setCurrUser(data.user)
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
          <Login onSubmit={onLogin} />
        </AppContainer>
      )}
    </HashRouter>
  )
}

export default App
