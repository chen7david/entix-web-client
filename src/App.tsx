import { AppContainer } from './components/layout/AppContainer'
import { MainContainer } from './components/layout/MainContainer'
import { Drawer } from './components/layout/Drawer'
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
      <MainContainer>
        <Pages />
      </MainContainer>
    </AppContainer>
  )
}

export default App
