import { Home } from '@/pages/home/Home'
import { UsersList } from '@/pages/users/UsersList'
import { Route, Routes } from 'react-router-dom'
import { PrivateRoutes } from './PrivateRoutes'
import { Login } from '@/pages/login/Login'
import { OptEmail } from '@/pages/opts/OptEmail'

export const Pages = () => {
  return (
    <Routes>
      <Route element={<PrivateRoutes />}>
        <Route path="/users/list" element={<UsersList />} />
        <Route path="/" element={<Home />} />
      </Route>

      <Route path="/verify-email" element={<OptEmail />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  )
}
