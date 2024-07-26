import { AppContainer, Main, MainContainer } from './components/Layout'

import { Pages } from './pages/Pages'
import { HamburgerButton } from './components/HamburgerButton'
import Logo from '/entix-bw.svg'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Navbar } from './components/Navbar'
import { useAtom } from 'jotai'
import { isLoginAtom } from './store/auth.atom'
import { Login } from '@/pages/login/Login'

function App() {
  const [isLogin] = useAtom(isLoginAtom)

  return (
    <>
      {isLogin ? (
        <AppContainer>
          <Sidebar />
          <Main>
            <Navbar>
              <img className="w-8" src={Logo} alt="" />
              <HamburgerButton className="md:hidden" />
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
    </>
  )
}

export default App
