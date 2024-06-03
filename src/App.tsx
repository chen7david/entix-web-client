import { useState } from 'react'
import { AppContainer } from './components/Layout'
import { Pages } from './pages/Pages'
import { ILoginFormState, Login } from './pages/login/Login'

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  const handleLogin = (props: ILoginFormState) => {
    console.log('Form data submitted:', props)
    if (props.username === 'chen7david' && props.password === '88888888')
      setIsAuthenticated(true)
  }

  return isAuthenticated ? (
    <AppContainer>
      <Pages />
    </AppContainer>
  ) : (
    <AppContainer>
      <Login onSubmit={handleLogin} />
    </AppContainer>
  )
}

export default App
