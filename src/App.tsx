import { AppContainer } from './components/Layout/AppContainer'
import { MainContainer } from './components/Layout/MainContainer'
import { Drawer } from './components/Layout/Drawer'
import { Sidebar } from './components/Sidebar/Sidebar'
import { Pages } from './routes/Pages'
import { useAtom } from 'jotai'
import { sidebarOpenAtom } from './store/sidebar.atom'

function App() {
  const [isDrawerOpen, setIsDrawerOpen] = useAtom(sidebarOpenAtom)

  return (
    <AppContainer>
      <Drawer
        show={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        className="bg-gray-100"
      >
        <Sidebar />
      </Drawer>
      <MainContainer className="bg-gray-50">
        <Pages />
      </MainContainer>
    </AppContainer>
  )
}

export default App
