import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import { HamburgerButton } from './components/HamburgerButton'
import { AppContainer, Main, MainContainer } from './components/AppContainer'
import {
  Sidebar,
  SidebarBody,
  SidebarContainer,
  SidebarFooter,
  SidebarHeader,
} from './components/Navigation/Sidebar'
import { SidebarMenu } from './components/Navigation/SidebarMenu'
import { Button } from 'antd'

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen)
  }

  const login = () => {
    setIsAuthenticated(true)
  }

  const logout = () => {
    setIsAuthenticated(false)
  }

  return (
    <BrowserRouter>
      <AppContainer>
        {isAuthenticated && (
          <Sidebar
            className="bg-white"
            isOpen={isSidebarOpen}
            onClick={toggleSidebar}
          >
            <SidebarContainer>
              <SidebarHeader className=" p-4 flex items-center justify-start">
                <HamburgerButton
                  className="md:hidden pr-5"
                  onClick={toggleSidebar}
                />
                <div className="text-l font-bold">Entix</div>
                <div className="text-l">Academy</div>
              </SidebarHeader>
              <SidebarBody>
                <SidebarMenu onClick={toggleSidebar} />
              </SidebarBody>
              <SidebarFooter className="p-4 flex items-center justify-between">
                <Button onClick={logout} block>
                  Logout
                </Button>
              </SidebarFooter>
            </SidebarContainer>
          </Sidebar>
        )}
        <Main>
          {/* Navbar */}
          <header className="flex items-center md:justify-end justify-between bg-blue-200 h-16 px-4">
            {isAuthenticated ? (
              <HamburgerButton className="md:hidden" onClick={toggleSidebar} />
            ) : (
              <Button className="align-right" type="link" onClick={login}>
                Login
              </Button>
            )}
          </header>
          <MainContainer>
            {Array.from(new Array(100)).map((_, i) => (
              <div key={i} className="border-b p-4">
                <h1 className="text-2xl font-bold">Title</h1>
                <p className="text-gray-600">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptatem, quibusdam.
                </p>
              </div>
            ))}
          </MainContainer>
        </Main>
      </AppContainer>
    </BrowserRouter>
  )
}

export default App
