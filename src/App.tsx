import { useState } from 'react'
import { AppContainer, Main, MainContainer } from './components/Layout'
import { BrowserRouter } from 'react-router-dom'
import { Pages } from './pages/Pages'
import { ILoginFormState, Login } from './pages/login/Login'
import { HamburgerButton } from './components/HamburgerButton'
import { Avatar, Button } from 'antd'
import Logo from '/entix-bw.svg'
import {
  Sidebar,
  SidebarBody,
  SidebarContainer,
  SidebarFooter,
  SidebarHeader,
} from './components/Sidebar/Sidebar'
import { SidebarMenu } from './components/Sidebar/SidebarMenu'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAdmin, setIsAdmin] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const login = () => {
    setIsAuthenticated(true)
    setIsAdmin(true)
  }

  const logout = () => {
    setIsAuthenticated(false)
  }

  const handleLogin = (props: ILoginFormState) => {
    console.log('Form data submitted:', props)
    if (props.username === 'chen7david' && props.password === '88888888')
      setIsAuthenticated(true)
  }

  return isAuthenticated ? (
    <BrowserRouter>
      <AppContainer>
        <Sidebar
          className="bg-white"
          isOpen={isSidebarOpen}
          onClick={toggleSidebar}
        >
          <SidebarContainer>
            <SidebarHeader className=" p-4 flex items-center gap-2">
              <Avatar size={50} />
              <div className="flex flex-col">
                <div className="text-sm font-bold">David Chen</div>
                <div className="text-xs font-light ">Teacher</div>
              </div>
              <hr className="lex-grow border-gray-200" />
            </SidebarHeader>
            <SidebarBody>
              <SidebarMenu isAdmin={isAdmin} onClick={toggleSidebar} />
            </SidebarBody>
            <SidebarFooter className="p-4 flex items-center justify-between">
              <Button onClick={logout} block>
                Logout
              </Button>
            </SidebarFooter>
          </SidebarContainer>
        </Sidebar>

        <Main>
          {/* Navbar */}
          <header className="flex md:hidden items-center justify-between h-16 px-4">
            {isAuthenticated ? (
              <>
                <img className="w-8" src={Logo} alt="" />
                <HamburgerButton
                  className="md:hidden"
                  onClick={toggleSidebar}
                />
              </>
            ) : (
              <Button className="align-right" type="link" onClick={login}>
                Login
              </Button>
            )}
          </header>
          <MainContainer>
            <Pages />
          </MainContainer>
        </Main>
      </AppContainer>
    </BrowserRouter>
  ) : (
    <AppContainer>
      <Login onSubmit={handleLogin} />
    </AppContainer>
  )
}

export default App
