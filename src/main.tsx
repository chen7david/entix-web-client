import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Provider } from 'jotai'
import { appStore } from './store/app.atom.ts'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // staleTime: 1000 * 60 * 5,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Provider store={appStore}>
        <App />
      </Provider>
    </QueryClientProvider>
  </React.StrictMode>,
)
