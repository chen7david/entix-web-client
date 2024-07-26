import { AppContainer, Main, MainContainer } from './components/Layout'
import { HamburgerButton } from './components/HamburgerButton'
import Logo from '/entix-bw.svg'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Navbar } from './components/Navbar'
import { Pages } from './routes/Pages'

function App() {
  return (
    <>
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
    </>
  )
}

export default App
